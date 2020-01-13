package tests

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"
	"testing"

	"github.com/harbor-ml/modelzoo/go/schema"
	"github.com/harbor-ml/modelzoo/go/server"
	"github.com/phayes/freeport"

	modelzoo "github.com/harbor-ml/modelzoo/go/protos"
	_ "github.com/jinzhu/gorm/dialects/sqlite"
)

var proxyPort int

func errorAndFailWith(err interface{}, t *testing.T) {
	if err != nil {
		t.Error(err)
		t.FailNow()
	}
}

func TestListModel(t *testing.T) {
	values := map[string]string{"body": ""}

	jsonValue, _ := json.Marshal(values)

	resp, err := http.Post(fmt.Sprintf("http://localhost:%d/get/models", proxyPort), "application/json", bytes.NewBuffer(jsonValue))

	errorAndFailWith(err, t)

	modelList := modelzoo.ListModelsResponse{}
	err = json.NewDecoder(resp.Body).Decode(&modelList)
	errorAndFailWith(err, t)
	if len(modelList.Models) != 2 {
		errorAndFailWith(fmt.Sprintf("Wrong number of models. Exptected 2 but it's %v",
			modelList), t)
	}

	if len(modelList.Models[0].ModelName) == 0 {
		errorAndFailWith("ModelName is empty", t)
	}
}

func TestTextInfer(t *testing.T) {
	t.Skip("This requires setup of the default python server")

	values := map[string]string{"body": ""}

	jsonValue, _ := json.Marshal(values)

	resp, err := http.Post(fmt.Sprintf("http://localhost:%d/get/token", proxyPort), "application/json", bytes.NewBuffer(jsonValue))
	errorAndFailWith(err, t)
	tokenStruct := modelzoo.RateLimitToken{}
	err = json.NewDecoder(resp.Body).Decode(&tokenStruct)
	errorAndFailWith(err, t)
	token := tokenStruct.Token
	payload := json.RawMessage(fmt.Sprintf("{\"text\": {\"access_token\": \"%s\",\"metadata\": {},\"model_name\": \"text_generation_mock\",\"texts\": [\"123456\",\"654321\"]},\"type\": \"TEXT\"}", token))
	resp, err = http.Post(fmt.Sprintf("http://localhost:%d/inference", proxyPort), "application/json", bytes.NewBuffer(payload))
	errorAndFailWith(err, t)
	payloadStruct := json.RawMessage{}
	err = json.NewDecoder(resp.Body).Decode(&payloadStruct)
	errorAndFailWith(err, t)

	if string(payloadStruct) != "{\"type\":\"TEXT\",\"text\":{\"metadata\":{\"method\":\"reversed\"},\"texts\":[\"654321\",\"123456\"]}}" {
		log.Println(string(payloadStruct))
		errorAndFailWith(errors.New("inference Return failed"), t)
	}
}

func TestMain(m *testing.M) {
	port, err := freeport.GetFreePort()

	if err != nil {
		log.Println("Can't find an open port for gRPC Server")
		log.Fatal(err)
	}

	proxyPort, err = freeport.GetFreePort()

	if err != nil {
		log.Println("Can't find an open port for proxy")
		log.Fatal(err)
	}

	ctx := context.Background()
	ctx, cancel := context.WithCancel(ctx)

	dbPath := server.CreateTempFile("*.test.db")
	schema.Seed("./models.json", dbPath)
	go server.ServeForever(ctx, false, port, dbPath)

	go server.ProxyForever(port, proxyPort)

	retCode := m.Run()
	cancel()

	os.Exit(retCode)
}
