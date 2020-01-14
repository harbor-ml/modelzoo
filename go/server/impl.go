package server

import (
	"context"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/sirupsen/logrus"

	"github.com/harbor-ml/modelzoo/go/schema"

	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"

	dataurl "github.com/vincent-petithory/dataurl"

	modelzoo "github.com/harbor-ml/modelzoo/go/modelzoo/protos"

	"github.com/jinzhu/gorm"
)

// ProxyServer implements the generated model server from modelzoo.proto
type ProxyServer struct {
	db     *gorm.DB
	logger *logrus.Logger
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
		if err := s.db.Model(&model).Related(&profiles).Error; err != nil {
			log.Panicf("Can't retrieve model metadata for model %s:%v", model.Name, err)
		}

		kvs := make([]*modelzoo.KVPair, 0)
		for _, profile := range profiles {
			kvs = append(kvs, &modelzoo.KVPair{Key: profile.Key, Value: profile.Value})
		}

		resp.Models = append(resp.Models, &modelzoo.Model{ModelName: model.Name, Metadata: kvs})
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

// GetUser ...
func (s *ProxyServer) GetUser(ctx context.Context, user *modelzoo.User) (*modelzoo.Empty, error) {
	userRecord := schema.User{Email: user.Email, Password: user.Password}
	_, err := schema.GetUser(s.db, &userRecord)
	if err != nil {
		return nil, status.Error(codes.Internal, fmt.Sprint(err))
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

func (s *ProxyServer) GetMetrics(ctx context.Context, _ *modelzoo.Empty) (*modelzoo.MetricItems, error) {
	return nil, status.Error(codes.NotFound, "Not implemented")
}
