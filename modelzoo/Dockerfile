FROM python:slim
# NOTE: alpine base does source compilation
# of python libs due to lack of WHL support

WORKDIR /app
COPY . /app

RUN apt-get update \
      && apt-get install -y --no-install-recommends make
RUN pip install flask_cors
RUN pip install -r requirements.txt
WORKDIR /app/modelzoo

EXPOSE 1000

CMD ["make"]
