SHELL := /bin/bash

placeholder:
	@echo "Use make with commands like `make go`"

.PHONY: go
go:
	docker build -f go.Dockerfile /Users/rehandurrani/Documents/modelzoo/dockerfiles -t modelzoo/go

.PHONY: js
js:
	docker build -f js.Dockerfile /Users/rehandurrani/Documents/modelzoo/dockerfiles -t modelzoo/js

# Base must always be public when built so that js and go containers can pull correct version.
.PHONY: base
base:
	docker build -f base.Dockerfile /Users/rehandurrani/Documents/modelzoo/dockerfiles -t modelzoo/base
	docker push modelzoo/base

.PHONY: envoy
envoy:
	docker build -f envoy.Dockerfile /Users/rehandurrani/Documents/modelzoo/dockerfiles -t modelzoo/envoy

.PHONY: all
all: base js go envoy

.PHONY: public
public: all jspublic gopublic envoypublic

.PHONY: gopublic jspublic envoypublic
gopublic:
	docker push modelzoo/go

jspublic:
	docker push modelzoo/js

envoypublic:
	docker push modelzoo/envoy