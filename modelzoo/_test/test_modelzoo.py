from modelzoo.utils import *
from modelzoo.admin import *
from modelzoo.exceptions import *
import pytest
from PIL import Image
import numpy as np
import os

# Test Utils
def test_image_conversion():
    im_arr = np.random.rand(100,100,3) * 255
    im = Image.fromarray(im_arr.astype('uint8')).convert('RGB')
    im.save("a.jpg")
    uri1 = image_input_types_to_uri(im)
    uri2 = image_input_types_to_uri("a.jpg")
    uri3 = image_input_types_to_uri(uri1)
    assert _validate_data_uri(uri1) and _validate_data_uri(uri2) and _validate_data_uri(uri3)
    assert uri1 == uri2 == uri3
