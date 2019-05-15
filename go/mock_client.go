package main

import (
	"context"
	"log"

	services "github.com/harbor-ml/modelzoo/go/protos"
	"google.golang.org/grpc"
)

const serverAddr string = "localhost:9090"

func main() {
	conn, err := grpc.Dial(serverAddr, grpc.WithInsecure())
	if err != nil {
		panic(err)
	}
	defer conn.Close()

	client := services.NewModelClient(conn)

	req := services.VisionClassificationRequest{}
	resp, err := client.VisionClassification(context.Background(), &req)
	if err != nil {
		panic(err)
	}

	log.Println(resp)
}
