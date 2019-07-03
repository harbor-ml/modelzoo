SHELL := /bin/bash

placeholder:
	@echo "Use make with commands like `make go`"

.PHONY: go
go:
	cd go; make all

.PHONY: envoy
envoy:
	cd envoy; make all

.PHONY: js
	cd js; make all

.PHONY: ingress
	cd ingress; make all

.PHONY: all
all: go envoy js ingress