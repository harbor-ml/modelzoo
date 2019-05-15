from starlette.applications import Starlette
from starlette.responses import JSONResponse
from starlette.requests import Request
from starlette.middleware.cors import CORSMiddleware
import json
import base64
import numpy as np

from data import CATEGORIES
from protos.services_pb2 import VisionClassificationResponse, VisionClassificationRequest


app = Starlette(debug=True)
app.add_middleware(CORSMiddleware, allow_origins=['*'], allow_methods=["*"], allow_headers=["*"])

def generate_clipper_resp(default, output, exp="failed query"):
    return {
        "default": default,
        "default_explanation": exp,
        "output": output,
        "query_id": 1
    }

def make_resp(req: VisionClassificationRequest):
    r = VisionClassificationResponse()
    for i in range(req.num_returns):
        single_result = r.results.add()
        single_result.rank=i+1
        single_result.category=np.random.choice(CATEGORIES)
        single_result.proba=0.77
    return base64.b64encode(r.SerializeToString()).decode()
    

responses = {
    "fail": generate_clipper_resp(True, "failed output"),
    "res50": generate_clipper_resp(False, '[{"rank": 1, "class": "proboscis_monkey", "prob": 0.05657079443335533}, {"rank": 2, "class": "teddy", "prob": 0.052726056426763535}, {"rank": 3, "class": "toyshop", "prob": 0.04453776776790619}]')
}

@app.route("/{app_name}/predict", methods=["POST"])
async def homepage(request:Request):
    app_name = request.path_params["app_name"]
    inp = await request.json()
    req = VisionClassificationRequest()
    req.ParseFromString(base64.b64decode(inp["input"]))

    print(req)

    if app_name in responses:
        resp = responses[app_name].copy()
        resp['output'] = make_resp(req)
        return JSONResponse(resp)
    else:
        return JSONResponse({"avaiable_apps": list(responses.keys())})
