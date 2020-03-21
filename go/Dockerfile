FROM golang:alpine

WORKDIR /go/src/workdir
COPY . /go/src/workdir

RUN apk add --no-cache gcc musl-dev make git dep
RUN dep ensure
RUN make build

EXPOSE 3020
EXPOSE 8080
EXPOSE 9000
EXPOSE 9090
EXPOSE 9999

CMD ["make", "run"]
