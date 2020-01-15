import base64
import io
import json
import mimetypes
from typing import List
import time

import numpy as np
import pandas as pd
import requests
from flask import Flask, g, jsonify, request
from flask_cors import CORS
from google.protobuf import json_format
from PIL import Image
import onnxruntime as onnxrt
session = onnxrt.InferenceSession('/workspace/resnet101/resnet101v2.onnx', None)
input_name = session.get_inputs()[0].name
c, h, w = (3, 224, 224)
import torch
model = torch.hub.load('pytorch/vision:v0.4.2', 'resnet101', pretrained=True)
model.eval()
model.to('cuda')
from torchvision import transforms
preprocess = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])
labels = open('/workspace/resnet101/class_labels.txt', 'r').read().split('\n')
import modelzoo.protos.model_apis_pb2 as pb
from modelzoo.sugar import (
    image_input,
    image_output,
    register_type,
    table_output,
    text_input,
    text_output,
)
print("Ready to serve!")
app = Flask(__name__)
CORS(app)

def softmax(x):
    x = x.reshape(-1)
    e_x = np.exp(x - np.max(x))
    return e_x / e_x.sum(axis=0)

def postprocess(result):
    return softmax(np.array(result)).tolist()

@register_type(image_input, table_output)
def resnet101_onnxrt(inp: Image, metadata):
    image_arr = np.array([np.asarray(inp.resize((w, h), Image.ANTIALIAS)).transpose([2, 0, 1]).astype(np.float32)])
    image_arr = (image_arr / 255.0 - 0.45) / 0.225
    started = time.time()
    output = session.run([], {input_name: image_arr})[0]
    metadata["model_runtime_s"] = str((time.time() - started))
    res = postprocess(output)
    top3 = np.argsort(res)[-3:][::-1]
    l = [labels[i] for i in top3]
    probs = [res[i] for i in top3]
    df = pd.DataFrame({"rank": [1, 2, 3], "probability": probs, "category": l}).astype(
        str
    )
    return df

@register_type(image_input, table_output)
def resnet101_pytorch(inp: Image, metadata):
    input_tensor = preprocess(inp)
    input_batch = input_tensor.unsqueeze(0)
    started = time.time()
    with torch.no_grad():
        output = model(input_batch.to('cuda'))
    metadata["model_runtime_s"] = str((time.time() - started))
    proba = torch.nn.functional.softmax(output[0], dim=0).cpu().numpy()
    top3 = np.argsort(proba)[-3:][::-1]
    l = [labels[i] for i in top3]
    probs = [proba[i] for i in top3]
    df = pd.DataFrame({"rank": [1, 2, 3], "probability": probs, "category": l}).astype(
        str
    )
    return df


prediction_apps = dict(
    onnxrtresnet=(resnet101_onnxrt, pb.Image),
    pytorch=(resnet101_pytorch, pb.Image),
)


def generate_clipper_resp(
    default: bool, output: str, default_explanation="failed query"
):
    return {
        "default": default,
        "default_explanation": default_explanation,
        "output": output,
        "query_id": 1,
    }


@app.route("/")
def ok():
    return "OK"


@app.route("/<app_name>/predict", methods=["POST"])
def onnxrt(app_name):
    pred_func, input_cls = prediction_apps[app_name]
    request_proto = input_cls()
    request_proto.ParseFromString(base64.b64decode(request.json["input"]))

    request_proto_dict = json_format.MessageToDict(request_proto)
    metadata_dict = request_proto_dict.get("metadata", dict())
    result_proto = pred_func(request_proto, metadata_dict)

    # Populate metadata
    for k, v in metadata_dict.items():
        result_proto.metadata[k] = str(v)

    serialized = base64.b64encode(result_proto.SerializeToString()).decode()
    return jsonify(generate_clipper_resp(False, serialized))
