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
    ModelResponse,
)
from utils import (
    ImgLike,
    _img_inp_types_to_uri,
    uri_to_img,
    UnauthorizedException
)
import grpc
from socket import gethostbyname
channel = grpc.insecure_channel("%s:9091" % (gethostbyname("modelzoo.live")))
serve = ModelStub(channel)

ModelOutput =  typing.NewType('ModelOutput', typing.Union[typing.Sequence[str], type(Image), typing.Sequence[dict]])

def _query_for_model_uuid(model: str, token: str) -> typing.Union[str, None] :
    req = ModelUUIDRequest(model_name=model, token=token)
    resp = serve.ModelUUID(req)
    return resp.model_uuid

def _process(resp: ModelResponse) -> ModelOutput:
    if resp.typeString == 'text':
        return resp.text.generated_texts
    elif resp.typeString == 'segment':
        return uri_to_img(resp.segment.output_image)
    elif resp.typeString == 'vision':
        r = []
        for res in resp.vision.results:
            r += [{"Rank":res.rank, "Category":res.category, "Confidence":res.proba}]
        return r
    return ['Invalid Response']

def query_text(input_phrase: typing.Union[str, typing.Sequence[str]], temp: float, model: str, token: str) -> typing.Sequence[ModelOutput]:
    input_phrase = input_phrase if isinstance(input_phrase, list) else [input_phrase]
    results = []
    for inp in input_phrase:
        req = create_text_gen_req(inp, temp, model, token)
        resp = serve.TextGeneration(req)
        results.append(_process(resp))
    return results

def query_vision(input_image: typing.Union[ImgLike, typing.Sequence[ImgLike]], model: str, token: str, num_returns: typing.Optional[int] = 3) -> typing.Sequence[ModelOutput]:
    input_image = input_image if isinstance(input_image, list) else [input_image]
    results = []
    for inp in input_image:
        req = create_vision_gen_req(inp, model, token, num_returns)
        resp = serve.VisionClassification(req)
        results.append(_process(resp))
    return results

def query_segmentation(input_image: typing.Union[ImgLike, typing.Sequence[ImgLike]], model: str, token: str) -> typing.Sequence[ModelOutput]:
    input_image = input_image if isinstance(input_image, list) else [input_image]
    results = []
    for inp in input_image:
        req = create_image_seg_req(inp, model, token)
        resp = serve.ImageSegmentation(req)
        results.append(_process(resp))
    return results

def create_text_gen_req(input_phrase: str, temp: float, model: str, token: str) -> TextGenerationRequest :
    uuid = _authorize(model, token)
    return TextGenerationRequest(input_phrase=input_phrase, temperature=temp, model_uuid=uuid, token=token)

def create_vision_gen_req(input_image: ImgLike, model: str, token: str, num_returns: typing.Optional[int] = 3) -> VisionClassificationRequest:
    uuid = _authorize(model, token)
    input_image = _img_inp_types_to_uri(input_image)
    return VisionClassificationRequest(input_image=input_image, num_returns=num_returns, model_uuid=uuid, token=token)

def create_image_seg_req(input_image: ImgLike, model: str, token: str) -> ImageSegmentationRequest:
    uuid = _authorize(model, token)
    input_image = _img_inp_types_to_uri(input_image)
    return ImageSegmentationRequest(input_image=input_image, model_uuid=uuid, token=token)

def _authorize(model: str, token: str) -> str:
    id = _query_for_model_uuid(model, token)
    if id is None:
        raise UnauthorizedException("User with token %s is not authorized for model %s" % (token, model))
    return id