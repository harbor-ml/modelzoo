SHELL := /bin/bash

placeholder:
	@echo "Use make with commands like `make go`"

.PHONY: all go envoy js ingress

go:
	cd go; make all

envoy:
	cd envoy; make all

js:	
	cd js; make all

ingress:
	cd ingress; make all

all: go envoy js ingress
