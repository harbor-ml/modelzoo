package server

import (
	"context"
	"encoding/base64"
	"fmt"
	"io/ioutil"
	"log"
	"net"
	"net/http"

	"github.com/golang/protobuf/proto"
	"github.com/harbor-ml/modelzoo/go/schema"

	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"

	dataurl "github.com/vincent-petithory/dataurl"

	modelzoo "github.com/harbor-ml/modelzoo/go/protos"

	"github.com/jinzhu/gorm"

	"google.golang.org/grpc"
)

// ProxyServer implements the generated model server from modelzoo.proto
type ProxyServer struct {
	db *gorm.DB
}

// GetImage download an image from a url
func (s *ProxyServer) GetImage(
	c context.Context, req *modelzoo.ImageDownloadRequest) (
	*modelzoo.ImageDownloadResponse, error) {

	url := req.GetUrl()
	resp, err := http.Get(url)
	if err != nil || resp.StatusCode != 200 {
		if err != nil {
			defer resp.Body.Close()
		}
		return nil, status.Error(codes.NotFound,
			fmt.Sprintf("Modelzoo was not able to retrieve the image at %s", url))
	}

	bodyBytes, err := ioutil.ReadAll(resp.Body)
	panicIf(err) // can't parse HTTP response, shouldn't happen

	codedBody := dataurl.EncodeBytes(bodyBytes)
	result := &modelzoo.ImageDownloadResponse{
		Image: codedBody,
	}

	return result, nil
}

// ListModels returns the list of models in current db.
func (s *ProxyServer) ListModels(
	c context.Context, req *modelzoo.Empty) (
	*modelzoo.ListModelsResponse, error) {
	resp := modelzoo.ListModelsResponse{}

	models := make([]schema.ModelVersion, 0)
	if err := s.db.Find(&models).Error; err != nil {
		log.Panicf("Can't list models from db: %s", err)
	}

	for _, model := range models {
		profiles := make([]schema.ModelMetaData, 0)
		if err := s.db.Model(&models).Related(&profiles).Error; err != nil {
			log.Panicf("Can't retrieve model metadata for model %s:%v", model.Name, err)
		}

		kvs := make([]*modelzoo.KVPair, 0)
		for _, profile := range profiles {
			kvs = append(kvs, &modelzoo.KVPair{Key: profile.Key, Value: profile.Value})
		}

		resp.Models = append(resp.Models, &modelzoo.Model{ModelName: model.Name})
	}

	return &resp, nil
}

// CreateUser ...
func (s *ProxyServer) CreateUser(ctx context.Context, user *modelzoo.User) (*modelzoo.Empty, error) {
	userRecord := schema.User{Email: user.Email, Password: user.Password}
	if err := s.db.Create(&userRecord).Error; err != nil {
		log.Panic(err)
	}
	return &modelzoo.Empty{}, nil
}

// CreateModel ...
func (s *ProxyServer) CreateModel(ctx context.Context, model *modelzoo.Model) (*modelzoo.Empty, error) {
	err := schema.CreateModel(s.db, model)
	if err != nil {
		return nil, status.Error(codes.Internal, fmt.Sprint(err))
	}
	return &modelzoo.Empty{}, nil
}

func (s *ProxyServer) GetToken(ctx context.Context, _ *modelzoo.Empty) (*modelzoo.RateLimitToken, error) {
	token, err := schema.CreateToken(s.db)
	if err != nil {
		return nil, status.Error(codes.Internal, "Can't create token")
	}

	return &modelzoo.RateLimitToken{Token: token.Secret}, nil
}

func (s *ProxyServer) Inference(ctx context.Context, payload *modelzoo.Payload) (*modelzoo.Payload, error) {
	var item interface{}
	switch payload.Type {
	case modelzoo.PayloadType_IMAGE:
		item = payload.GetImage()
	case modelzoo.PayloadType_TEXT:
		item = payload.GetText()
	case modelzoo.PayloadType_TABLE:
		item = payload.GetTable()
	default:
		return nil, status.Error(codes.Internal, "Invalid payload type")
	}

	modelRecord := schema.ModelVersion{}
	if err := s.db.Where("name = ?", item.ModelName).Find(&modelRecord).Error; err != nil {
		return nil, status.Error(codes.Internal, fmt.Sprint(err))
	}
	metadataPrt, err := schema.GetMetadataMap(s.db, &modelRecord)
	if err != nil {
		return nil, err
	}
	metadata := *metadataPrt

	if metadata["service_type"] != "clipper" {
		return nil, status.Error(codes.Internal, "modelzoo only support clipper for now")
	}

	if metadata["input_type"] != "image" {
		return nil, status.Error(codes.Internal, "input type mismatch")
	}

	url := metadata["clipper_url"]
	serializedReq, err := proto.Marshal(image)
	if err != nil {
		return nil, err
	}
	encodedReq := base64.StdEncoding.EncodeToString(serializedReq)
	payload := map[string]string{"input": encodedReq}
	resp := postJSON(url, payload)
	decoded, err := base64.StdEncoding.DecodeString(resp["output"].(string))
	if err != nil {
		return nil, err
	}

	val := &modelzoo.ModelResponse{}
	proto.Unmarshal(decoded, val)
	s.reqID++

	token := image.AccessToken
	_, err = schema.PerformRateLimit(s.db, token)
	if err != nil {
		return nil, status.Error(codes.Internal, fmt.Sprint(err))
	}

}

// // VisionClassification returns
// func (s *ProxyServer) VisionClassification(
// 	c context.Context, req *modelzoo.VisionClassificationRequest) (
// 	*modelzoo.ModelResponse, error) {

// 	serializedReq, err := proto.Marshal(req)
// 	panicIf(err)
// 	encodedReq := base64.StdEncoding.EncodeToString(serializedReq)
// 	payload := map[string]string{"input": encodedReq}
// 	name, err := dbimpl.GetModelName(s.db, req.GetToken(), req.GetModelUuid())
// 	if err != nil {
// 		v := &modelzoo.TextGenerationResponse{GeneratedTexts: []string{name}}
// 		return &modelzoo.ModelResponse{TypeString: "text", Text: v}, nil
// 	}
// 	modelAddr := fmt.Sprintf(s.modelAddrTemplate, name)
// 	resp := postJSON(modelAddr, payload)
// 	val := &modelzoo.ModelResponse{}
// 	decoded, err := base64.StdEncoding.DecodeString(resp["output"].(string))
// 	panicIf(err)
// 	proto.Unmarshal(decoded, val)
// 	s.reqID++

// 	return val, nil
// }

// func (s *ProxyServer) ImageSegmentation(
// 	c context.Context, req *modelzoo.ImageSegmentationRequest) (
// 	*modelzoo.ModelResponse, error) {

// 	serializedReq, err := proto.Marshal(req)
// 	panicIf(err)
// 	encodedReq := base64.StdEncoding.EncodeToString(serializedReq)
// 	payload := map[string]string{"input": encodedReq}
// 	name, err := dbimpl.GetModelName(s.db, req.GetToken(), req.GetModelUuid())
// 	if err != nil {
// 		v := &modelzoo.TextGenerationResponse{GeneratedTexts: []string{name}}
// 		return &modelzoo.ModelResponse{TypeString: "text", Text: v}, nil
// 	}
// 	modelAddr := fmt.Sprintf(s.modelAddrTemplate, name)
// 	resp := postJSON(modelAddr, payload)
// 	val := &modelzoo.ModelResponse{}
// 	decoded, err := base64.StdEncoding.DecodeString(resp["output"].(string))
// 	panicIf(err)
// 	proto.Unmarshal(decoded, val)
// 	s.reqID++

// 	return val, nil
// }

// func (s *ProxyServer) TextGeneration(
// 	c context.Context, req *modelzoo.TextGenerationRequest) (
// 	*modelzoo.ModelResponse, error) {

// 	serializedReq, err := proto.Marshal(req)
// 	panicIf(err)
// 	encodedReq := base64.StdEncoding.EncodeToString(serializedReq)
// 	payload := map[string]string{"input": encodedReq}
// 	name, err := dbimpl.GetModelName(s.db, req.GetToken(), req.GetModelUuid())
// 	if err != nil {
// 		v := &modelzoo.TextGenerationResponse{GeneratedTexts: []string{name}}
// 		return &modelzoo.ModelResponse{TypeString: "text", Text: v}, nil
// 	}
// 	modelAddr := fmt.Sprintf(s.modelAddrTemplate, name)
// 	resp := postJSON(modelAddr, payload)
// 	// log.Println(resp)

// 	if resp["default"].(bool) {
// 		panic(resp["default_reason"])
// 	}
// 	val := &modelzoo.ModelResponse{}

// 	decoded, err := base64.StdEncoding.DecodeString(resp["output"].(string))
// 	panicIf(err)
// 	proto.Unmarshal(decoded, val)
// 	s.reqID++

// 	return val, nil
// }

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

	grpcServer := grpc.NewServer()

	s := &ProxyServer{db}
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
