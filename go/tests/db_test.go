package tests

import (
	"os"
	"testing"

	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/sqlite"

	"github.com/harbor-ml/modelzoo/go/schema"
)

var db *gorm.DB

func createUser(db *gorm.DB, email string) error {
	user := schema.User{Email: email}
	return db.Create(&user).Error
}

func findUser(db *gorm.DB, email string) schema.User {
	found := schema.User{}
	db.Where("email = ?", email).First(&found)
	return found
}

func TestUser(t *testing.T) {
	email := "a@modelzoo.live"
	err := createUser(db, email)
	if err != nil {
		t.Errorf("Unable to create user, err: %v", err)
	}

	if findUser(db, email).Email != email {
		t.Errorf("can't find user we just created")
		t.FailNow()
	}

	if err := createUser(db, email); err != nil {
		t.Logf("Error creating same user, expected.")
	} else {
		t.Errorf("Creating the same user didn't error! Unique-ness constraint violated.")
	}

}

// TODO: test the remaining models
func TestMain(m *testing.M) {
	db, _ = gorm.Open("sqlite3", ":memory:")
	defer db.Close()

	db.AutoMigrate(&schema.User{})
	db.AutoMigrate(&schema.Token{})
	db.AutoMigrate(&schema.ModelVersion{})
	db.AutoMigrate(&schema.ModelMetaData{})
	db.AutoMigrate(&schema.Query{})

	os.Exit(m.Run())
}
