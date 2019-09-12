package main

import (
	"bytes"
	"context"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"log"
	"net"
	"net/http"
	"os"

	"github.com/google/uuid"

	panichandler "github.com/kazegusuri/grpc-panic-handler"
	dataurl "github.com/vincent-petithory/dataurl"

	dbtypes "modelzoo/go/dbtypes"
	services "modelzoo/go/protos"

	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
	_ "github.com/jinzhu/gorm/dialects/sqlite"

	proto "github.com/golang/protobuf/proto"
	"google.golang.org/grpc"
)

const port int = 9090

var modelAddrTemplate string

// const modelAddrTemplate string = "http://mock-backend:8000/%v/predict"

// var availableModels = []*services.GetModelsResp_Model{
// 	{ModelName: "res50-pytorch", ModelCategory: services.ModelCategory_VISIONCLASSIFICATION},
// 	{ModelName: "squeezenet-pytorch", ModelCategory: services.ModelCategory_VISIONCLASSIFICATION},
// 	{ModelName: "rise-pytorch", ModelCategory: services.ModelCategory_TEXTGENERATION},
// 	{ModelName: "marvel-pytorch", ModelCategory: services.ModelCategory_TEXTGENERATION},
// 	{ModelName: "image-segmentation", ModelCategory: services.ModelCategory_IMAGESEGMENTATION},
// 	{ModelName: "image-captioning", ModelCategory: services.ModelCategory_IMAGECAPTIONING},
// }
var availableModels = []dbtypes.Model{}
var db *gorm.DB

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
	models := make([]*services.GetModelsResp_Model, len(availableModels))
	for ind, mod := range availableModels {
		models[ind] = &services.GetModelsResp_Model{ModelName: mod.Name, ModelCategory: services.ModelCategory(mod.ModelCategory), Uuid: mod.ID.String()}
	}
	resp := &services.GetModelsResp{
		Models: models,
	}
	return resp, nil
}

func GetModel(idstring string) (dbtypes.Model, error) {
	var m dbtypes.Model
	id, err := uuid.Parse(idstring)
	if err != nil {
		return m, err
	}
	newdb := db.Where("id = ?", id).First(&m)
	if newdb.Error != nil {
		return m, err
	}
	return m, nil
}

func GetUserFromToken(token string) (dbtypes.User, error) {
	var auth dbtypes.User
	newdb := db.Where("token = ?", token).First(&auth)
	if newdb.Error != nil {
		return auth, newdb.Error
	}
	return auth, nil
}

func Authorize(token string, model dbtypes.Model) (bool, error) {
	issuer, err := GetUserFromToken(token)
	if token != "" && err != nil {
		return false, err
	}
	if !model.Private || (err == nil && issuer.Email == "admin@modelzoo.live") {
		return true, nil
	}
	var auth dbtypes.User
	newdb := db.Where("id = ?", model.Author).First(&auth)
	if newdb.Error != nil {
		return false, newdb.Error
	}
	return auth.Token == token, nil
}
func GetModelName(token string, idstring string) (string, error) {
	m, err := GetModel(idstring)
	if err != nil {
		return "Model does not exist", err
	}
	auth, nerr := Authorize(token, m)
	if nerr != nil {
		return "User does not exist", nerr
	}
	if !auth {
		return "Failed to authorize", errors.New("Token incorrect or invalid!")
	}
	return m.Name, nil
}
func (s *mockModelServer) VisionClassification(
	c context.Context, req *services.VisionClassificationRequest) (
	*services.ModelResponse, error) {

	serializedReq, err := proto.Marshal(req)
	panicIf(err)
	encodedReq := base64.StdEncoding.EncodeToString(serializedReq)
	payload := map[string]string{"input": encodedReq}
	name, err := GetModelName(req.GetToken(), req.GetModelUuid())
	if err != nil {
		v := &services.TextGenerationResponse{GeneratedTexts: []string{name}}
		return &services.ModelResponse{TypeString: "text", Text: v}, nil
	}
	modelAddr := fmt.Sprintf(modelAddrTemplate, name)
	resp := postJSON(modelAddr, payload)
	val := &services.ModelResponse{}
	decoded, err := base64.StdEncoding.DecodeString(resp["output"].(string))
	panicIf(err)
	proto.Unmarshal(decoded, val)
	s.reqID++

	return val, nil
}

func (s *mockModelServer) ImageSegmentation(
	c context.Context, req *services.ImageSegmentationRequest) (
	*services.ModelResponse, error) {

	serializedReq, err := proto.Marshal(req)
	panicIf(err)
	encodedReq := base64.StdEncoding.EncodeToString(serializedReq)
	payload := map[string]string{"input": encodedReq}
	name, err := GetModelName(req.GetToken(), req.GetModelUuid())
	if err != nil {
		v := &services.TextGenerationResponse{GeneratedTexts: []string{name}}
		return &services.ModelResponse{TypeString: "text", Text: v}, nil
	}
	modelAddr := fmt.Sprintf(modelAddrTemplate, name)
	resp := postJSON(modelAddr, payload)
	val := &services.ModelResponse{}
	decoded, err := base64.StdEncoding.DecodeString(resp["output"].(string))
	panicIf(err)
	proto.Unmarshal(decoded, val)
	s.reqID++

	return val, nil
}

func (s *mockModelServer) TextGeneration(
	c context.Context, req *services.TextGenerationRequest) (
	*services.ModelResponse, error) {

	serializedReq, err := proto.Marshal(req)
	panicIf(err)
	encodedReq := base64.StdEncoding.EncodeToString(serializedReq)
	payload := map[string]string{"input": encodedReq}
	name, err := GetModelName(req.GetToken(), req.GetModelUuid())
	if err != nil {
		v := &services.TextGenerationResponse{GeneratedTexts: []string{name}}
		return &services.ModelResponse{TypeString: "text", Text: v}, nil
	}
	modelAddr := fmt.Sprintf(modelAddrTemplate, name)
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

func (s *mockModelServer) ModelUUID(
	c context.Context, req *services.ModelUUIDRequest) (
	*services.ModelUUIDResponse, error) {

	var m dbtypes.Model
	newdb := db.Where("name = ?", req.GetModelName()).First(&m)
	if newdb.Error != nil {
		return nil, newdb.Error
	}
	b, e := Authorize(req.GetToken(), m)
	if !b {
		return nil, e
	}
	val := &services.ModelUUIDResponse{ModelUuid: m.ID.String()}
	return val, nil
}

func main() {
	lis, err := net.Listen("tcp", fmt.Sprintf("0.0.0.0:%d", port))
	if err != nil {
		panic(err)
	}
	log.Println("Server started, listening to port", port)
	// TODO(Rehan): This should not be hard coded. Should also use flags.
	log.Println("Running in", os.Args[1], "mode.")
	if os.Args[1] == "public" {
		db, err = gorm.Open("postgres", "host=34.213.216.228 port=5432 user=modelzoo")
		modelAddrTemplate = "http://54.213.2.210:1337/%v/predict"
	} else {
		db, err = gorm.Open("sqlite3", "/tmp/modelzoo.db")
		modelAddrTemplate = "http://mock-backend:8000/%v/predict"
	}
	if err != nil {
		panic(err)
	}
	defer db.Close()
	log.Println("Database connection established")
	db.Order("model_category, output_type, name").Find(&availableModels)
	panichandler.InstallPanicHandler(panichandler.LogPanicDump)
	uIntOpt := grpc.UnaryInterceptor(panichandler.UnaryPanicHandler)
	sIntOpt := grpc.StreamInterceptor(panichandler.StreamPanicHandler)
	grpcServer := grpc.NewServer(uIntOpt, sIntOpt)

	// grpcServer := grpc.NewServer()

	s := &mockModelServer{0}
	services.RegisterModelServer(grpcServer, s)
	grpcServer.Serve(lis)

}
