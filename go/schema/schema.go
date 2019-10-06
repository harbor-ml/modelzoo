package schema

import (
	"errors"
	"time"

	"github.com/google/uuid"

	modelzoo "github.com/harbor-ml/modelzoo/go/protos"

	"github.com/jinzhu/gorm"
)

// User represents a modelzoo user
type User struct {
	gorm.Model

	Email    string `gorm:"unique"`
	Password string
}

// Token is used as rate limit mechanism
type Token struct {
	gorm.Model

	// The secret token user will use to access the model
	Secret string `gorm:"unique"`

	// Rate limiting infomation
	RestoredAt     time.Time
	RestoreEvery   time.Duration
	NumQueriesLeft int
	DefaultQuota   int
}

func CreateToken(db *gorm.DB) (*Token, error) {
	uuidVal, err := uuid.NewRandom()
	if err != nil {
		return nil, err
	}
	token := Token{
		Secret:         uuidVal.String(),
		RestoredAt:     time.Now(),
		RestoreEvery:   time.Minute * 1,
		NumQueriesLeft: 50,
		DefaultQuota:   50,
	}
	if err := db.Create(&token).Error; err != nil {
		return nil, err
	}
	return &token, nil
}

func PerformRateLimit(db *gorm.DB, secret string) (*Token, error) {
	token := Token{}
	if err := db.Where("secret = ?", secret).Find(&token).Error; err != nil {
		return nil, errors.New("can't find this token")
	}

	if token.RestoredAt.Before(time.Now()) {
		token.RestoredAt = time.Now().Add(token.RestoreEvery)
		token.NumQueriesLeft = token.DefaultQuota
	}

	if token.NumQueriesLeft == 0 {
		return nil, errors.New("rate limit exceeded")
	}

	token.NumQueriesLeft--
	if err := db.Save(&token).Error; err != nil {
		return nil, errors.New("rnable to save token state")
	}

	return &token, nil
}

// ModelVersion represents a single model and its metadata
type ModelVersion struct {
	gorm.Model

	// Each model has some descriptive name
	// Example: resnet:v2
	Name string `gorm:"unique"`
}

// Query is a trace of a single query made from client
type Query struct {
	gorm.Model

	// It belongs to a model version
	ModelVersionID int
	ModelVersion   ModelVersion

	// It is accessed via some basic token
	TokenID int
	Token   Token

	// It has start and end time
	StartedAt time.Time
	EndedAt   time.Time

	// Exit code status
	Status int
}

// ModelMetaData represent key-value pairs that can be used to filter models
type ModelMetaData struct {
	gorm.Model
	// There are metadata associated with models
	ModelVersionID int
	ModelVersion   ModelVersion

	// K-V pair are non-binding. No unique-ness constraint
	Key   string
	Value string
}

func GetMetadataMap(db *gorm.DB, model *ModelVersion) (map[string]string, error) {
	relavantMetadata := make([]*ModelMetaData, 0)
	if err := db.Model(&model).Related(&relavantMetadata).Error; err != nil {
		return nil, err
	}

	reducedMap := map[string]string{}
	for _, entry := range relavantMetadata {
		reducedMap[entry.Key] = entry.Value
	}

	return reducedMap, nil
}

func CreateModel(db *gorm.DB, model *modelzoo.Model) error {
	tx := db.Begin()

	modelRecord := ModelVersion{Name: model.ModelName}
	if err := tx.Create(&modelRecord).Error; err != nil {
		tx.Rollback()
		return err
	}

	for _, metadata := range model.Metadata {
		metadataRecord := ModelMetaData{
			ModelVersion: modelRecord,
			Key:          metadata.Key,
			Value:        metadata.Value,
		}
		if err := tx.Create(&metadataRecord).Error; err != nil {
			tx.Rollback()
			return err
		}
	}
	tx.Commit()
	return nil
}
