import typing
import base64
import io
from w3lib.url import parse_data_uri
import mimetypes
from PIL import Image
from pathlib import Path

def img_to_uri(filepath: str) -> str:
    """
        Reads an JPEG image from a file and converts it to a data URI.
    """
    img = Image.open(filepath)
    buffered = io.BytesIO()
    img.save(buffered, format="JPEG")
    img_str = base64.b64encode(buffered.getvalue()).decode()
    return u'data:%s;base64,%s' % (mimetypes.types_map['.jpg'], img_str)

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

