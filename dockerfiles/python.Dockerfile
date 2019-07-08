FROM modelzoo/base

WORKDIR /
RUN mkdir /modelzoo
COPY . /modelzoo

WORKDIR /modelzoo
RUN make protos

WORKDIR /modelzoo/python
RUN pip install -r requirements.txt

CMD ["uvicorn", "clipper:app", "--debug"]