from protos.services_pb2 import (
    VisionClassificationRequest,
    VisionClassificationResponse,
    TextGenerationRequest,
    TextGenerationResponse,
)

import requests
import base64

url = "http://127.0.0.1:8000/marvel-pytorch/predict"

# req = VisionClassificationRequest(input_image=b"..........", num_returns=5)
req = TextGenerationRequest(input_phrase="hi i am", temperature=0.7)

payload = {"input": base64.b64encode(req.SerializeToString()).decode()}

resp = requests.post(url, json=payload)
print(resp.json())
out_bytes = base64.b64decode(resp.json()["output"])

# resp_obj = VisionClassificationResponse()
resp_obj = TextGenerationResponse()

resp_obj.ParseFromString(out_bytes)
print(resp_obj)
