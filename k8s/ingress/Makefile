SHELL := /bin/bash

placeholder:
	@echo "Use make with commands like `make go`"

.PHONY: all
all:
	kubectl apply -f ./mandatory_ingress.yaml
	kubectl apply -f ./js_ingress.yaml