package schema

import (
	"bufio"
	"log"
	"os"

	"github.com/golang/protobuf/ptypes"

	modelzoo "github.com/harbor-ml/modelzoo/go/protos"

	"github.com/golang/protobuf/ptypes/any"

	"github.com/golang/protobuf/jsonpb"

	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/sqlite"

	"encoding/json"
)

// Define base outputs
// var outputs = [...]string{"vision", "text", "segment"}

// type ModelInfo struct {
// 	Name     string `json:"name"`
// 	Category string `json:"category"`
// 	Output   string `json:"output"`
// 	Private  bool   `json:"private"`
// }

// type Models struct {
// 	Models []ModelInfo `json:"models"`
// }

// Seed the db
func Seed(filename string, dbPath string) {
	// Use modelzoo package so package registration is called
	var _ modelzoo.Image

	// Open SQLite3 DB on local
	db, err := gorm.Open("sqlite3", dbPath)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	db.AutoMigrate(&User{})
	db.AutoMigrate(&Token{})
	db.AutoMigrate(&ModelVersion{})
	db.AutoMigrate(&ModelMetaData{})
	db.AutoMigrate(&Query{})

	log.Println("Reading", filename)

	jsonFile, err := os.Open(filename)
	if err != nil {
		log.Fatalf("Unable to open %s", filename)
	}
	defer jsonFile.Close()

	dec := json.NewDecoder(bufio.NewReader(jsonFile))

	// read open bracket
	dec.Token()

	// while the array contains values
	for dec.More() {

		// decode an array value (Message)
		msg := any.Any{}
		err := jsonpb.UnmarshalNext(dec, &msg)
		switch msg.TypeUrl {
		case "/modelzoo.User":
			user := modelzoo.User{}
			if err := ptypes.UnmarshalAny(&msg, &user); err != nil {
				log.Fatal(err)
			}

			userRecord := User{Email: user.Email, Password: user.Password}
			if err := db.Create(&userRecord).Error; err != nil {
				log.Fatal(err)
			}

			log.Printf("user %v created", user.Email)

		case "/modelzoo.Model":
			model := modelzoo.Model{}
			if err := ptypes.UnmarshalAny(&msg, &model); err != nil {
				log.Fatal(err)
			}
			if err := CreateModel(db, &model); err != nil {
				log.Fatal(err)
			}

			log.Printf("Model %v created.", model.ModelName)
		default:
			log.Fatalf("Message of type %s is not yet supported.", msg.TypeUrl)
		}
		if err != nil {
			log.Fatal(err)
		}
	}

	// read closing bracket
	dec.Token()

	// for _, model := range models.Models {
	// 	category := int(services.ModelCategory_value[strings.ToUpper(model.Category)])
	// 	output := index(strings.ToLower(model.Output))
	// 	db.Create(&Model{
	// 		ID:            uuid.New(),
	// 		Name:          model.Name,
	// 		Author:        iuid,
	// 		ModelCategory: category,
	// 		OutputType:    output,
	// 		Private:       model.Private})
	// }

}

// func populate_categories(db *gorm.DB) {
// 	for index, category := range services.ModelCategory_name {
// 		cmd := fmt.Sprintf("INSERT INTO categories VALUES (%d, \"%s\")", index, category)
// 		db.Exec(cmd)
// 	}
// }

// func populate_outputs(db *gorm.DB) {
// 	for index, output := range outputs {
// 		cmd := fmt.Sprintf("INSERT INTO output_types VALUES (%d, \"%s\")", index, output)
// 		db.Exec(cmd)
// 	}
// }

// func index(item string) int {
// 	for i, it := range outputs {
// 		if it == item {
// 			return i
// 		}
// 	}
// 	return -1
// }
