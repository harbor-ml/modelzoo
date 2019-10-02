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

	"github.com/harbor-ml/modelzoo/go/server"
	"github.com/phayes/freeport"
	"google.golang.org/grpc"

	services "github.com/harbor-ml/modelzoo/go/protos"
)

var client services.ModelClient

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
	go server.ListenAndServe()
	ctx, cancel := context.WithCancel(context.Background())
	defer server.Shutdown(ctx)
	defer cancel()

	// TEST CASE 1: test normal case
	request := services.ImageDownloadRequest{
		Url: fmt.Sprintf("http://localhost:%d/%s", port, "image.png"),
	}
	resp, err := client.GetImage(context.Background(), &request)
	errorAndFailWith(err, t)

	respData := resp.GetImage()
	if len(respData) == 0 {
		errorAndFailWith("Response is empty", t)
	}

	// Test CASE 2: test 404
	request = services.ImageDownloadRequest{
		Url: "http://httpbin.org/status/404",
	}
	resp, err = client.GetImage(context.Background(), &request)
	if err == nil {
		errorAndFailWith("Retrieve an non-existent image should fail", t)
	}
}

func TestListModel(t *testing.T) {
	req := services.GetModelsReq{}
	resp, err := client.ListModels(context.Background(), &req)
	errorAndFailWith(err, t)
	if len(resp.Models) != 2 {
		errorAndFailWith(fmt.Sprintf("Wrong number of models. Exptected 2 but it's %v",
			resp), t)
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

	go server.ServeForever(false, port, ctx)

	address := fmt.Sprintf("0.0.0.0:%d", port)
	conn, err := grpc.Dial(address, grpc.WithInsecure())
	if err != nil {
		log.Fatalf("did not connect: %v", err)
	}
	defer conn.Close()
	client = services.NewModelClient(conn)

	retCode := m.Run()
	cancel()

	os.Exit(retCode)
}
