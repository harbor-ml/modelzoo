package schema

import (
	"bufio"
	"os"

	"github.com/golang/protobuf/ptypes"

	log "github.com/sirupsen/logrus"

	modelzoo "github.com/harbor-ml/modelzoo/go/protos"

	"github.com/golang/protobuf/ptypes/any"

	"github.com/golang/protobuf/jsonpb"

	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/sqlite"

	"encoding/json"
)

// Seed the db
func Seed(filename string, dbPath string) {
	// Use modelzoo package so package registration is called
	var _ modelzoo.Image
	logger := log.WithFields(log.Fields{
		"actor":    "seeder",
		"dbPath":   dbPath,
		"fromFile": filename,
	})

	// Open SQLite3 DB on local
	db, err := gorm.Open("sqlite3", dbPath)
	if err != nil {
		logger.Fatal(err)
	}
	defer db.Close()

	db.AutoMigrate(&User{})
	db.AutoMigrate(&Token{})
	db.AutoMigrate(&ModelVersion{})
	db.AutoMigrate(&ModelMetaData{})
	db.AutoMigrate(&Query{})

	logger.Println("Reading", filename)

	jsonFile, err := os.Open(filename)
	if err != nil {
		logger.Fatalf("Unable to open %s", filename)
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
				logger.Fatal(err)
			}

			userRecord := User{Email: user.Email, Password: user.Password}
			if err := db.Create(&userRecord).Error; err != nil {
				logger.Fatal(err)
			}

			logger.Printf("user %v created", user.Email)

		case "/modelzoo.Model":
			model := modelzoo.Model{}
			if err := ptypes.UnmarshalAny(&msg, &model); err != nil {
				logger.Fatal(err)
			}
			if err := CreateModel(db, &model); err != nil {
				logger.Fatal(err)
			}

			logger.Printf("Model %v created.", model.ModelName)
		default:
			logger.Fatalf("Message of type %s is not yet supported.", msg.TypeUrl)
		}
		if err != nil {
			logger.Fatal(err)
		}
	}

	// read closing bracket
	dec.Token()
}
