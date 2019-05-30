FROM golang:1.12-stretch

WORKDIR /

RUN apt-get update \
 && apt-get install -y software-properties-common autoconf automake libtool g++ unzip protobuf-compiler build-essential git wget \
 && apt-get upgrade -y \
 && apt install -y python3-pip \
 && rm /usr/bin/python \
 && ln -s /usr/bin/python3 /usr/bin/python \
 && ln -s /usr/bin/pip3 /usr/bin/pip

COPY . .

RUN curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash

ENV NVM_DIR /root/.nvm

RUN . $NVM_DIR/nvm.sh \
    && nvm install 11.14.0 \
    && nvm alias default 11.14.0 \
    && nvm use default

ENV NODE_PATH $NVM_DIR/v11.14.0/lib/node_modules
ENV PATH $NVM_DIR/versions/node/v11.14.0/bin:$PATH

RUN wget -O protoc-gen-grpc-web https://github.com/grpc/grpc-web/releases/download/1.0.4/protoc-gen-grpc-web-1.0.4-linux-x86_64 \
 && mv protoc-gen-grpc-web /usr/local/bin/ \
 && chmod +x /usr/local/bin/protoc-gen-grpc-web

RUN pip install protobuf google mypy-protobuf \
 && go get -u github.com/golang/protobuf/protoc-gen-go \
 && make protos \
 && make link

CMD ["/bin/bash"]