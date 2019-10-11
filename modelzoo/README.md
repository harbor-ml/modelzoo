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
# p = Payload({type: PayloadType.TEXT, text = t})
# t = Text({metadata: {...}, texts: ["output1", ...], model_name: "name", access_token: "token"})
```