FROM modelzoo/base

RUN make link

WORKDIR js

RUN npm i grpc-web \
 && npm install

 CMD ["npm", "start"]