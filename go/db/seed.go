package db

import (
	"fmt"
	"io/ioutil"
	"log"
	"os"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/sqlite"

	"encoding/json"

	services "github.com/harbor-ml/modelzoo/go/protos"
)

// Define base outputs
var outputs = [...]string{"vision", "text", "segment"}

type ModelInfo struct {
	Name     string `json:"name"`
	Category string `json:"category"`
	Output   string `json:"output"`
	Private  bool   `json:"private"`
}

type Models struct {
	Models []ModelInfo `json:"models"`
}

func Seed(filename string) {
	log.Println("Opening Database Connection.")
	// Open SQLite3 DB on local
	db, err := gorm.Open("sqlite3", "/tmp/modelzoo.db")
	if err != nil {
		log.Println(err)
	}
	defer db.Close()

	// Set up tables
	log.Println("Setting up Users table.")
	db.AutoMigrate(&User{})

	log.Println("Setting up Model table.")
	db.AutoMigrate(&Model{})

	log.Println("Setting up Output Type lookup Table.")
	db.AutoMigrate(&OutputType{})

	log.Println("Setting up Category lookup Table.")
	db.AutoMigrate(&Category{})

	log.Println("Setting up Query Table.")
	db.AutoMigrate(&Query{})

	log.Println("Setting up metadata.")
	db.AutoMigrate(&MetaData{})

	log.Println("Populating Category Table.")
	populate_categories(db)

	log.Println("Populating Output Type Table.")
	populate_outputs(db)

	// Define FK constraints within SQLite3
	db.Exec("PRAGMA foreign_keys = ON;")

	// Create admin user
	iuid := uuid.New()
	db.Create(&User{ID: iuid, UserName: "admin", Email: "admin@admin.com", Token: "admin_token", LastUsed: time.Now()})

	// Enter base models into DB
	log.Println("Reading", filename)
	if filename != "" {
		jsonFile, err := os.Open(filename)
		if err != nil {
			log.Println("Unable to open" + filename)
			return
		}
		defer jsonFile.Close()
		byteValue, err := ioutil.ReadAll(jsonFile)
		if err != nil {
			log.Println("Failed to read", filename)
			return
		}

		var models Models

		json.Unmarshal(byteValue, &models)
		for _, model := range models.Models {
			category := int(services.ModelCategory_value[strings.ToUpper(model.Category)])
			output := index(strings.ToLower(model.Output))
			db.Create(&Model{
				ID:            uuid.New(),
				Name:          model.Name,
				Author:        iuid,
				ModelCategory: category,
				OutputType:    output,
				Private:       model.Private})
		}
	}
}

func populate_categories(db *gorm.DB) {
	for index, category := range services.ModelCategory_name {
		cmd := fmt.Sprintf("INSERT INTO categories VALUES (%d, \"%s\")", index, category)
		db.Exec(cmd)
	}
}

func populate_outputs(db *gorm.DB) {
	for index, output := range outputs {
		cmd := fmt.Sprintf("INSERT INTO output_types VALUES (%d, \"%s\")", index, output)
		db.Exec(cmd)
	}
}

func index(item string) int {
	for i, it := range outputs {
		if it == item {
			return i
		}
	}
	return -1
}
