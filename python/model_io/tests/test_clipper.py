import requests
import pytest
from subprocess import Popen
import random
import model_io.protos.services_pb2 as pb
import base64
import time
from flaky import flaky


@pytest.fixture(scope="session")
def start_clipper():
    port = random.randint(10000,30000)
    proc = Popen("gunicorn -b 0.0.0.0:{} model_io.clipper:app".format(port), shell=True)
    url = "http://0.0.0.0:{}".format(port)
    time.sleep(2)
    yield url
    proc.kill()

def test_text_gen(start_clipper):
    url = start_clipper
    resp = requests.post(url+"/text_generation/predict", json={
        "input": base64.b64encode(pb.Text(texts=['hi', 'bye']).SerializeToString()).decode()
    })
    print(resp.text)
    1/0