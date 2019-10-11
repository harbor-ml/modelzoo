# ModelZoo.Live
The final layer in the prediction serving stack.

ModelZoo.Live consists of three layers - a frontend UI written in JavaScript, a Go Routing Middleware, which includes both a gRPC server, and a HTTP Reverse Proxy for gRPC, and a Python Client to aid in using the service programmatically. It is intended to be used with the prediction serving framework of your choice, such as [RayServe](https://github.com/simon-mo/ray-serve) or [Clipper](https://clipper.ai).

It can be used to share and keep track of ML models across teams within your organization, and to organize metrics about your models. 

For more info, about ModelZoo.Live, as well as what the team hopes it can do for you, check out these [slides](). (Link is currently dead, will be released after RISECamp 2019)

## Go
To seed the model database, cd into `modelzoo/go`, run `go build` and finally `./go seed --data filename`, where `filename` is a JSON file containing your seed data. Please check this [example](models.json) to get an idea for how this file should look.

To run the Go Server, cd into `modelzoo/go`, run `go build` and finally `./go serve`. To query this, you can use the `ModelZooConnection` client API, written in Python.

To run the HTTP Reverse Proxy, cd into `modelzoo/go`, run `go build` and finally, `./go proxy`.

The reverse proxy can be queried with cURL. Some examples follow. Please note that `http://modelzoo.url` should be replaced with the URL for your proxy. For example, if you ran it locally on port 9090, you would replace `http://modelzoo.url` with `http://localhost:9090`.

### List Models
```sh
curl -X POST -d '{"body": ""}' http://modelzoo.url/get/models
```
### Get Token
```sh
curl -X POST -d '{"body": ""}' http://modelzoo.url/get/token
```
### Create User
```sh
curl -X POST -d '{"email":"myemail", "password":"mypassword"}' localhost:9090/create/user
```
### Get User (To Check if User exists. Also used to authenticate with the python client)
```sh
curl -X POST -d '{"email":"myemail", "password":"mypassword"}' localhost:9090/get/user
```
### Text Inference
```bash
curl -X POST -d '{"text": {"access_token": "0ad62eb5-c10f-4f09-acb9-509ebf654489", \
    "metadata": {},"model_name": "text_generation_mock","texts": ["123456","654321"]},"type": "TEXT"}' http://modelzoo.url/inference
```