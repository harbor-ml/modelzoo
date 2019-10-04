import requests
import pytest
from subprocess import Popen
import random
import model_io.protos.services_pb2 as pb
import base64
import time

from google.protobuf import json_format


@pytest.fixture(scope="session")
def start_clipper():
    port = random.randint(10000,30000)
    proc = Popen("gunicorn -b 0.0.0.0:{} model_io.clipper:app".format(port), shell=True)
    url = "http://0.0.0.0:{}".format(port)
    
    cnt = 5
    while cnt >= 0:
        cnt -= 1
        try:
            requests.get(url)
            break
        except: 
            time.sleep(0.5)

    yield url
    proc.kill()

def test_text_gen(start_clipper):
    url = start_clipper
    data = ['hi', 'bye']
    input_pb = pb.Text(texts=data)
    input_pb.metadata["item_length"] = "2"

    resp = requests.post(url+"/text_generation/predict", json={
        "input": base64.b64encode(input_pb.SerializeToString()).decode()
    })

    output_pb = pb.Text()
    output_pb.ParseFromString(base64.b64decode(resp.json()["output"]))

    assert output_pb.texts == [d[::-1] for d in data]
    assert json_format.MessageToDict(output_pb)["metadata"] == {
        "item_length": "2", # old metadata perserved
        "method": "reversed", # new metadata added
    }
    