SHELL := /bin/bash

placeholder:
	@echo "Use make with commands like `make go`"

.PHONY: go
go:
	docker build -f go.Dockerfile /Users/rehandurrani/Documents/modelzoo/dockerfiles -t modelzoo/go

.PHONY: js
js:
	docker build -f js.Dockerfile /Users/rehandurrani/Documents/modelzoo/dockerfiles -t modelzoo/js

.PHONY: base
base:
	docker build -f base.Dockerfile /Users/rehandurrani/Documents/modelzoo/dockerfiles -t modelzoo/base

.PHONY: envoy
envoy:
	docker build -f envoy.Dockerfile /Users/rehandurrani/Documents/modelzoo/dockerfiles -t modelzoo/envoy

.PHONY: all
all: base basepublic js go jspublic gopublic envoy envoypublic

.PHONY: public
public: all 

.PHONY: gopublic jspublic basepublic envoypublic
gopublic:
	docker push modelzoo/go

jspublic:
	docker push modelzoo/js

basepublic:
	docker push modelzoo/base

envoypublic:
	docker push modelzoo/envoy