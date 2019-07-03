SHELL := /bin/bash

placeholder:
	@echo "Use make with commands like `make go`"

.PHONY: all
all:
	kubectl apply -f ./go_deployment.yaml
	kubectl apply -f ./go_service.yaml