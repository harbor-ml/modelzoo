SHELL := /bin/bash

placeholder:
	@echo "Do not use plain 'make'. Add a subcommand."

.PHONY: protos

protos: proto-js proto-py proto-go

protoc_include = -I/usr/local/include -I . \
  		-I ${GOPATH}/src \
  		-I ${GOPATH}/src/github.com/grpc-ecosystem/grpc-gateway/third_party/googleapis 

proto-js:
	cd ..; protoc \
		$(protoc_include) \
		--js_out=import_style=commonjs,binary:modelzoo/js/generated \
		--grpc-web_out=import_style=commonjs+dts,mode=grpcwebtext:modelzoo/js/generated \
		modelzoo/protos/*.proto google/api/annotations.proto google/api/http.proto


proto-py:
	cd ..; python -m grpc_tools.protoc \
		$(protoc_include) \
		--python_out=modelzoo \
		--grpc_python_out=modelzoo \
		--mypy_out=modelzoo \
		modelzoo/protos/*.proto
	
proto-go:
	cd ..; protoc \
		$(protoc_include) \
  		--go_out=plugins=grpc,paths=source_relative:modelzoo/go \
		--grpc-gateway_out=logtostderr=true,paths=source_relative:modelzoo/go \
        --swagger_out=logtostderr=true:modelzoo/go \
		modelzoo/protos/*.proto

.PHONY: link
link:
	cd js; yarn unlink "js"
	cd js/generated/modelzoo/protos; yarn link
	cd js; yarn link "js"

