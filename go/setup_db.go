package main

import (
	"fmt"
	"time"

	dbtypes "modelzoo/go/dbtypes"

	"github.com/google/uuid"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/sqlite"
)

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
	populate_cats(db)
	populate_outputs(db)

	// Define FK constraints within SQLite3
	db.Exec("PRAGMA foreign_keys = ON;")

	// Create admin user
	iuid := uuid.New()
	db.Create(&dbtypes.User{ID: iuid, UserName: "admin", Email: "admin@admin.com", Token: "admin_token", LastUsed: time.Now()})

	// Define base models
	var models = [...]string{"res50-pytorch", "squeezenet-pytorch", "rise-pytorch", "marvel-pytorch", "image-segmentation", "image-captioning"}
	for _, mod := range models {
		cat, out := cats(mod)
		db.Create(&dbtypes.Model{ID: uuid.New(), Name: mod, Author: iuid, ModelCategory: cat, OutputType: out, Private: false})
	}
}
func populate_cats(db *gorm.DB) {
	db.Exec("INSERT INTO categories VALUES (0, \"VisionClassification\")")
	db.Exec("INSERT INTO categories VALUES (1,  \"TextGeneration\")")
	db.Exec("INSERT INTO categories VALUES (2, \"ImageSegmentation\")")
	db.Exec("INSERT INTO categories VALUES (3,\"ImageCaptioning\")")
}
func populate_outputs(db *gorm.DB) {
	db.Exec("INSERT INTO output_types VALUES (0, \"vision\")")
	db.Exec("INSERT INTO output_types VALUES (1, \"text\")")
	db.Exec("INSERT INTO output_types VALUES (2, \"segment\")")
}
func cats(m string) (int, int) {
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
