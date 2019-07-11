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
		--python_out=python --mypy_out=python \
		./protos/*.proto
proto-go:
	protoc --go_out=plugins=grpc,paths=source_relative:go ./protos/*.proto

.PHONY: protos
protos: proto-js proto-py proto-go

.PHONY: link
link:
	cd js; npm link ./protos

.PHONY: base
base:
	docker build -t modelzoolive/base -f ./dockerfiles/base.Dockerfile .

.PHONY: go
go:
	docker build -t modelzoolive/go -f ./dockerfiles/go.Dockerfile .

.PHONY: js
js:
	docker build -t modelzoolive/js -f ./dockerfiles/js.Dockerfile .

.PHONY: envoyProd
envoyProd:
	docker build -t modelzoolive/envoy -f ./dockerfiles/envoy_prod.Dockerfile .

.PHONY: envoyDev
envoyDev:
	docker build -t modelzoolive/envoydev -f ./dockerfiles/envoy_dev.Dockerfile .

format-yaml:
	fd 'y[a]*ml' . | xargs -n 1 -I {} bash -c "yq r '{}' | sponge '{}'"