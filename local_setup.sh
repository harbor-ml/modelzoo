mkdir $GOPATH/src/modelzoo/go/dbtypes
mkdir $GOPATH/src/modelzoo/go/protos
cp ./go/sql_dbtypes.go $GOPATH/src/modelzoo/go/dbtypes/
cp ./go/protos/services.pb.go $GOPATH/src/modelzoo/go/protos/
go get -u github.com/jinzhu/gorm
go get github.com/google/uuid
go get -u github.com/mattn/go-sqlite3
go run go/setup_db.go
echo "Just run docker-compose -f docker-compose.local.yml up to run ModelZoo.Live locally."