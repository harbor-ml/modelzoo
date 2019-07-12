import base64
import io
import json

import mimetypes
import numpy as np
from data import CATEGORIES
from PIL import Image
from protos.services_pb2 import (
    TextGenerationRequest,
    TextGenerationResponse,
    VisionClassificationRequest,
    VisionClassificationResponse,
    ImageSegmentationRequest,
    ImageSegmentationResponse
)
from starlette.applications import Starlette
from starlette.middleware.cors import CORSMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse
from torchvision import transforms
from w3lib.url import parse_data_uri

app = Starlette(debug=True)
app.add_middleware(
    CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"]
)


def generate_clipper_resp(default, output, exp="failed query"):
    return {
        "default": default,
        "default_explanation": exp,
        "output": output,
        "query_id": 1,
    }


def make_resp(req: VisionClassificationRequest):
    r = VisionClassificationResponse()
    for i in range(req.num_returns):
        single_result = r.results.add()
        single_result.rank = i + 1
        single_result.category = np.random.choice(CATEGORIES)
        single_result.proba = 0.77
    return base64.b64encode(r.SerializeToString()).decode()

responses = {
    "fail": generate_clipper_resp(True, "failed output"),
    "res50-pytorch": generate_clipper_resp(False, "failed"),
    "squeezenet-pytorch": generate_clipper_resp(False, "lalala"),
    "rise-pytorch": generate_clipper_resp(False, ""),
    "marvel-pytorch": generate_clipper_resp(False, ""),
    "image-segmentation": generate_clipper_resp(False, "")
}


async def handle_text(request: Request, app_name: str):
    inp = await request.json()
    req = TextGenerationRequest()
    req.ParseFromString(base64.b64decode(inp["input"]))

    generated_text = (
        f"This is generated text for {req.input_phrase}, temp: {req.temperature:.2f}"
    )
    r = TextGenerationResponse(generated_texts=[generated_text for _ in range(3)])
    encoded = base64.b64encode(r.SerializeToString()).decode()

    resp = responses[app_name].copy()
    resp["output"] = encoded
    return JSONResponse(resp)


async def handle_vision(request: Request, app_name: str):
    inp = await request.json()
    req = VisionClassificationRequest()
    req.ParseFromString(base64.b64decode(inp["input"]))

    # Make sure the image is good and we don't crash
    imgBytes = parse_data_uri(req.input_image).data
    img = Image.open(io.BytesIO(imgBytes)).convert("RGB")
    tensor = transforms.ToTensor()(img)

    resp = responses[app_name].copy()
    resp["output"] = make_resp(req)
    return JSONResponse(resp)


async def handle_segmentation(request: Request, app_name: str):
    inp = await request.json()
    req = ImageSegmentationRequest()
    req.ParseFromString(base64.b64decode(inp["input"]))

    imgBytes = parse_data_uri(req.input_image).data
    img = Image.open(io.BytesIO(imgBytes)).convert("RGB")
    img = img.rotate(45)
    buffered = io.BytesIO()
    img.save(buffered, format="JPEG")
    img_str = base64.b64encode(buffered.getvalue()).decode()
    string = u'data:%s;base64,%s' % (mimetypes.types_map['.jpg'], img_str)
    r = ImageSegmentationResponse(output_image=string)
    encoded = base64.b64encode(r.SerializeToString()).decode()

    resp = responses[app_name].copy()
    resp["output"] = encoded
    return JSONResponse(resp)

@app.route("/{app_name}/predict", methods=["POST"])
async def homepage(request: Request):
    app_name = request.path_params["app_name"]

    if app_name == "rise-pytorch" or app_name == "marvel-pytorch":
        resp = await handle_text(request, app_name)
        return resp
    elif app_name == "image-segmentation":
        resp = await handle_segmentation(request, app_name)
        return resp
    elif app_name in responses:
        resp = await handle_vision(request, app_name)
        return resp
    else:
        return JSONResponse({"avaiable_apps": list(responses.keys())})
