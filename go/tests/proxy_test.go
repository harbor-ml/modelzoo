package tests

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"testing"

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
	values := map[string]string{"body": ""}
	input := []string{"123456", "654321"}

	jsonValue, _ := json.Marshal(values)

	resp, err := http.Post(fmt.Sprintf("http://localhost:%d/get/token", proxyPort), "application/json", bytes.NewBuffer(jsonValue))
	errorAndFailWith(err, t)
	tokenStruct := modelzoo.RateLimitToken{}
	err = json.NewDecoder(resp.Body).Decode(&tokenStruct)
	errorAndFailWith(err, t)
	token := tokenStruct.Token

	payload :=
		log.Println(payload)
	jsonValue, _ = json.Marshal(payload)
	log.Println(jsonValue)

	resp, err = http.Post(fmt.Sprintf("http://localhost:%d/inference", proxyPort), "application/grpc", bytes.NewBuffer(jsonValue))
	errorAndFailWith(err, t)
	payloadStruct := modelzoo.Payload{}
	err = json.NewDecoder(resp.Body).Decode(&payloadStruct)
	errorAndFailWith(err, t)
	log.Println(payloadStruct)
	log.Println(payloadStruct.Type)

	if payloadStruct.GetText().Metadata["method"] != "reversed" {
		t.Errorf("Doesn't have a metadata entry {'method': reveserd}")
	}

	if len(payloadStruct.GetText().Texts) != 2 {
		t.Errorf("Wrong number of text response")
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

	go server.ServeForever(ctx, false, port)

	go server.ProxyForever(port, proxyPort)

	retCode := m.Run()
	cancel()

	os.Exit(retCode)
}
