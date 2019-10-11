package server

import (
	"context" // Use "golang.org/x/net/context" for Golang version <= 1.6
	"fmt"
	"net/http"

	"github.com/golang/glog"
	"github.com/grpc-ecosystem/grpc-gateway/runtime"
	"google.golang.org/grpc"

	gw "github.com/harbor-ml/modelzoo/go/protos" // Update
)

func run(grpcPort int, port int) error {
	ctx := context.Background()
	ctx, cancel := context.WithCancel(ctx)
	defer cancel()

	// Register gRPC server endpoint
	// Note: Make sure the gRPC server is running properly and accessible
	mux := runtime.NewServeMux()
	opts := []grpc.DialOption{grpc.WithInsecure()}
	err := gw.RegisterYourServiceHandlerFromEndpoint(ctx, mux, fmt.Sprintf("localhost:%d", grpcPort), opts)
	if err != nil {
		return err
	}

	// Start HTTP server (and proxy calls to gRPC server endpoint)
	return http.ListenAndServe(fmt.Sprintf(":%d", port), mux)
}

func ProxyForever(grpcPort int, port int) {
	defer glog.Flush()

	if err := run(grpcPort, port); err != nil {
		glog.Fatal(err)
	}
}
