# ModelZoo
Python package to query [ModelZoo.Live](https://modelzoo.live)

## API
For more specific API details, please check out the docs within the files.

## Examples
### Initialization
```python
# Connects to a ModelZoo instance running at http://modelzoo.url/
conn = ModelZooConnection(address="http://modelzoo.url/")
# Authenticate to service. Neccessary to see your token.
conn.authenticate("myemail@me.com", "mypassword")
```
### Get Models
```python
# Assuming conn initialized previously
conn.list_all_models()
```
### Get Token
```python
# Assuming conn initialized previously, and authenticated to server
conn.get_token()
```
### Create User
```python
# Assuming conn initialized previously
conn.create_user("mynewemail@me.com", "mynewpassword")
```
### Text Inference
```python
# Assuming conn initialized previously
model_name = "MyModelName"
input = ["Input1", "Input2"]

p = conn.text_inference(model_name, input)
# type(p) = modelzoo.protos.Payload
```
If your model's output is text, you could expect an output formatted like so:
```python
p = Payload({type: PayloadType.TEXT, text = t})
t = Text({metadata: {...}, texts: ["output1", ...], model_name: "name", access_token: "token"})
```
### Image Inference
```python
# Assuming img is your image input.
# img can be oneof(filename, PIL.Image, image data uri)
model_name = "MyModelName"

p = conn.image_inference(model_name, img)
# type(p) = modelzoo.protos.Payload
```
If your model's output is an image, you could expect an output formatted like so:
```python
p = Payload({type: PayloadType.IMAGE, image = t})
t = Image({metadata: {...}, image_data_url: "img_output_uri", model_name: "name", access_token: "token"})
```
#### It is important to note that your model is not constrained to return an output of the same type as its input. 
It is perfectly valid, for example, for a model to take a text input, and return an image output, or vice versa.
### Extracting Output for Inference
```python
...
# p is the Payload object returned by
# oneof(text_inference, image_inference)
if p.type == PayloadType.TEXT:
    out = sugar.text_input(p.text)
elif p.type == PayloadType.IMAGE:
    out = sugar.image_input(p.image)
# out = oneof(List[string], PIL.Image)
```
### Post Processing for Inference
```python
...
# p is the Payload object returned by
# oneof(text_inference, image_inference)
def callback(input):
    # Input is oneof(pd.DataFrame, List[string], PIL.Image)
    return output

o = conn.process_inference_response(p, callback)

# o == callback(extract(payload))
```