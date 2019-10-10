import math
import operator
import os
from functools import reduce
from uuid import UUID

import numpy as np
import pytest
from PIL import Image

from modelzoo.admin import *
from modelzoo.exceptions import *
from modelzoo.protos.services_pb2 import (Image, Payload, PayloadType, Table,
                                          Text)
from modelzoo.utils import *


# Utils for testing
def compare_image(im1, im2):
    h1 = im1.histogram()
    h2 = im2.histogram()

    rms = math.sqrt(
        reduce(operator.add, map(lambda a, b: (a - b) ** 2, h1, h2)) / len(h1)
    )
    return rms


def validate_uuid(uuid):
    try:
        uuid_obj = UUID(uuid, version=4)
    except ValueError:
        return False

    return str(uuid_obj) == uuid


# Test ModelZoo Utils
def test_image_utils():
    im_arr = np.random.rand(100, 100, 3) * 255
    im = Image.fromarray(im_arr.astype("uint8")).convert("RGB")
    im.save("a.jpg")
    uri1 = image_input_types_to_uri(im)
    uri2 = image_input_types_to_uri("a.jpg")
    uri3 = image_input_types_to_uri(uri1)
    assert (
        validate_data_uri(uri1) and validate_data_uri(uri2) and validate_data_uri(uri3)
    )
    assert uri1 == uri3
    im1 = uri_to_img(uri1)
    im2 = uri_to_img(uri2)
    assert (
        compare_image(im1, im2) < 30
    )  # Magic Numbers. Found by testing the result, and finding margins.
    # Difference since saving with PIL causes slight image quality reduction.
    assert compare_image(im1, im) < 24  # Same as above.
    uri_to_img_file(uri3, "b.jpg")
    im3 = Image.open("b.jpg")
    assert (
        compare_image(im3, im2) == 0
    )  # Should be the same image. Saving image via PIL causes slight quality reduction.
    os.remove("a.jpg")
    os.remove("b.jpg")


# Test ModelZoo Connection
def test_modelzoo_connection():
    conn = ModelZooConnection(address="localhost:9000")
    with pytest.raises(ModelZooConnectionException):
        conn.authenticate("placeholder", "placeholder")
    conn.connect()
    with pytest.raises(AuthenticationException):
        conn.get_token()
    with pytest.raises(InvalidCredentialsException):
        conn.authenticate("placeholder", "placeholder")

    conn.create_user("dummy@dummy.com", "password123")
    conn.authenticate("dummy@dummy.com", "password123")
    assert isinstance(conn.get_token(), str)
    assert validate_uuid(conn.get_token())
    conn.list_all_models()

    text_input = ["This is a test"]
    p = conn.text_inference("text_generation_mock", text_input)
    assert isinstance(p, Payload)
    assert p.type == PayloadType.TEXT
    assert p.text.texts == [text_input[0][::-1]]

    text_process = lambda a: [a[0][::-1]]

    assert conn.process_inference_response(p, text_process) == text_input

    im_arr = np.random.rand(100, 100, 3) * 255
    im = Image.fromarray(im_arr.astype("uint8")).convert("RGB")
    p = conn.image_inference("image_segmentation_mock", im)
    assert isinstance(p, Payload)
    assert p.type == PayloadType.IMAGE
    im2 = uri_to_img(p.image.image_data_url)
    assert compare_image(im.rotate(45), im2) < 50

    def image_process(image):
        image = image.transpose(Image.FLIP_LEFT_RIGHT)
        return image

    im2 = conn.process_inference_response(p, image_process)
    assert compare_image(im2, im.rotate(45).transpose(Image.FLIP_LEFT_RIGHT)) < 50
