package tests

import (
	"context"
	"fmt"
	"image"
	"image/png"
	"log"
	"net/http"
	"os"
	"testing"

	"github.com/harbor-ml/modelzoo/go/schema"
	"github.com/harbor-ml/modelzoo/go/server"
	"github.com/phayes/freeport"
	"google.golang.org/grpc"

	modelzoo "github.com/harbor-ml/modelzoo/go/protos"
	_ "github.com/jinzhu/gorm/dialects/sqlite"
)

var client modelzoo.ModelzooServiceClient

func errorAndFailWith(err interface{}, t *testing.T) {
	if err != nil {
		t.Error(err)
		t.FailNow()
	}
}

func TestGetImage(t *testing.T) {
	// Crate an image
	width := 200
	height := 100

	upLeft := image.Point{0, 0}
	lowRight := image.Point{width, height}

	img := image.NewRGBA(image.Rectangle{upLeft, lowRight})
	f, _ := os.Create("image.png")
	png.Encode(f, img)
	defer os.Remove("image.png")

	// Start a static file server
	port, err := freeport.GetFreePort()
	errorAndFailWith(err, t)

	server := &http.Server{Addr: fmt.Sprintf(":%d", port)}
	http.Handle("/", http.FileServer(http.Dir(".")))
	http.HandleFunc("/not_found", http.NotFound)
	go server.ListenAndServe()
	ctx, cancel := context.WithCancel(context.Background())
	defer server.Shutdown(ctx)
	defer cancel()

	// TEST CASE 1: test normal case
	request := modelzoo.ImageDownloadRequest{
		Url: fmt.Sprintf("http://localhost:%d/%s", port, "image.png"),
	}
	resp, err := client.GetImage(context.Background(), &request)
	errorAndFailWith(err, t)

	respData := resp.GetImage()
	if len(respData) == 0 {
		errorAndFailWith("Response is empty", t)
	}

	// Test CASE 2: test 404
	request = modelzoo.ImageDownloadRequest{
		Url: fmt.Sprintf("http://localhost:%d/%s", port, "not_found"),
	}
	resp, err = client.GetImage(context.Background(), &request)
	if err == nil {
		errorAndFailWith("Retrieve an non-existent image should fail", t)
	}
}

func TestListModel(t *testing.T) {
	req := modelzoo.Empty{}
	resp, err := client.ListModels(context.Background(), &req)
	errorAndFailWith(err, t)

	if len(resp.Models) != 2 {
		errorAndFailWith(fmt.Sprintf("Wrong number of models. Exptected 2 but it's %v",
			resp), t)
	}

	if len(resp.Models[0].ModelName) == 0 {
		errorAndFailWith("ModelName is empty", t)
	}
}

func TestTextInfer(t *testing.T) {
	t.Skip("This requires setup of the default python server")

	input := []string{"123456", "654321"}
	token, err := client.GetToken(context.Background(), &modelzoo.Empty{})
	errorAndFailWith(err, t)

	req := modelzoo.Payload{
		Payload: &modelzoo.Payload_Text{
			Text: &modelzoo.Text{
				Texts:       input,
				ModelName:   "text_generation_mock",
				AccessToken: token.Token,
			},
		},
		Type: modelzoo.PayloadType_TEXT,
	}
	resp, err := client.Inference(context.Background(), &req)
	errorAndFailWith(err, t)

	if resp.GetText().Metadata["method"] != "reversed" {
		t.Errorf("Doesn't have a metadata entry {'method': reveserd}")
	}

	if len(resp.GetText().Texts) != 2 {
		t.Errorf("Wrong number of text response")
	}

}

func TestMain(m *testing.M) {
	port, err := freeport.GetFreePort()
	if err != nil {
		log.Println("Can't find an open port")
		log.Fatal(err)
	}

	ctx := context.Background()
	ctx, cancel := context.WithCancel(ctx)

	dbPath := server.CreateTempFile("*.test.db")
	schema.Seed("./models.json", dbPath)
	go server.ServeForever(ctx, false, port, dbPath)

	address := fmt.Sprintf("0.0.0.0:%d", port)
	conn, err := grpc.Dial(address, grpc.WithInsecure())
	if err != nil {
		log.Fatalf("did not connect: %v", err)
	}
	defer conn.Close()
	client = modelzoo.NewModelzooServiceClient(conn)

	retCode := m.Run()
	cancel()

	os.Exit(retCode)
}
