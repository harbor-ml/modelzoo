FROM modelzoo/base

RUN make envoy

WORKDIR js

 CMD ["npm", "start"]