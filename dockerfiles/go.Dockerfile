FROM modelzoo/base

WORKDIR /
RUN mkdir /modelzoo
COPY . /modelzoo

WORKDIR /modelzoo
RUN make protos

RUN go get -u github.com/vincent-petithory/dataurl \
 && go get -u github.com/kazegusuri/grpc-panic-handler \
 && go get -u github.com/harbor-ml/modelzoo/go/protos

WORKDIR /modelzoo/go

CMD ["go", "run", "mock_server.go"]