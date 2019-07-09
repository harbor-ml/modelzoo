FROM modelzoo/base

RUN go get -u github.com/vincent-petithory/dataurl \
 && go get -u github.com/kazegusuri/grpc-panic-handler 

RUN mkdir /go/src/modelzoo
COPY go /go/src/modelzoo/go
COPY protos /go/src/modelzoo/protos
COPY Makefile /go/src/modelzoo

WORKDIR /go/src/modelzoo
RUN make proto-go

WORKDIR /go/src/modelzoo/go

CMD ["go", "run", "mock_server.go"]