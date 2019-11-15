from __future__ import print_function
import base64
import io
import json
import mimetypes
import numpy as np
import random

import numpy as np
from flask import Flask, jsonify, request, g
from flask_cors import CORS
from PIL import Image
from google.protobuf import json_format
import requests

import modelzoo.protos.services_pb2 as pb
from modelzoo.sugar import (
    image_input,
    image_output,
    register_type,
)

import tensorrt as trt
import pycuda.driver as cuda
import pycuda.autoinit
from PIL import ImageDraw, ImageFont, ImageColor

from yolov3_to_onnx import download_file
from data_processing import PreprocessYOLO, PostprocessYOLO, ALL_CATEGORIES

import sys, os
sys.path.insert(1, os.path.join(sys.path[0], ".."))
import common

TRT_LOGGER = trt.Logger()

def draw_bboxes(image_raw, bboxes, confidences, categories, all_categories, bbox_color='blue'):
    """Draw the bounding boxes on the original input image and return it.

    Keyword arguments:
    image_raw -- a raw PIL Image
    bboxes -- NumPy array containing the bounding box coordinates of N objects, with shape (N,4).
    categories -- NumPy array containing the corresponding category for each object,
    with shape (N,)
    confidences -- NumPy array containing the corresponding confidence for each object,
    with shape (N,)
    all_categories -- a list of all categories in the correct ordered (required for looking up
    the category name)
    bbox_color -- an optional string specifying the color of the bounding boxes (default: 'blue')
    """
    font = ImageFont.truetype("Helvetica.ttc", 100)
    draw = ImageDraw.Draw(image_raw)
    print(bboxes, confidences, categories)
    for box, score, category in zip(bboxes, confidences, categories):
        x_coord, y_coord, width, height = box
        col = ImageColor.getrgb("#" + ''.join([random.choice('0123456789ABCDEF') for j in range(6)]))
        left = max(0, np.floor(x_coord + 0.5).astype(int))
        top = max(0, np.floor(y_coord + 0.5).astype(int))
        right = min(image_raw.width, np.floor(x_coord + width + 0.5).astype(int))
        bottom = min(image_raw.height, np.floor(y_coord + height + 0.5).astype(int))

        draw.rectangle(((left, top), (right, bottom)), outline=col)
        draw.text((left, top - 12), '{0} {1:.2f}'.format(all_categories[category], score), fill=col, font=font)

    return image_raw

def get_engine(onnx_file_path, engine_file_path=""):
    """Attempts to load a serialized engine if available, otherwise builds a new TensorRT engine and saves it."""
    def build_engine():
        """Takes an ONNX file and creates a TensorRT engine to run inference with"""
        with trt.Builder(TRT_LOGGER) as builder, builder.create_network() as network, trt.OnnxParser(network, TRT_LOGGER) as parser:
            builder.max_workspace_size = 1 << 28 # 256MiB
            builder.max_batch_size = 1
            # Parse model file
            if not os.path.exists(onnx_file_path):
                print('ONNX file {} not found, please run yolov3_to_onnx.py first to generate it.'.format(onnx_file_path))
                exit(0)
            print('Loading ONNX file from path {}...'.format(onnx_file_path))
            with open(onnx_file_path, 'rb') as model:
                print('Beginning ONNX file parsing')
                parser.parse(model.read())
            print('Completed parsing of ONNX file')
            print('Building an engine from file {}; this may take a while...'.format(onnx_file_path))
            engine = builder.build_cuda_engine(network)
            print("Completed creating Engine")
            with open(engine_file_path, "wb") as f:
                f.write(engine.serialize())
            return engine

    if os.path.exists(engine_file_path):
        # If a serialized engine exists, use it instead of building an engine.
        print("Reading engine from file {}".format(engine_file_path))
        with open(engine_file_path, "rb") as f, trt.Runtime(TRT_LOGGER) as runtime:
            return runtime.deserialize_cuda_engine(f.read())
    else:
        return build_engine()
"""Create a TensorRT engine for ONNX-based YOLOv3-608 and run inference."""

# Try to load a previously generated YOLOv3-608 network graph in ONNX format:
onnx_file_path = 'yolov3.onnx'
engine_file_path = "yolov3.trt"
input_resolution_yolov3_HW = (608, 608)
# Create a pre-processor object by specifying the required input resolution for YOLOv3
preprocessor = PreprocessYOLO(input_resolution_yolov3_HW)
# Output shapes expected by the post-processor
output_shapes = [(1, 255, 19, 19), (1, 255, 38, 38), (1, 255, 76, 76)]
engine = get_engine(onnx_file_path, engine_file_path)
context = engine.create_execution_context()
postprocessor_args = {"yolo_masks": [(6, 7, 8), (3, 4, 5), (0, 1, 2)],                    # A list of 3 three-dimensional tuples for the YOLO masks
                        "yolo_anchors": [(10, 13), (16, 30), (33, 23), (30, 61), (62, 45),  # A list of 9 two-dimensional tuples for the YOLO anchors
                                        (59, 119), (116, 90), (156, 198), (373, 326)],
                        "obj_threshold": 0.6,                                               # Threshold for object coverage, float value between 0 and 1
                        "nms_threshold": 0.5,                                               # Threshold for non-max suppression algorithm, float value between 0 and 1
                        "yolo_input_resolution": input_resolution_yolov3_HW}
postprocessor = PostprocessYOLO(**postprocessor_args)
print("Ready to serve!")
app = Flask(__name__)
CORS(app)
from time import perf_counter

@register_type(image_input, image_output)
def predict(inp: Image, metadata):
    image_raw, image = preprocessor.process(inp)
    shape_orig_WH = image_raw.size
    inputs, outputs, bindings, stream = common.allocate_buffers(engine)
    # Do inference
    print('Running inference on image')
    # Set host input to the image. The common.do_inference function will copy the input to the GPU before executing.
    inputs[0].host = image
    a = perf_counter()
    trt_outputs = common.do_inference(context, bindings=bindings, inputs=inputs, outputs=outputs, stream=stream)
    b = perf_counter()
    metadata['TensorRT Inference Latency (s)'] = (b - a)
    trt_outputs = [output.reshape(shape) for output, shape in zip(trt_outputs, output_shapes)]
    postprocessor = PostprocessYOLO(**postprocessor_args)

    # Run the post-processing algorithms on the TensorRT outputs and get the bounding box details of detected objects
    boxes, classes, scores = postprocessor.process(trt_outputs, (shape_orig_WH))
    # Draw the bounding boxes onto the original input image and save it as a PNG file
    obj_detected_img = draw_bboxes(image_raw, boxes, scores, classes, ALL_CATEGORIES)
    return obj_detected_img

def generate_clipper_resp(
    default: bool, output: str, default_explanation="failed query"
):
    return {
        "default": default,
        "default_explanation": default_explanation,
        "output": output,
        "query_id": 1,
    }

@app.route("/<app_name>/predict", methods=["POST"])
def clipper(app_name):

    pred_func = predict
    input_cls = pb.Image
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
