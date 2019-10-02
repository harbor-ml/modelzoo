package server

import (
	"bytes"
	"encoding/json"
	"log"
	"net/http"
)

func panicIf(e interface{}) {
	if e != nil {
		log.Panic(e)
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
