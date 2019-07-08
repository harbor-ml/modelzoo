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

.PHONY: base
base:
	docker build -t modelzoo/base -f ./dockerfiles/base.Dockerfile .
	docker push modelzoo/base

# To me (RSD) it seems that the default make of docker should be private unless otherwise specified.
.PHONY: docker
docker:
	cd dockerfiles; make all

.PHONY: dockerPublic
dockerPublic:
	cd dockerfiles; make public

.PHONY: k8s
k8s:
	cd k8s; make all