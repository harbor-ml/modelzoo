package server

import (
	"context"
	"fmt"
	"log"
	"net"
	"net/http"

	"github.com/gobuffalo/packr/v2"
	modelzoo "github.com/harbor-ml/modelzoo/go/protos"
	"github.com/jinzhu/gorm"
	. "github.com/logrusorgru/aurora"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"github.com/sirupsen/logrus"
	"google.golang.org/grpc"

	grpc_middleware "github.com/grpc-ecosystem/go-grpc-middleware"
	grpc_logrus "github.com/grpc-ecosystem/go-grpc-middleware/logging/logrus"
	grpc_recovery "github.com/grpc-ecosystem/go-grpc-middleware/recovery"
	grpc_prometheus "github.com/grpc-ecosystem/go-grpc-prometheus"
	"github.com/improbable-eng/grpc-web/go/grpcweb"
)

// ServeForever runs the server
func ServeForever(
	cancelCtx context.Context,
	public bool,
	dbPath string,
	grpcPort uint16,
	staticPort uint16,
	grpcWebPort uint16,
	grpcHTTPPort uint16,
	prometheusPort uint16,
) {
	// Configure database
	var dbType string
	var dbURL string
	if public {
		dbType = "postgres"
		dbURL = "host=34.213.216.228 port=5432 user=modelzoo"
	} else {
		dbType = "sqlite3"
		if dbPath == "" {
			dbURL = CreateTempFile("*.db")
		} else {
			dbURL = dbPath
		}
	}
	db, err := gorm.Open(dbType, dbURL)
	log.Println("Connect to database at", dbURL)
	panicIf(err)
	defer db.Close()

	// Configure Logger
	newLogger := logrus.New()
	logrusEntry := logrus.NewEntry(newLogger)
	grpc_logrus.ReplaceGrpcLogger(logrusEntry)

	// Configure out core server
	server := &ProxyServer{db, newLogger}

	// Configure gRPC server
	lis, err := net.Listen("tcp", fmt.Sprintf("0.0.0.0:%d", grpcPort))
	panicIf(err)
	grpcServer := grpc.NewServer(
		grpc.StreamInterceptor(grpc_middleware.ChainStreamServer(
			grpc_logrus.StreamServerInterceptor(logrusEntry),
			grpc_prometheus.StreamServerInterceptor,
			grpc_recovery.StreamServerInterceptor(),
		)),
		grpc.UnaryInterceptor(grpc_middleware.ChainUnaryServer(
			grpc_logrus.UnaryServerInterceptor(logrusEntry),
			grpc_prometheus.UnaryServerInterceptor,
			grpc_recovery.UnaryServerInterceptor(),
		)),
	)
	modelzoo.RegisterModelzooServiceServer(grpcServer, server)
	cancelFunc := func() {
		select {
		case <-cancelCtx.Done():
			grpcServer.Stop()
		}
	}
	go cancelFunc()
	log.Println("gRPC Server started, listening to port", Green(grpcPort))
	go grpcServer.Serve(lis)

	// Configure grpcWeb frontend server
	wrappedGrpc := grpcweb.WrapServer(grpcServer,
		grpcweb.WithCorsForRegisteredEndpointsOnly(false),
		grpcweb.WithOriginFunc(func(origin string) bool { return true }),
	)
	log.Println("Started gRPC Web (frontend) server listening at", Green(grpcWebPort))
	frontendServerMux := http.NewServeMux()
	frontendServerMux.HandleFunc("/", func(resp http.ResponseWriter, req *http.Request) {
		logrus.WithFields(logrus.Fields{
			"path":               req.URL.Path,
			"method":             req.Method,
			"is_acceptable_cors": wrappedGrpc.IsAcceptableGrpcCorsRequest(req),
		}).Info("Received grpc web proxy request")
		wrappedGrpc.ServeHTTP(resp, req)
	})
	go http.ListenAndServe(fmt.Sprintf(":%d", grpcWebPort), frontendServerMux)

	// Configure static assets
	box := packr.New("asserts", "../../js/build")
	log.Println("Started static web server at port", Green(staticPort))
	staticServerMux := http.NewServeMux()
	staticServerMux.Handle("/", http.FileServer(box))
	go http.ListenAndServe(fmt.Sprintf(":%d", staticPort), staticServerMux)

	// Configure HTTP JSON proxy
	log.Println("Started HTTP JSON reverse proxy at port", Green(grpcHTTPPort))
	go ProxyForever(grpcPort, grpcHTTPPort)

	// Register Prometheus metrics handler.
	grpc_prometheus.Register(grpcServer)
	log.Println("Started prometheus metric at port", Green(prometheusPort))
	metricMux := http.NewServeMux()
	metricMux.Handle("/metrics", promhttp.Handler())
	go http.ListenAndServe(fmt.Sprintf(":%d", prometheusPort), metricMux)

	// Block forever
	select {}
}
