SHELL := /bin/bash

placeholder:
	@echo "Use make with commands like `make protos`"

.PHONY: protos
protos: 
	protoc --go_out=plugins=grpc,paths=source_relative:go ./protos/*.proto

	protoc \
		--js_out=import_style=commonjs:js \
		--grpc-web_out=import_style=commonjs+dts,mode=grpcwebtext:js \
		./protos/*.proto
	
	protoc \
		--python_out=python --mypy_out=python \
		./protos/*.proto


.PHONY: link
link:
	cd js; npm link ./protos

.PHONY: envoy
envoy:
	docker build -t harbor/envoy -f envoy.Dockerfile envoy
	docker run -it -p 9901:9901 -p 8080:8080 harbor/envoy