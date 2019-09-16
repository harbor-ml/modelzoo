FROM modelzoolive/base

ENV backend="--public"

RUN go get -u github.com/vincent-petithory/dataurl \
 && go get -u github.com/kazegusuri/grpc-panic-handler \
 && go get github.com/lib/pq \
 && go get -u github.com/jinzhu/gorm \
 && go get github.com/google/uuid \
 && go get -u github.com/mattn/go-sqlite3

RUN mkdir /go/src/modelzoo
COPY go /go/src/modelzoo/go
COPY protos /go/src/modelzoo/protos
COPY go/dbtypes /go/src/modelzoo/dbtypes
COPY Makefile /go/src/modelzoo

WORKDIR /go/src/modelzoo
RUN make proto-go

WORKDIR /go/src/modelzoo/go

CMD ["sh", "-c", "go run mock_server.go ${backend}"]