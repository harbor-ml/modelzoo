SHELL := /bin/bash

placeholder:
	@echo "Use make with commands like `make protos`"

proto-js:
	protoc \
		--js_out=import_style=commonjs,binary:js \
		--grpc-web_out=import_style=commonjs+dts,mode=grpcwebtext:js \
		./protos/*.proto

proto-py:
	protoc \
		--python_out=python/model_io --mypy_out=python/model_io \
		./protos/*.proto

.PHONY: proto-py-pkg
proto-py-pkg:
	python -m grpc_tools.protoc -I protos --python_out=modelzoo/protos --grpc_python_out=modelzoo/protos protos/services.proto
	
proto-go:
	protoc -I/usr/local/include -I . \
  		-I ${GOPATH}/src \
  		-I ${GOPATH}/src/github.com/grpc-ecosystem/grpc-gateway/third_party/googleapis \
  		--go_out=plugins=grpc,paths=source_relative:go ./protos/*.proto && \
	protoc -I/usr/local/include -I . \
  		-I${GOPATH}/src \
  		-I${GOPATH}/src/github.com/grpc-ecosystem/grpc-gateway/third_party/googleapis \
  		--grpc-gateway_out=logtostderr=true,paths=source_relative:go ./protos/*.proto \
		  
.PHONY: protos
protos: proto-js proto-py proto-go

.PHONY: link
link:
	cd js; npm link ./protos

.PHONY: base
base:
	sudo docker build -t modelzoolive/base -f ./dockerfiles/base.Dockerfile .

.PHONY: go
go:
	sudo docker build -t modelzoolive/go -f ./dockerfiles/go.Dockerfile .

.PHONY: js
js:
	sudo docker build -t modelzoolive/js -f ./dockerfiles/js.Dockerfile .

.PHONY: envoyProd
envoyProd:
	sudo docker build -t modelzoolive/envoy -f ./dockerfiles/envoy_prod.Dockerfile .

.PHONY: envoyDev
envoyDev:
	docker build -t modelzoolive/envoydev -f ./dockerfiles/envoy_dev.Dockerfile .

format-yaml:
	fd 'y[a]*ml' . | xargs -n 1 -I {} bash -c "yq r '{}' | sponge '{}'"