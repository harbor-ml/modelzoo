FROM modelzoo/base

WORKDIR /
RUN mkdir -p /modelzoo/js
COPY js/package.json /modelzoo/js/
RUN cd /modelzoo/js && npm install

COPY js /modelzoo/js/

COPY protos /modelzoo/protos
COPY Makefile /modelzoo/
WORKDIR /modelzoo
RUN make proto-js
RUN make link

WORKDIR /modelzoo/js

# RUN npm run build \
#  && npm install -g serve
# CMD ["serve", "-s", "build"]

CMD ["npm", "start"]