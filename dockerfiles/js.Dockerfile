FROM modelzoo/base

WORKDIR /
RUN mkdir -p /modelzoo/js
COPY js /modelzoo/js
RUN cd /modelzoo/js && npm install

COPY protos Makefile /modelzoo/
WORKDIR /modelzoo
RUN make protos
RUN make link

WORKDIR /modelzoo/js

# RUN npm run build \
#  && npm install -g serve
# CMD ["serve", "-s", "build"]

CMD ["npm", "start"]