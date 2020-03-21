FROM node:alpine

WORKDIR /app/js
COPY . /app

RUN apk add --no-cache make
RUN yarn
WORKDIR /app
RUN make link
WORKDIR /app/js

EXPOSE 3000

CMD ["make", "dev"]
