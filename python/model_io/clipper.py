import base64
import io
import json
import mimetypes

import pandas as pd
import numpy as np
from flask import Flask, jsonify, request, g
from flask_cors import CORS
from PIL import Image
from typing import List
from google.protobuf import json_format

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
