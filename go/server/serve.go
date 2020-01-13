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
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"github.com/sirupsen/logrus"
	"google.golang.org/grpc"

	grpc_middleware "github.com/grpc-ecosystem/go-grpc-middleware"
	grpc_logrus "github.com/grpc-ecosystem/go-grpc-middleware/logging/logrus"
	grpc_recovery "github.com/grpc-ecosystem/go-grpc-middleware/recovery"
	grpc_prometheus "github.com/grpc-ecosystem/go-grpc-prometheus"
	"github.com/improbable-eng/grpc-web/go/grpcweb"
)

// ServeForever runs?
func ServeForever(cancelCtx context.Context, public bool, port int, dbPath string) {
	lis, err := net.Listen("tcp", fmt.Sprintf("0.0.0.0:%d", port))
	panicIf(err)

	log.Println("Server started, listening to port", port)

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
	panicIf(err)
	defer db.Close()

	newLogger := logrus.New()
	logrusEntry := logrus.NewEntry(newLogger)
	// Shared options for the logger, with a custom gRPC code to log level function.

	// Make sure that log statements internal to gRPC library are logged using the logrus Logger as well.
	grpc_logrus.ReplaceGrpcLogger(logrusEntry)

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

	wrappedGrpc := grpcweb.WrapServer(grpcServer,
		grpcweb.WithCorsForRegisteredEndpointsOnly(false),
		grpcweb.WithOriginFunc(func(origin string) bool { return true }),
	)
	go http.ListenAndServe(":8080", http.HandlerFunc(func(resp http.ResponseWriter, req *http.Request) {
		logrus.WithFields(logrus.Fields{
			"path":               req.URL.Path,
			"method":             req.Method,
			"is_acceptable_cors": wrappedGrpc.IsAcceptableGrpcCorsRequest(req),
		}).Info("Received grpc web proxy request")
		wrappedGrpc.ServeHTTP(resp, req)
	}))

	box := packr.New("asserts", "../protos")
	go http.ListenAndServe(":3020", http.FileServer(box))

	s := &ProxyServer{db, newLogger}
	modelzoo.RegisterModelzooServiceServer(grpcServer, s)

	// Register Prometheus metrics handler.
	grpc_prometheus.Register(grpcServer)
	http.Handle("/metrics", promhttp.Handler())
	go http.ListenAndServe(":9999", nil)

	cancelFunc := func() {
		select {
		case <-cancelCtx.Done():
			grpcServer.Stop()
		}
	}
	go cancelFunc()

	grpcServer.Serve(lis)
}
