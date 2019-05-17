from starlette.applications import Starlette
from starlette.responses import JSONResponse
from starlette.requests import Request
from starlette.middleware.cors import CORSMiddleware
import json
import base64
import numpy as np

from data import CATEGORIES
from protos.services_pb2 import (
    VisionClassificationResponse,
    VisionClassificationRequest,
)
from w3lib.url import parse_data_uri
import io
from PIL import Image

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
    "res50": generate_clipper_resp(False, "failed"),
    "squeezenet": generate_clipper_resp(False, "lalala"),
}

from torchvision import transforms


@app.route("/{app_name}/predict", methods=["POST"])
async def homepage(request: Request):
    app_name = request.path_params["app_name"]
    inp = await request.json()
    req = VisionClassificationRequest()
    req.ParseFromString(base64.b64decode(inp["input"]))

    imgBytes = parse_data_uri(req.input_image).data
    img = Image.open(io.BytesIO(imgBytes)).convert("RGB")
    tensor = transforms.ToTensor()(img)
    print(img.size, img.mode, img.format, img.info)
    print(tensor.shape)

    if app_name in responses:
        resp = responses[app_name].copy()
        resp["output"] = make_resp(req)
        print("response: ", resp)
        return JSONResponse(resp)
    else:
        return JSONResponse({"avaiable_apps": list(responses.keys())})
