FROM modelzoo/base

WORKDIR js

RUN npm install

WORKDIR modelzoo

RUN make link

WORKDIR js

 CMD ["npm", "start"]