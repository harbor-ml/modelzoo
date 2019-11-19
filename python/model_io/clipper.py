import base64
import io
import json
import mimetypes
from typing import List

import numpy as np
import pandas as pd
import requests
import torch
from flask import Flask, g, jsonify, request
from flask_cors import CORS
from google.protobuf import json_format
from PIL import Image
from torchvision import transforms

import model_io.protos.services_pb2 as pb
from model_io.sugar import (
    image_input,
    image_output,
    register_type,
    table_output,
    text_input,
    text_output,
)

app = Flask(__name__)
CORS(app)

# Load basic models
model18 = torch.hub.load("pytorch/vision", "resnet18", pretrained=True).eval()
model50 = torch.hub.load("pytorch/vision", "resnet50", pretrained=True).eval()
model152 = torch.hub.load("pytorch/vision", "resnet152", pretrained=True).eval()

preprocess = transforms.Compose(
    [
        transforms.Resize(256),
        transforms.CenterCrop(224),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ]
)

labels = {
    int(key): value
    for (key, value) in requests.get(
        "https://s3.amazonaws.com/outcome-blog/imagenet/labels.json"
    )
    .json()
    .items()
}


@register_type(image_input, table_output)
def image_r50(inp: Image, metadata):
    input_tensor = preprocess(inp)
    input_batch = input_tensor.unsqueeze(0)
    with torch.no_grad():
        output = model50(input_batch)
    proba = torch.nn.functional.softmax(output[0], dim=0).numpy()
    top3 = np.argsort(proba)[-3:][::-1]
    l = [labels[i] for i in top3]
    probs = [proba[i] for i in top3]
    df = pd.DataFrame({"rank": [1, 2, 3], "probability": probs, "category": l}).astype(
        str
    )
    return df


@register_type(image_input, table_output)
def image_r18(inp: Image, metadata):
    input_tensor = preprocess(inp)
    input_batch = input_tensor.unsqueeze(0)
    with torch.no_grad():
        output = model18(input_batch)
    proba = torch.nn.functional.softmax(output[0], dim=0).numpy()
    top3 = np.argsort(proba)[-3:][::-1]
    l = [labels[i] for i in top3]
    probs = [proba[i] for i in top3]
    df = pd.DataFrame({"rank": [1, 2, 3], "probability": probs, "category": l}).astype(
        str
    )
    return df


@register_type(image_input, table_output)
def image_r152(inp: Image, metadata):
    input_tensor = preprocess(inp)
    input_batch = input_tensor.unsqueeze(0)
    with torch.no_grad():
        output = model152(input_batch)
    proba = torch.nn.functional.softmax(output[0], dim=0).numpy()
    top3 = np.argsort(proba)[-3:][::-1]
    l = [labels[i] for i in top3]
    probs = [proba[i] for i in top3]
    df = pd.DataFrame({"rank": [1, 2, 3], "probability": probs, "category": l}).astype(
        str
    )
    return df


@register_type(image_input, table_output)
def vision_classification(inp: Image, metadata):
    df = pd.DataFrame(
        {
            "rank": [1, 2, 3],
            "category": ["a", "b", "c"],
            "image_data": [str(inp) for _ in range(3)],
        }
    ).astype(str)

    return df


@register_type(text_input, text_output)
def text_generation(inp: List[str], metadata):
    metadata["method"] = "reversed"
    return [item[::-1] for item in inp]


@register_type(image_input, image_output)
def image_segmentation(inp: Image, metadata):
    return inp.rotate(45)


@register_type(image_input, text_output)
def image_captioning(inp: Image, metadata):
    return ["this is a cool image lol"]


prediction_apps = dict(
    vision_classification=(vision_classification, pb.Image),
    text_generation=(text_generation, pb.Text),
    image_segmentation=(image_segmentation, pb.Image),
    image_captioning=(image_captioning, pb.Image),
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
def clipper(app_name):
    if app_name in ["image_r50", "image_r18", "image_r152"]:
        if app_name == "image_r50":
            pred_func = image_r50
        elif app_name == "image_r18":
            pred_func = image_r18
        else:
            pred_func = image_r152
        input_cls = pb.Image
    else:
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
