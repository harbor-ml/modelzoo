from protos.services_pb2 import VisionClassificationRequest, VisionClassificationResponse

import requests
import base64

url = "http://127.0.0.1:8000/res50/predict"
req = VisionClassificationRequest(input_image=b'..........', num_returns=5)
payload = {
    'input': base64.b64encode(req.SerializeToString()).decode()
}

resp = requests.post(url, json=payload)
print(resp.json())
out_bytes = base64.b64decode(resp.json()['output'])
resp_obj = VisionClassificationResponse()
resp_obj.ParseFromString(out_bytes)
print(resp_obj)