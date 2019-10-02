package db

import (
	"errors"

	"github.com/google/uuid"
	"github.com/jinzhu/gorm"
)

func GetModel(db *gorm.DB, idstring string) (Model, error) {
	var m Model
	id, err := uuid.Parse(idstring)
	if err != nil {
		return m, err
	}
	newdb := db.Where("id = ?", id).First(&m)
	if newdb.Error != nil {
		return m, err
	}
	return m, nil
}

func GetUserFromToken(db *gorm.DB, token string) (User, error) {
	var auth User
	newdb := db.Where("token = ?", token).First(&auth)
	if newdb.Error != nil {
		return auth, newdb.Error
	}
	return auth, nil
}

func Authorize(db *gorm.DB, token string, model Model) (bool, error) {
	issuer, err := GetUserFromToken(db, token)
	if token != "" && err != nil {
		return false, err
	}
	if !model.Private || (err == nil && issuer.Email == "admin@modelzoo.live") {
		return true, nil
	}
	var auth User
	newdb := db.Where("id = ?", model.Author).First(&auth)
	if newdb.Error != nil {
		return false, newdb.Error
	}
	return auth.Token == token, nil
}
func GetModelName(db *gorm.DB, token string, idstring string) (string, error) {
	m, err := GetModel(db, idstring)
	if err != nil {
		return "Model does not exist", err
	}
	auth, nerr := Authorize(db, token, m)
	if nerr != nil {
		return "User does not exist", nerr
	}
	if !auth {
		return "Failed to authorize", errors.New("Token incorrect or invalid!")
	}
	return m.Name, nil
}
