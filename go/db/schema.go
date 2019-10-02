package db

import (
	"time"

	"github.com/google/uuid"
)

// User represents a modelzoo user
type User struct {
	ID       uuid.UUID `gorm:"type:uuid;primary_key"`
	UserName string    `gorm:"unique"`
	Email    string    `gorm:"unique"`
	Token    string    `gorm:"unique"`
	LastUsed time.Time
	Models   []Model `gorm:"foreignkey:Author"`
	Queries  []Query `gorm:"foreignkey:Issuer"`
}

// Model represents a single model and its metadata
type Model struct {
	ID            uuid.UUID `gorm:"type:uuid;primary_key"`
	Name          string
	Author        uuid.UUID `gorm:"type:uuid;index:auth"`
	ModelCategory int
	OutputType    int
	Private       bool
	MetaData      []MetaData `gorm:"foreignkey:ModelID"`
	Query         []Query    `gorm:"foreignKey:ModelID"`
}

// OutputType register the output type of the model
type OutputType struct {
	ID   int `gorm:"primary_key"`
	Type string
}

// Category register the model category
type Category struct {
	ID   int `gorm:"primary_key"`
	Type string
}

// Query is a trace of a single query made from client
type Query struct {
	ModelID   uuid.UUID `gorm:"type:uuid;primary_key"`
	Issuer    uuid.UUID `gorm:"type:uuid;primary_key"`
	CreatedAt time.Time `gorm:"primary_key"`
	EndedAt   time.Time
	Status    int
}

// MetaData represent key-value pairs that can be used to filter models
type MetaData struct {
	ModelID uuid.UUID `gorm:"type:uuid;primary_key"`
	Key     string    `gorm:"primary_key"`
	Value   string
}
