package server

import (
	"context"
	"encoding/base64"
	"fmt"
	"io/ioutil"
	"log"
	"net"
	"net/http"

	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"

	dataurl "github.com/vincent-petithory/dataurl"

	dbimpl "github.com/harbor-ml/modelzoo/go/db"
	services "github.com/harbor-ml/modelzoo/go/protos"

	"github.com/jinzhu/gorm"

	proto "github.com/golang/protobuf/proto"
	"google.golang.org/grpc"
)

// ProxyServer implements the generated model server from services.proto
type ProxyServer struct {
	reqID             int
	db                *gorm.DB
	availableModels   []dbimpl.Model
	modelAddrTemplate string
}

// GetImage download an image from a url
func (s *ProxyServer) GetImage(
	c context.Context, req *services.ImageDownloadRequest) (
	*services.ImageDownloadResponse, error) {

	url := req.GetUrl()
	resp, err := http.Get(url)
	if err != nil || resp.StatusCode != 200 {
		return nil, status.Error(codes.NotFound,
			fmt.Sprintf("Modelzoo was not able to retrieve the image at %s", url))
	}

	defer resp.Body.Close()

	bodyBytes, err := ioutil.ReadAll(resp.Body)
	panicIf(err) // can't parse HTTP response, shouldn't happen

	codedBody := dataurl.EncodeBytes(bodyBytes)
	result := &services.ImageDownloadResponse{
		Image: codedBody,
	}

	return result, nil
}

// ListModels returns the list of models in current db.
func (s *ProxyServer) ListModels(
	c context.Context, req *services.GetModelsReq) (
	*services.GetModelsResp, error) {

	// TODO: availableModels should be retrieved from the server eacht time
	models := make([]*services.GetModelsResp_Model, len(s.availableModels))
	for index, model := range s.availableModels {
		models[index] = &services.GetModelsResp_Model{
			ModelName:     model.Name,
			ModelCategory: services.ModelCategory(model.ModelCategory),
			Uuid:          model.ID.String(),
		}
	}

	resp := &services.GetModelsResp{
		Models: models,
	}

	return resp, nil
}

// VisionClassification returns
func (s *ProxyServer) VisionClassification(
	c context.Context, req *services.VisionClassificationRequest) (
	*services.ModelResponse, error) {

	serializedReq, err := proto.Marshal(req)
	panicIf(err)
	encodedReq := base64.StdEncoding.EncodeToString(serializedReq)
	payload := map[string]string{"input": encodedReq}
	name, err := dbimpl.GetModelName(s.db, req.GetToken(), req.GetModelUuid())
	if err != nil {
		v := &services.TextGenerationResponse{GeneratedTexts: []string{name}}
		return &services.ModelResponse{TypeString: "text", Text: v}, nil
	}
	modelAddr := fmt.Sprintf(s.modelAddrTemplate, name)
	resp := postJSON(modelAddr, payload)
	val := &services.ModelResponse{}
	decoded, err := base64.StdEncoding.DecodeString(resp["output"].(string))
	panicIf(err)
	proto.Unmarshal(decoded, val)
	s.reqID++

	return val, nil
}

func (s *ProxyServer) ImageSegmentation(
	c context.Context, req *services.ImageSegmentationRequest) (
	*services.ModelResponse, error) {

	serializedReq, err := proto.Marshal(req)
	panicIf(err)
	encodedReq := base64.StdEncoding.EncodeToString(serializedReq)
	payload := map[string]string{"input": encodedReq}
	name, err := dbimpl.GetModelName(s.db, req.GetToken(), req.GetModelUuid())
	if err != nil {
		v := &services.TextGenerationResponse{GeneratedTexts: []string{name}}
		return &services.ModelResponse{TypeString: "text", Text: v}, nil
	}
	modelAddr := fmt.Sprintf(s.modelAddrTemplate, name)
	resp := postJSON(modelAddr, payload)
	val := &services.ModelResponse{}
	decoded, err := base64.StdEncoding.DecodeString(resp["output"].(string))
	panicIf(err)
	proto.Unmarshal(decoded, val)
	s.reqID++

	return val, nil
}

func (s *ProxyServer) TextGeneration(
	c context.Context, req *services.TextGenerationRequest) (
	*services.ModelResponse, error) {

	serializedReq, err := proto.Marshal(req)
	panicIf(err)
	encodedReq := base64.StdEncoding.EncodeToString(serializedReq)
	payload := map[string]string{"input": encodedReq}
	name, err := dbimpl.GetModelName(s.db, req.GetToken(), req.GetModelUuid())
	if err != nil {
		v := &services.TextGenerationResponse{GeneratedTexts: []string{name}}
		return &services.ModelResponse{TypeString: "text", Text: v}, nil
	}
	modelAddr := fmt.Sprintf(s.modelAddrTemplate, name)
	resp := postJSON(modelAddr, payload)
	// log.Println(resp)

	if resp["default"].(bool) {
		panic(resp["default_reason"])
	}
	val := &services.ModelResponse{}

	decoded, err := base64.StdEncoding.DecodeString(resp["output"].(string))
	panicIf(err)
	proto.Unmarshal(decoded, val)
	s.reqID++

	return val, nil
}

func (s *ProxyServer) ModelUUID(
	c context.Context, req *services.ModelUUIDRequest) (
	*services.ModelUUIDResponse, error) {

	var m dbimpl.Model
	newdb := s.db.Where("name = ?", req.GetModelName()).First(&m)
	if newdb.Error != nil {
		return nil, newdb.Error
	}
	b, e := dbimpl.Authorize(s.db, req.GetToken(), m)
	if !b {
		return nil, e
	}
	val := &services.ModelUUIDResponse{ModelUuid: m.ID.String()}
	return val, nil
}

// ServeForever runs?
func ServeForever(public bool, port int, cancelCtx context.Context) {

	lis, err := net.Listen("tcp", fmt.Sprintf("0.0.0.0:%d", port))
	panicIf(err)

	log.Println("Server started, listening to port", port)

	// TODO(Rehan) make db a cmd line arg, not hard coded.
	var dbType string
	var dbURL string
	var modelAddrTemplate string
	var availableModels = []dbimpl.Model{}

	if public {
		dbType = "postgres"
		dbURL = "host=34.213.216.228 port=5432 user=modelzoo"
		modelAddrTemplate = "http://54.213.2.210:1337/%v/predict"
	} else {
		dbType = "sqlite3"
		dbURL = "/tmp/modelzoo.db"
		modelAddrTemplate = "http://mock-backend:8000/%v/predict"
	}
	log.Println("Using database", dbType, "at", dbURL, "setting model backend", modelAddrTemplate)
	db, err := gorm.Open(dbType, dbURL)
	panicIf(err)
	defer db.Close()

	db.Order("model_category, output_type, name").Find(&availableModels)

	grpcServer := grpc.NewServer()

	s := &ProxyServer{0, db, availableModels, modelAddrTemplate}
	services.RegisterModelServer(grpcServer, s)

	cancelFunc := func() {
		select {
		case <-cancelCtx.Done():
			grpcServer.Stop()
		}
	}
	go cancelFunc()

	grpcServer.Serve(lis)
}
