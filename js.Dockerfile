FROM modelzoo/base

WORKDIR js

RUN npm i grpc-web \
 && npm install

 CMD ["npm", "start"]