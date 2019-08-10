import typing
import base64
import io
import os
from w3lib.url import parse_data_uri
import mimetypes
from PIL import Image
from pathlib import Path
from _protos.services_pb2_grpc import ModelStub
from _protos.services_pb2 import (
    TextGenerationRequest,
    ImageSegmentationRequest,
    VisionClassificationRequest,
    ModelUUIDRequest,
    ModelUUIDResponse,
)
import grpc

channel = grpc.insecure_channel('52.40.213.134:9091')
serve = ModelStub(channel)

def _query_for_model_uuid(model: str, token: str) -> typing.Union[str, None] :
    req = ModelUUIDRequest(model_name=model, token=token)
    resp = serve.ModelUUID(req)
    print(resp)