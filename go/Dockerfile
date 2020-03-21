FROM golang:alpine

WORKDIR /go/src/workdir
COPY . /go/src/workdir

RUN apk add --no-cache gcc musl-dev make git dep
RUN dep ensure
RUN make build

EXPOSE 3020 8080 9000 9090 9999

CMD ["make", "run"]
