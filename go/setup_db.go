package main

import (
	"fmt"
	"time"

	dbtypes "modelzoo/go/dbtypes"

	"github.com/google/uuid"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/sqlite"
)

// Define base models
const models = [...]string{"res50-pytorch", "squeezenet-pytorch", "rise-pytorch", "marvel-pytorch", "image-segmentation", "image-captioning"}

// Define base outputs
const outputs = [...]string{"vision", "text", "segment"}

// Define base categories
const categories = [...]string{"VisionClassification", "TextGeneration", "ImageSegmentation", "ImageCaptioning"}

func main() {
	// Open SQLite3 DB on local
	db, err := gorm.Open("sqlite3", "/tmp/modelzoo.db")
	if err != nil {
		fmt.Println(err)
	}
	defer db.Close()

	// Set up tables
	db.AutoMigrate(&dbtypes.User{})
	db.AutoMigrate(&dbtypes.Model{})
	db.AutoMigrate(&dbtypes.OutputType{})
	db.AutoMigrate(&dbtypes.Category{})
	db.AutoMigrate(&dbtypes.Query{})
	db.AutoMigrate(&dbtypes.MetaData{})
	populate_categories(db)
	populate_outputs(db)

	// Define FK constraints within SQLite3
	db.Exec("PRAGMA foreign_keys = ON;")

	// Create admin user
	iuid := uuid.New()
	db.Create(&dbtypes.User{ID: iuid, UserName: "admin", Email: "admin@admin.com", Token: "admin_token", LastUsed: time.Now()})

	// Enter base models into DB
	for _, mod := range models {
		category, out := categories(mod)
		db.Create(&dbtypes.Model{ID: uuid.New(), Name: mod, Author: iuid, ModelCategory: category, OutputType: out, Private: false})
	}
}
func populate_categories(db *gorm.DB) {
	for index, category := range categories {
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
func categories(m string) (int, int) {
	switch m {
	case "res50-pytorch":
		return 0, 0
	case "squeezenet-pytorch":
		return 0, 0
	case "rise-pytorch":
		return 1, 1
	case "marvel-pytorch":
		return 1, 1
	case "image-segmentation":
		return 2, 2
	default:
		return 3, 2
	}
	return -1, -1
}
