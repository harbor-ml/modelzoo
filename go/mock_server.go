package main

import (
	"bytes"
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"log"
	"net"
	"net/http"

	services "github.com/harbor-ml/modelzoo/go/protos"
	"google.golang.org/grpc"
)

const port int = 9090
const modelAddr string = "http://127.0.0.1:8000"

func postJSON(url string, payload map[string]interface{}) (message map[string]interface{}) {
	serializedBytes, err := json.Marshal(payload)
	if err != nil {
		log.Fatalln(err)
	}

	resp, err := http.Post(url, "application/json", bytes.NewBuffer(serializedBytes))
	if err != nil {
		log.Fatalln(err)
	}

	json.NewDecoder(resp.Body).Decode(&message)
	return
}

type mockModelServer struct {
	reqID int
}

func (s *mockModelServer) VisionClassification(
	c context.Context, req *services.VisionClassificationRequest) (
	*services.VisionClassificationResponse, error) {

	log.Printf("Recv: %d, %v\n", s.reqID, req)

	encodedReq := base64.StdEncoding.EncodeToString([]byte(req.String()))
	log.Printf("Encoded Request! %v", encodedReq)

	// Create dummy input
	result := services.VisionClassificationResponse_Result{
		Rank:     1,
		Category: "Pikachu",
		Proba:    0.99,
	}
	lst := []*services.VisionClassificationResponse_Result{&result}
	val := services.VisionClassificationResponse{
		Results: lst,
	}

	// This might require a lock
	s.reqID++

	return &val, nil
}

func main() {
	lis, err := net.Listen("tcp", fmt.Sprintf("localhost:%d", port))
	if err != nil {
		panic(err)
	}
	log.Println("Server started, listening to port", port)

	grpcServer := grpc.NewServer()
	s := &mockModelServer{0}
	services.RegisterModelServer(grpcServer, s)
	grpcServer.Serve(lis)

}
