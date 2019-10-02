import pytest
from PIL import Image
import pandas as pd
import model_io.protos.services_pb2 as pb
from model_io.sugar import image_input, image_output, register_type, text_input, text_output, table_output
from google.protobuf import json_format

def test_input_output_wrapping():
    @register_type(image_input, image_output)
    def my_func(inp):
        return inp

    image = Image.new("RGB", (1, 1))
    request = image_output(image)
    response = my_func(request)
    assert request == response

def test_text():
    data = ['a','b']
    text_request = pb.Text(texts=data)
    text = text_input(text_request)
    assert isinstance(text, list)
    assert text == data

def test_table():
    df = pd.DataFrame({
        'rank': [1,2,3],
        'category': ['a', 'b', 'c'],
        'proba': [0.1, 0.2, 0.3]
    }).astype(str)
    
    table_pb = table_output(df)
    result_dict = json_format.MessageToDict(table_pb)
    table_dict = df.to_dict(orient="index")
    for row, col_values in result_dict['table'].items():
        assert table_dict[row] == col_values["columnToValue"]
    assert result_dict["columnNames"] == list(df.columns)