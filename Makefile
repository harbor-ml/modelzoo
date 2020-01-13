SHELL := /bin/bash

placeholder:
	@echo "Do not use plain 'make'. Add a subcommand."

.PHONY: protos

protos: proto-js proto-py proto-go

protoc_include = -I/usr/local/include -I . \
  		-I ${GOPATH}/src \
  		-I ${GOPATH}/src/github.com/grpc-ecosystem/grpc-gateway/third_party/googleapis 

proto-js:
	protoc \
		$(protoc_include) \
		--js_out=import_style=commonjs,binary:js \
		--grpc-web_out=import_style=commonjs+dts,mode=grpcwebtext:js \
		protos/*.proto 


proto-py:
	cd ..; python -m grpc_tools.protoc \
		$(protoc_include) \
		--python_out=modelzoo \
		--grpc_python_out=modelzoo \
		--mypy_out=modelzoo \
		modelzoo/protos/*.proto
	
proto-go:
	PATH="$(GOPATH)/bin:$(PATH)" \
	protoc \
		$(protoc_include) \
  		--go_out=plugins=grpc,paths=source_relative:go \
		--grpc-gateway_out=logtostderr=true,paths=source_relative:go \
        --swagger_out=logtostderr=true:go \
		./protos/*.proto

.PHONY: link
link:
	cd js/protos; yarn link
	cd js; yarn link "protos"

