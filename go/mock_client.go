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

	req := services.VisionClassificationRequest{
		InputImage: "hiiiiiiiiii",
		NumReturns: 3,
		ModelName:
	}
	resp, err := client.VisionClassification(context.Background(), &req)
	if err != nil {
		panic(err)
	}

	log.Println(resp)

	req2 := services.ImageDownloadRequest{
		Url: "https://i.pinimg.com/originals/ee/e7/5d/eee75d6e875e7e205a1394aaa96fad12.png",
	}
	resp2, _ := client.GetImage(context.Background(), &req2)
	log.Println(resp2.Image[:40])

	req3 := services.VisionClassificationGetModelsReq{}
	resp3, _ := client.ListModels(context.Background(), &req3)
	log.Println(resp3)
}
