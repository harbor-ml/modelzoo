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

@register_type(image_input, table_output, "metadata")
def vision_classification(inp: Image, metadata):
    df = pd.DataFrame(
        {
            "rank": [1, 2, 3],
            "category": ["a", "b", "c"],
            "image_data": [str(inp) for _ in range(3)],
        }
    ).astype(str)

    return df, metadata


@register_type(text_input, text_output, "metadata")
def text_generation(inp: List[str], metadata):
    return [item[::-1] for item in inp], metadata


@register_type(image_input, image_output, "metadata")
def image_segmentation(inp: Image, metadata):
    return inp.rotate(45), metadata


@register_type(image_input, text_output, "metadata")
def image_captioning(inp: Image, metadata):
    return ["this is a cool image lol"], metadata



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
    result_proto, metadata = pred_func(request_proto, {'meta': 2})
    # TODO(simon): handle metadata correctly in input and output sugar
    # ideally: input meta kvs should be parsed and injected into function
    #          output meta kvs should be inject to output proto automatically
    serialized = base64.b64encode(result_proto.SerializeToString()).decode()
    return jsonify(generate_clipper_resp(False, serialized))
