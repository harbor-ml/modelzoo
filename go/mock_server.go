package main

import (
	"bytes"
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net"
	"net/http"

	panichandler "github.com/kazegusuri/grpc-panic-handler"
	dataurl "github.com/vincent-petithory/dataurl"

	services "modelzoo/go/protos"

	proto "github.com/golang/protobuf/proto"
	"google.golang.org/grpc"
)

const port int = 9090

// const modelAddrTemplate string = "http://54.213.2.210:1337/%v/predict"

const modelAddrTemplate string = "http://mock-backend:8000/%v/predict"

var avaiableModels = []*services.GetModelsResp_Model{
	{ModelName: "res50-pytorch", ModelCategory: services.ModelCategory_VISIONCLASSIFICATION},
	{ModelName: "squeezenet-pytorch", ModelCategory: services.ModelCategory_VISIONCLASSIFICATION},
	{ModelName: "rise-pytorch", ModelCategory: services.ModelCategory_TEXTGENERATION},
	{ModelName: "marvel-pytorch", ModelCategory: services.ModelCategory_TEXTGENERATION},
	{ModelName: "image-segmentation", ModelCategory: services.ModelCategory_IMAGESEGMENTATION},
}

func panicIf(e interface{}) {
	if e != nil {
		panic(e)
	}
}

func postJSON(url string, payload map[string]string) (message map[string]interface{}) {
	serializedBytes, err := json.Marshal(payload)
	panicIf(err)

	resp, err := http.Post(url, "application/json", bytes.NewBuffer(serializedBytes))
	panicIf(err)

	if resp.StatusCode != 200 {
		panicIf(resp)
	}

	defer resp.Body.Close()

	json.NewDecoder(resp.Body).Decode(&message)
	return
}

type mockModelServer struct {
	reqID int
}

func (s *mockModelServer) GetImage(
	c context.Context, req *services.ImageDownloadRequest) (
	*services.ImageDownloadResponse, error) {

	url := req.GetUrl()
	resp, err := http.Get(url)
	panicIf(err)

	defer resp.Body.Close()

	bodyBytes, err := ioutil.ReadAll(resp.Body)
	panicIf(err)
	codedBody := dataurl.EncodeBytes(bodyBytes)
	result := &services.ImageDownloadResponse{
		Image: codedBody,
	}

	return result, nil
}

func (s *mockModelServer) ListModels(
	c context.Context, req *services.GetModelsReq) (
	*services.GetModelsResp, error) {
	resp := &services.GetModelsResp{
		Models: avaiableModels,
	}
	return resp, nil
}

func (s *mockModelServer) VisionClassification(
	c context.Context, req *services.VisionClassificationRequest) (
	*services.VisionClassificationResponse, error) {

	serializedReq, err := proto.Marshal(req)
	panicIf(err)
	encodedReq := base64.StdEncoding.EncodeToString(serializedReq)
	payload := map[string]string{"input": encodedReq}
	modelAddr := fmt.Sprintf(modelAddrTemplate, req.GetModelName())
	resp := postJSON(modelAddr, payload)
	val := &services.VisionClassificationResponse{}
	decoded, err := base64.StdEncoding.DecodeString(resp["output"].(string))
	panicIf(err)
	proto.Unmarshal(decoded, val)
	s.reqID++

	return val, nil
}

func (s *mockModelServer) ImageSegmentation(
	c context.Context, req *services.ImageSegmentationRequest) (
	*services.ImageSegmentationResponse, error) {

	serializedReq, err := proto.Marshal(req)
	panicIf(err)
	encodedReq := base64.StdEncoding.EncodeToString(serializedReq)
	payload := map[string]string{"input": encodedReq}
	modelAddr := fmt.Sprintf(modelAddrTemplate, req.GetModelName())
	resp := postJSON(modelAddr, payload)
	val := &services.ImageSegmentationResponse{}
	decoded, err := base64.StdEncoding.DecodeString(resp["output"].(string))
	panicIf(err)
	proto.Unmarshal(decoded, val)
	s.reqID++

	return val, nil
}

func (s *mockModelServer) TextGeneration(
	c context.Context, req *services.TextGenerationRequest) (
	*services.TextGenerationResponse, error) {

	serializedReq, err := proto.Marshal(req)
	panicIf(err)
	encodedReq := base64.StdEncoding.EncodeToString(serializedReq)
	payload := map[string]string{"input": encodedReq}
	modelAddr := fmt.Sprintf(modelAddrTemplate, req.GetModelName())
	resp := postJSON(modelAddr, payload)
	// log.Println(resp)

	if resp["default"].(bool) {
		panic(resp["default_reason"])
	}
	val := &services.TextGenerationResponse{}

	decoded, err := base64.StdEncoding.DecodeString(resp["output"].(string))
	panicIf(err)
	proto.Unmarshal(decoded, val)
	s.reqID++

	return val, nil
}

func main() {
	lis, err := net.Listen("tcp", fmt.Sprintf("0.0.0.0:%d", port))
	if err != nil {
		panic(err)
	}
	log.Println("Server started, listening to port", port)

	panichandler.InstallPanicHandler(panichandler.LogPanicDump)
	uIntOpt := grpc.UnaryInterceptor(panichandler.UnaryPanicHandler)
	sIntOpt := grpc.StreamInterceptor(panichandler.StreamPanicHandler)
	grpcServer := grpc.NewServer(uIntOpt, sIntOpt)

	// grpcServer := grpc.NewServer()

	s := &mockModelServer{0}
	services.RegisterModelServer(grpcServer, s)
	grpcServer.Serve(lis)

}
