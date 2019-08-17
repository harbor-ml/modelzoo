mkdir $GOPATH/src/modelzoo/go/dbtypes
cp /go/sql_dbyptes.go $GOPATH/src/modelzoo/go/dbtypes/
go get -u github.com/jinzhu/gorm
go get github.com/google/uuid
go get -u github.com/mattn/go-sqlite3
go run go/setup_db.go
echo "Just run docker-compose -f docker-compose.local.yml up to run ModelZoo.Live locally."