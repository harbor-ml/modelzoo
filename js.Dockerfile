FROM modelzoo/base

WORKDIR js

RUN npm install

WORKDIR /

RUN make link

WORKDIR js

RUN npm run build \
 && npm install -g serve

CMD ["serve", "-s", "build"]