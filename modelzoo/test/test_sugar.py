import pytest
from PIL import Image
import pandas as pd
import model_io.protos.services_pb2 as pb
from model_io.sugar import image_input, image_output, register_type, text_input, text_output, table_output, table_input
from google.protobuf import json_format

def test_input_output_wrapping():
    @register_type(image_input, image_output)
    def my_func(inp, metadata):
        return inp

    image = Image.new("RGB", (1, 1))
    request = image_output(image)
    response = my_func(request, {})
    assert request == response

def test_metadata_mutation():
    @register_type(text_input, text_output)
    def my_func(inp, metadata):
        metadata["new_field"] = 2
        return inp

    metadata = {"old_field": 1}
    inp = pb.Text(texts=["a"])
    out = my_func(inp, metadata)
    assert out.texts == ["a"]
    assert metadata == {"old_field": 1, "new_field": 2}

def test_metadata_from_proto():
    text = pb.Text(texts=["a"])
    text.metadata["f1"] = "1"
    text.metadata["f2"] = "2"

    metadata_dict = json_format.MessageToDict(text)["metadata"]
    assert metadata_dict == {"f1": "1", "f2": "2"}

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
    new_df = table_input(table_pb)
    assert list(df.columns) == list(new_df.columns)
    for i in range(len(df)):
        assert pd.DataFrame.equals(df.iloc[i, :], new_df.iloc[i, :])