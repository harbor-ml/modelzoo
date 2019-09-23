import typing
import base64
import io
import os
from w3lib.url import parse_data_uri
import mimetypes
from PIL import Image
from pathlib import Path
from _protos.services_pb2 import (
    TextGenerationRequest,
    ImageSegmentationRequest,
    VisionClassificationRequest,
    ModelUUIDRequest,
    ModelUUIDResponse,
)


class UnauthorizedException(Exception):
    pass


ImgLike = typing.NewType("ImgLike", typing.Union[type(Image), str])


def img_file_to_uri(filepath: str) -> str:
    """
        Reads an JPEG image from a file and converts it to a data URI.
    """
    if not os.path.isfile(filepath):
        raise FileNotFoundError()
    img = Image.open(filepath)
    return img_to_uri(img)


def img_to_uri(img: Image) -> str:
    """
        Converts a JPEG Image (In the form of a PIL.Image) to a data URI.
    """
    buffered = io.BytesIO()
    img.save(buffered, format="JPEG")
    img_str = base64.b64encode(buffered.getvalue()).decode()
    return u"data:%s;base64,%s" % (mimetypes.types_map[".jpg"], img_str)


def uri_to_img(data_uri: str) -> Image:
    """
        Converts a data URI to a PIL.Image.
    """
    return Image.open(io.BytesIO(parse_data_uri(data_uri).data)).convert("RGB")


def uri_to_img_file(data_uri: str, filepath: typing.Union[str, Path]) -> None:
    """
        Saves a data URI as a JPEG image to filepath, which can either be a pathlib.Path or a string.
    """
    uri_to_img(data_uri).save(filepath)


def _validate_data_uri(data_uri: str) -> bool:
    try:
        uri_to_img(data_uri)
        return True
    except Exception:
        return False


def _img_inp_types_to_uri(input_image: ImgLike) -> str:
    if isinstance(input_image, Image):
        return img_to_uri(input_image)
    elif os.path.isfile(input_image):
        return img_file_to_uri(input_image)
    elif not _validate_data_uri(input_image):
        raise ValueError(
            "Input Image must be of type PIL.Image, data uri (str), or file path"
        )
    return input_image
