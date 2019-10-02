import base64
import io
import mimetypes
from functools import wraps
from typing import List

from PIL import Image
from w3lib.url import parse_data_uri

import pandas as pd
import model_io.protos.services_pb2 as pb


# TODO(simon): metadata should be a single mutable state that's returned.
# Something like https://github.com/taoufik07/responder

class register_type:
    def __init__(self, inp_type_cls, out_type_cls, metadata_name=None):
        self._in_transformer = inp_type_cls
        self._out_transformer = out_type_cls
        self.metadata_name = metadata_name

    def __call__(self, func):
        @wraps(func)
        def wrapped(inp, metadata=None):
            args = (self._in_transformer(inp),)
            kwargs = {}
            if self.metadata_name:
                kwargs[self.metadata_name] = metadata
            out = func(*args, **kwargs)

            if not isinstance(out, tuple) or len(out) == 1:
                return self._out_transformer(out)
            else:
                out, metadata = out
                return self._out_transformer(out), metadata

        return wrapped


def image_input(image_request: pb.Image) -> Image:
    img_bytes = parse_data_uri(image_request.image_data_url).data
    img = Image.open(io.BytesIO(img_bytes)).convert("RGB")
    return img


def image_output(image: Image) -> pb.Image:
    buffered = io.BytesIO()
    image.save(buffered, format="JPEG")
    img_str = base64.b64encode(buffered.getvalue()).decode()
    data_url = u"data:%s;base64,%s" % (mimetypes.types_map[".jpg"], img_str)
    return pb.Image(image_data_url=data_url)


def text_input(text_request: pb.Text) -> List[str]:
    return [item for item in text_request.texts]


def text_output(texts: List[str]) -> pb.Text:
    return pb.Text(texts=texts)


def table_output(dataframe: pd.DataFrame) -> pb.Table:
    dataframe.index = list(map(str, dataframe.index))
    dataframe.columns = list(map(str, dataframe.columns))

    dict_representation = dataframe.to_dict(orient="index")

    table = pb.Table()
    table.column_names[:] = list(dataframe.columns)
    for row_name, column_value_map in dict_representation.items():
        row = table.table[row_name]
        for column, value in column_value_map.items():
            row.column_to_value[column] = value
        
    return table
