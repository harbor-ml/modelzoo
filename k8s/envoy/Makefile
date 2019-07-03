SHELL := /bin/bash

placeholder:
	@echo "Use make with commands like `make go`"

.PHONY: all
all:
	kubectl apply -f ./envoy_deployment.yaml
	kubectl apply -f ./envoy_service.yaml