.PHONY: build test

build:
	go build -v -o modelzoo_server
test:
	cd tests; python run_test.py
run: build
	./modelzoo_server serve --seed --path tests/models.json
