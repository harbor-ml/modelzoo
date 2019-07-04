SHELL := /bin/bash

placeholder:
	@echo "Use make with commands like `make go`"

.PHONY: all
all:
	kubectl apply -f ./js_deployment.yaml
	kubectl apply -f ./js_service.yaml