package server

import (
	"context"
	"encoding/base64"
	"fmt"
	"time"

	"github.com/golang/protobuf/proto"
	"github.com/harbor-ml/modelzoo/go/schema"

	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"

	modelzoo "github.com/harbor-ml/modelzoo/go/protos"
	log "github.com/sirupsen/logrus"
)

func (s *ProxyServer) getModelVersion(modelName string) schema.ModelVersion {
	modelRecord := schema.ModelVersion{}
	s.db.Where("name = ?", modelName).Find(&modelRecord)
	return modelRecord
}

func (s *ProxyServer) getAccesToken(token string) schema.Token {
	accessToken := schema.Token{}
	s.db.Where("secret = ?", token).Find(&accessToken)
	return accessToken
}

func (s *ProxyServer) validateModel(msg proto.Message, modelName string) (map[string]string, []byte, error) {
	modelRecord := schema.ModelVersion{}
	if err := s.db.Where("name = ?", modelName).Find(&modelRecord).Error; err != nil {
		return nil, nil, status.Error(codes.Internal, fmt.Sprint(err))
	}

	metadata, err := schema.GetMetadataMap(s.db, &modelRecord)
	if err != nil {
		return nil, nil, err
	}

	if metadata["service_type"] != "clipper" {
		return nil, nil, status.Error(codes.Internal, "modelzoo only support clipper for now")
	}

	marshaled, err := proto.Marshal(msg)
	if err != nil {
		return nil, nil, err
	}
	return metadata, marshaled, nil
}

func (s *ProxyServer) saveQueryResult(modelName string, token string,
	startTime time.Time, endTime time.Time, exitStatus int) {
	queryEntry := schema.Query{
		ModelVersion: s.getModelVersion(modelName),
		Token:        s.getAccesToken(token),
		StartedAt:    startTime,
		EndedAt:      endTime,
		Status:       exitStatus,
	}
	s.db.Save(&queryEntry)
}

func (s *ProxyServer) Inference(ctx context.Context, payload *modelzoo.Payload) (*modelzoo.Payload, error) {
	var metadata map[string]string
	var serializedPayload []byte
	var err error
	var token string
	var modelName string

	switch payload.Type {
	case modelzoo.PayloadType_IMAGE:
		item := payload.GetImage()
		modelName = item.ModelName
		token = item.AccessToken
		metadata, serializedPayload, err = s.validateModel(item, item.ModelName)
	case modelzoo.PayloadType_TEXT:
		item := payload.GetText()
		modelName = item.ModelName
		token = item.AccessToken
		metadata, serializedPayload, err = s.validateModel(item, item.ModelName)
	case modelzoo.PayloadType_TABLE:
		item := payload.GetTable()
		modelName = item.ModelName
		token = item.AccessToken
		metadata, serializedPayload, err = s.validateModel(item, item.ModelName)
	default:
		return nil, status.Error(codes.Internal, "wrong payload type")
	}
	if err != nil {
		return nil, err
	}

	_, err = schema.PerformRateLimit(s.db, token)

	rateLimitSuccess := true
	if err != nil {
		rateLimitSuccess = false
	}

	defer s.logger.WithFields(log.Fields{
		"input_type":           payload.Type,
		"model_name":           modelName,
		"rate_limit_success":   rateLimitSuccess,
		"expected_output_type": metadata["output_type"],
	}).Info("New inference request")

	if err != nil {
		return nil, status.Error(codes.Internal, fmt.Sprint(err))
	}

	url := metadata["clipper_url"]
	encodedReq := base64.StdEncoding.EncodeToString(serializedPayload)
	httpPayload := map[string]string{"input": encodedReq}

	startTime := time.Now()
	resp := postJSON(url, httpPayload)
	endTime := time.Now()

	if resp["default"].(bool) == true {
		s.saveQueryResult(modelName, token, startTime, endTime, 1)
		return nil, status.Error(
			codes.Internal, fmt.Sprintf("Query failed: %s", resp["default_explanation"].(string)))
	}

	decoded, err := base64.StdEncoding.DecodeString(resp["output"].(string))
	if err != nil {
		s.saveQueryResult(modelName, token, startTime, endTime, 1)
		return nil, err
	}

	var val modelzoo.Payload
	switch metadata["output_type"] {
	case "image":
		data := &modelzoo.Image{}
		if err := proto.Unmarshal(decoded, data); err != nil {
			s.saveQueryResult(modelName, token, startTime, endTime, 1)
			return nil, status.Error(codes.Internal, "failed to unmarshal proto from clipper")
		}
		val = modelzoo.Payload{
			Payload: &modelzoo.Payload_Image{Image: data},
			Type:    modelzoo.PayloadType_IMAGE,
		}
	case "table":
		data := &modelzoo.Table{}
		if err := proto.Unmarshal(decoded, data); err != nil {
			s.saveQueryResult(modelName, token, startTime, endTime, 1)
			return nil, status.Error(codes.Internal, "failed to unmarshal proto from clipper")
		}
		val = modelzoo.Payload{
			Payload: &modelzoo.Payload_Table{Table: data},
			Type:    modelzoo.PayloadType_TABLE,
		}
	case "text":
		data := &modelzoo.Text{}
		if err := proto.Unmarshal(decoded, data); err != nil {
			s.saveQueryResult(modelName, token, startTime, endTime, 1)
			return nil, status.Error(codes.Internal, "failed to unmarshal proto from clipper")
		}
		val = modelzoo.Payload{
			Payload: &modelzoo.Payload_Text{Text: data},
			Type:    modelzoo.PayloadType_TEXT,
		}
	default:
		return nil, status.Error(codes.Internal, "model doesn't have output_type field")
	}

	s.saveQueryResult(modelName, token, startTime, endTime, 0)

	return &val, nil
}
