package db_types

import (
	"time"

	"github.com/google/uuid"
)

type User struct {
	ID       uuid.UUID `gorm:"type:uuid;primary_key"`
	UserName string    `gorm:"unique"`
	Email    string    `gorm:"unique"`
	Token    string    `gorm:"unique"`
	LastUsed time.Time
	Models   []Model `gorm:"foreignkey:Author"`
	Queries  []Query `gorm:"foreignkey:Issuer"`
}

type Model struct {
	ID            uuid.UUID `gorm:"type:uuid;primary_key"`
	Name          string
	Author        uuid.UUID `gorm:"type:uuid;index:auth"sql:"type:uuid REFERENCES users(id)"`
	ModelCategory int       `sql:"type:integer REFERENCES categories(id)"`
	OutputType    int       `sql:"type:integer REFERENCES output_types(id)"`
	Private       bool
	MetaData      []MetaData `gorm:"foreignkey:ModelID"`
	Query         []Query    `gorm:"foreignKey:ModelID"`
}

type OutputType struct {
	ID   int `gorm:"primary_key"`
	Type string
}

type Category struct {
	ID   int `gorm:"primary_key"`
	Type string
}

type Query struct {
	ModelID   uuid.UUID `gorm:"type:uuid;primary_key"sql:"type:uuid REFERENCES models(id)"`
	Issuer    uuid.UUID `gorm:"type:uuid;primary_key"sql:"type:uuid REFERENCES users(id)"`
	CreatedAt time.Time `gorm:"primary_key"`
	EndedAt   time.Time
	Status    int
}

type MetaData struct {
	ModelID uuid.UUID `gorm:"type:uuid;primary_key"sql:"type:uuid REFERENCES models(id)"`
	Key     string    `gorm:"primary_key"`
	Value   string
}
