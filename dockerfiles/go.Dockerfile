FROM modelzoo/base

RUN go get -u github.com/vincent-petithory/dataurl \
 && go get -u github.com/kazegusuri/grpc-panic-handler \
 && go get -u github.com/harbor-ml/modelzoo/go/protos

WORKDIR go

CMD ["go", "run", "mock_server.go"]