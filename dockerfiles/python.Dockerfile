FROM modelzoolive/base

ENV LC_ALL=C.UTF-8
ENV LANG=C.UTF-8

WORKDIR /
RUN mkdir -p /modelzoo/python
COPY python/requirements.txt /modelzoo/python/
RUN cd /modelzoo/python && pip install -r requirements.txt

COPY python /modelzoo/python
COPY protos /modelzoo/protos
COPY Makefile /modelzoo/

WORKDIR /modelzoo
RUN make proto-py

WORKDIR /modelzoo/python

CMD ["uvicorn", "clipper:app", "--host=0.0.0.0"]