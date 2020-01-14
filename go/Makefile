.PHONY: build test

build:
	go build -v -o modelzoo_server

build-prod:
	packr2
	go build -v -o modelzoo_server
	packr2 clean

test:
	cd tests; python run_test.py

run: build
	./modelzoo_server serve --seed --seedPath tests/seed_generated.json

install-packr:
	packr2 --help || go get -u github.com/gobuffalo/packr/v2/packr2

seed_json: tests/models.yaml
	yq r -j tests/models.yaml > tests/seed_generated.json
