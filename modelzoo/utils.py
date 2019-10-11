import base64
import io
import mimetypes
import os
import typing
from pathlib import Path

from PIL import Image
from w3lib.url import parse_data_uri

ImgLike = typing.NewType("ImgLike", typing.Union[type(Image), str])


def img_file_to_uri(filepath: str) -> str:
    """
        Reads an image from a file and converts it to a data URI.
    """
    if not os.path.isfile(filepath):
        raise FileNotFoundError()
    img = Image.open(filepath)
    _, file_extension = os.path.splitext(filepath)
    file_extension = file_extension[1:]
    if file_extension == "jpg":
        file_extension = "jpeg"
    return img_to_uri(img, format=file_extension)


def img_to_uri(img: Image, format: typing.Optional[str] = "JPEG") -> str:
    """
        Converts an Image (In the form of a PIL.Image) to a data URI.
    """
    buffered = io.BytesIO()
    img.save(buffered, format=format)
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


def validate_data_uri(data_uri: str) -> bool:
    """
        Internal method to validate that a given URI is valid (i.e. can be translated to a PIL.Image).
    """
    try:
        uri_to_img(data_uri)
        return True
    except Exception:
        return False


def image_input_types_to_uri(input_image: ImgLike) -> str:
    """
        Helper method to convert from oneof(image filename, PIL.Image, image URI) to image URI.

        Parameters
        ----------
        input_image -> ImgLike: corresponds to oneof(image filename, PIL.Image, image URI).

        Raises
        ------
        ValueError: 
            If an invalid data URI is passed, a ValueError is raised.

        Returns
        -------
        A data URI corresponding to the image or ImgLike passed in.
    """
    if isinstance(input_image, Image.Image):
        return img_to_uri(input_image)
    elif os.path.isfile(input_image):
        return img_file_to_uri(input_image)
    elif not validate_data_uri(input_image):
        raise ValueError(
            "Input Image must be of type PIL.Image, data uri (str), or file path"
        )
    return input_image
