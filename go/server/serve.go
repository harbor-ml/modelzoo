package server

import (
	"context"
	"fmt"
	"log"
	"net"

	modelzoo "github.com/harbor-ml/modelzoo/go/protos"
	"github.com/jinzhu/gorm"
	"github.com/sirupsen/logrus"
	"google.golang.org/grpc"

	grpc_middleware "github.com/grpc-ecosystem/go-grpc-middleware"
	grpc_logrus "github.com/grpc-ecosystem/go-grpc-middleware/logging/logrus"
)

// ServeForever runs?
func ServeForever(cancelCtx context.Context, public bool, port int) {
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
		dbURL = "/tmp/modelzoo.db"
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
		)),
		grpc.UnaryInterceptor(grpc_middleware.ChainUnaryServer(
			grpc_logrus.UnaryServerInterceptor(logrusEntry),
		)),
	)

	s := &ProxyServer{db, newLogger}
	modelzoo.RegisterModelzooServiceServer(grpcServer, s)

	cancelFunc := func() {
		select {
		case <-cancelCtx.Done():
			grpcServer.Stop()
		}
	}
	go cancelFunc()

	grpcServer.Serve(lis)
}
