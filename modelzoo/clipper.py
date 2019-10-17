import base64
import io
import json
import mimetypes
import numpy as np

import pandas as pd
import numpy as np
from flask import Flask, jsonify, request, g
from flask_cors import CORS
from PIL import Image
from typing import List
from google.protobuf import json_format
import requests
from transformers import GPT2LMHeadModel, GPT2Tokenizer
from transformers import XLNetLMHeadModel, XLNetTokenizer

import modelzoo.protos.services_pb2 as pb
from modelzoo.sugar import (
    image_input,
    image_output,
    register_type,
    table_output,
    text_input,
    text_output,
)

app = Flask(__name__)
CORS(app)
# import torch
# model18 = torch.hub.load('pytorch/vision', 'resnet18', pretrained=True)
# model50 = torch.hub.load('pytorch/vision', 'resnet50', pretrained=True)
# model152 = torch.hub.load('pytorch/vision', 'resnet152', pretrained=True)
import torchvision
model18 = torchvision.models.resnet18(pretrained=True)
model50 = torchvision.models.resnet50(pretrained=True)
model152 = torchvision.models.resnet152(pretrained=True)
model18.eval()
model50.eval()
model152.eval()
preprocess = torchvision.transforms.Compose([
    torchvision.transforms.Resize(256),
    torchvision.transforms.CenterCrop(224),
    torchvision.transforms.ToTensor(),
    torchvision.transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])
print("models imported")
model_mask = torchvision.models.detection.maskrcnn_resnet50_fpn(pretrained=True)
print("have mask")
model_fast = torchvision.models.detection.fasterrcnn_resnet50_fpn(pretrained=True)
print("have fast")
model_keypoint = torchvision.models.detection.keypointrcnn_resnet50_fpn(pretrained=True)
print("have keypoint")
model_mask.eval()
model_fast.eval()
model_keypoint.eval()
model_mask.cuda()
model_fast.cuda()
model_keypoint.cuda()
print("Evaled all")
print("GPT2 Time")
tokenizerG = GPT2Tokenizer.from_pretrained('gpt2')
modelG = GPT2LMHeadModel.from_pretrained('gpt2')
modelG.to('cuda')
print("Done")
print("XLNet Time")
tokenizerX = XLNetTokenizer.from_pretrained('xlnet-base-cased')
modelX = XLNetLMHeadModel.from_pretrained('xlnet-base-cased')
print("BigGan Time!")
from pytorch_pretrained_biggan import (BigGAN, one_hot_from_names, truncated_noise_sample,
                                       convert_to_images)
modelBG = BigGAN.from_pretrained('biggan-deep-256')

modelX.to('cuda')
print("All prep complete!")
labels = {int(key):value for (key, value) in requests.get('https://s3.amazonaws.com/outcome-blog/imagenet/labels.json').json().items()}
detect_labels = {int(key):value for (key, value) in requests.get('https://gist.githubusercontent.com/RehanSD/6f74a9992848e25658e091148ee20e17/raw/fae1f9f3ee0c3eb20ca9829e99cd8b616f22fa45/cocolabels.json').json().items()}
PADDING_TEXT = """ In 1991, the remains of Russian Tsar Nicholas II and his family
(except for Alexei and Maria) are discovered.
The voice of Nicholas's young son, Tsarevich Alexei Nikolaevich, narrates the
remainder of the story. 1883 Western Siberia,
a young Grigori Rasputin is asked by his father and a group of men to perform magic.
Rasputin has a vision and denounces one of the men as a horse thief. Although his
father initially slaps him for making such an accusation, Rasputin watches as the
man is chased outside and beaten. Twenty years later, Rasputin sees a vision of
the Virgin Mary, prompting him to become a priest. Rasputin quickly becomes famous,
with people, even a bishop, begging for his blessing. <eod> </s> <eos>"""

@register_type(image_input, table_output)
def image_r50(inp: Image, metadata):
    import torch
    input_tensor = preprocess(inp)
    input_batch = input_tensor.unsqueeze(0)
    with torch.no_grad():
        output = model50(input_batch)
    proba = torch.nn.functional.softmax(output[0], dim=0).numpy()
    top3 = np.argsort(proba)[-3:][::-1]
    l = [labels[i] for i in top3]
    probs = [proba[i] for i in top3]
    df = pd.DataFrame(
        {
            "rank": [1, 2, 3],
            "probability": probs,
            "category": l
        }
    ).astype(str)
    return df

@register_type(image_input, table_output)
def image_r18(inp: Image, metadata):
    import torch
    input_tensor = preprocess(inp)
    input_batch = input_tensor.unsqueeze(0)
    with torch.no_grad():
        output = model18(input_batch)
    proba = torch.nn.functional.softmax(output[0], dim=0).numpy()
    top3 = np.argsort(proba)[-3:][::-1]
    l = [labels[i] for i in top3]
    probs = [proba[i] for i in top3]
    df = pd.DataFrame(
        {
            "rank": [1, 2, 3],
            "probability": probs,
            "category": l
        }
    ).astype(str)
    return df

@register_type(image_input, table_output)
def ensemble(inp: Image, metadata):
    from PIL import Image
    from modelzoo.admin import ModelZooConnection
    from modelzoo.sugar import table_input
    import numpy as np
    import pandas as pd
    conn = ModelZooConnection(address="52.40.213.134:9000")
    models = ['ImageNet Classification ResNet18', 'ImageNet Classification ResNet50',
              'ImageNet Classification ResNet152']
    tables = []
    for m in models:
        payload = conn.image_inference(m, inp)
        tables.append(sugar.table_input(payload.table))
    new_df = pd.concat(tables,sort=True).reset_index().drop('index', axis=1)
    new_df.probability = new_df.probability.astype(np.float32)
    new_df.probability /= np.sum(new_df.probability.values)
    new_df = new_df.drop(columns='rank')
    return new_df
    
@register_type(image_input, table_output)
def image_r152(inp: Image, metadata):
    import torch
    input_tensor = preprocess(inp)
    input_batch = input_tensor.unsqueeze(0)
    with torch.no_grad():
        output = model152(input_batch)
    proba = torch.nn.functional.softmax(output[0], dim=0).numpy()
    top3 = np.argsort(proba)[-3:][::-1]
    l = [labels[i] for i in top3]
    probs = [proba[i] for i in top3]
    df = pd.DataFrame(
        {
            "rank": [1, 2, 3],
            "probability": probs,
            "category": l
        }
    ).astype(str)
    return df

@register_type(image_input, table_output)
def mask(inp: Image, metadata):
    image_tensor = torchvision.transforms.functional.to_tensor(inp)
    output = model_mask([image_tensor.cuda()])
    labels = output[0]['labels'].cpu().numpy()
    labels = list(set([detect_labels[l] for l in labels]))
    df = pd.DataFrame(
        {
            "rank": list(range(1, len(labels)+1)),
            "category": labels
        }
    ).astype(str)
    return df

@register_type(image_input, table_output)
def keypoint(inp: Image, metadata):
    image_tensor = torchvision.transforms.functional.to_tensor(inp)
    output = model_keypoint([image_tensor.cuda()])
    labels = output[0]['labels'].cpu().numpy()
    labels = list(set([detect_labels[l] for l in labels]))
    df = pd.DataFrame(
        {
            "rank": list(range(1, len(labels)+1)),
            "category": labels
        }
    ).astype(str)
    return df

@register_type(image_input, table_output)
def faster(inp: Image, metadata):
    image_tensor = torchvision.transforms.functional.to_tensor(inp)
    output = model_fast([image_tensor.cuda()])
    labels = output[0]['labels'].cpu().numpy()
    labels = list(set([detect_labels[l] for l in labels]))
    df = pd.DataFrame(
        {
            "rank": list(range(1, len(labels)+1)),
            "category": labels
        }
    ).astype(str)
    return df

@register_type(text_input, image_output)
def biggan(inp: List[str], metadata):
    truncation = 0.4
    try:
        class_vector = one_hot_from_names(inp, batch_size=len(inp))
        noise_vector = truncated_noise_sample(truncation=truncation, batch_size=len(inp))
        noise_vector = torch.from_numpy(noise_vector)
        class_vector = torch.from_numpy(class_vector)
        with torch.no_grad():
            output = modelBG(noise_vector, class_vector, truncation)
    except:
        inp = ['cat']
        class_vector = torch.from_numpy(one_hot_from_names(inp, batch_size=len(inp)))
        noise_vector = torch.from_numpy(truncated_noise_sample(truncation=truncation, batch_size=len(inp)))
        with torch.no_grad():
            output = modelBG(noise_vector, class_vector, truncation)

    return convert_to_images(output)[0]


@register_type(image_input, table_output)
def vision_classification(inp: Image, metadata):
    df = pd.DataFrame(
        {
            "rank": [1, 2, 3],
            "category": ["a", "b", "c"],
            "image_data": [str(inp) for _ in range(3)],
        }
    ).astype(str)

    return df

from tqdm import trange
import torch
import torch.nn.functional as F
def top_k_top_p_filtering(logits, top_k=0, top_p=0.0, filter_value=-float('Inf')):
    assert logits.dim() == 1  # batch size 1 for now - could be updated for more but the code would be less clear
    top_k = min(top_k, logits.size(-1))  # Safety check
    if top_k > 0:
        # Remove all tokens with a probability less than the last token of the top-k
        indices_to_remove = logits < torch.topk(logits, top_k)[0][..., -1, None]
        logits[indices_to_remove] = filter_value

    if top_p > 0.0:
        sorted_logits, sorted_indices = torch.sort(logits, descending=True)
        cumulative_probs = torch.cumsum(F.softmax(sorted_logits, dim=-1), dim=-1)

        # Remove tokens with cumulative probability above the threshold
        sorted_indices_to_remove = cumulative_probs > top_p
        # Shift the indices to the right to keep also the first token above the threshold
        sorted_indices_to_remove[..., 1:] = sorted_indices_to_remove[..., :-1].clone()
        sorted_indices_to_remove[..., 0] = 0

        indices_to_remove = sorted_indices[sorted_indices_to_remove]
        logits[indices_to_remove] = filter_value
    return logits
def sample_sequence(model, length, context, num_samples=1, temperature=1, top_k=0, top_p=0.0, repetition_penalty=1.0,
                    is_xlnet=False, is_xlm_mlm=False, xlm_mask_token=None, xlm_lang=None, device='cuda'):
    context = torch.tensor(context, dtype=torch.long, device=device)
    context = context.unsqueeze(0).repeat(num_samples, 1)
    generated = context
    with torch.no_grad():
        for _ in trange(length):

            inputs = {'input_ids': generated}
            if is_xlnet:
                # XLNet is a direct (predict same token, not next token) and bi-directional model by default
                # => need one additional dummy token in the input (will be masked), attention mask and target mapping (see model docstring)
                input_ids = torch.cat((generated, torch.zeros((1, 1), dtype=torch.long, device=device)), dim=1)
                perm_mask = torch.zeros((1, input_ids.shape[1], input_ids.shape[1]), dtype=torch.float, device=device)
                perm_mask[:, :, -1] = 1.0  # Previous tokens don't see last token
                target_mapping = torch.zeros((1, 1, input_ids.shape[1]), dtype=torch.float, device=device)
                target_mapping[0, 0, -1] = 1.0  # predict last token
                inputs = {'input_ids': input_ids, 'perm_mask': perm_mask, 'target_mapping': target_mapping}

            if is_xlm_mlm and xlm_mask_token:
                # XLM MLM models are direct models (predict same token, not next token)
                # => need one additional dummy token in the input (will be masked and guessed)
                input_ids = torch.cat((generated, torch.full((1, 1), xlm_mask_token, dtype=torch.long, device=device)), dim=1)
                inputs = {'input_ids': input_ids}

            if xlm_lang is not None:
                inputs["langs"] = torch.tensor([xlm_lang] * inputs["input_ids"].shape[1], device=device).view(1, -1)

            outputs = model(**inputs)  # Note: we could also use 'past' with GPT-2/Transfo-XL/XLNet/CTRL (cached hidden-states)
            next_token_logits = outputs[0][0, -1, :] / (temperature if temperature > 0 else 1.)

            # reptition penalty from CTRL (https://arxiv.org/abs/1909.05858)
            for _ in set(generated):
                next_token_logits[_] /= repetition_penalty

            filtered_logits = top_k_top_p_filtering(next_token_logits, top_k=top_k, top_p=top_p)
            if temperature == 0: #greedy sampling:
                next_token = torch.argmax(filtered_logits).unsqueeze(0)
            else:
                next_token = torch.multinomial(F.softmax(filtered_logits, dim=-1), num_samples=1)
            generated = torch.cat((generated, next_token.unsqueeze(0)), dim=1)
    return generated

@register_type(text_input, text_output)
def gpt2(inp: List[str], metadata):
    texts = []
    for i in inp:
        context_tokens = tokenizerG.encode(i)
        context_tokens.to('cuda')
        out = sample_sequence(model=modelG, context=context_tokens, length=20, temperature=0.7,top_k=0, top_p=0.9, repetition_penalty=1.0)
        out = out[0, len(context_tokens):].tolist()
        text = tokenizerG.decode(out, clean_up_tokenization_spaces=True, skip_special_tokens=True)
        texts.append(text.cpu())
    return texts

@register_type(text_input, text_output)
def xlnet(inp: List[str], metadata):
    texts = []
    for i in inp:
        context_tokens = tokenizerX.encode(PADDING_TEXT+i)
        context_tokens.to('cuda')
        out = sample_sequence(model=modelX, context=context_tokens, length=20, temperature=0.7,top_k=0, top_p=0.9, repetition_penalty=1.0, is_xlnet=True)
        out = out[0, len(context_tokens):].tolist()
        text = tokenizerX.decode(out, clean_up_tokenization_spaces=True, skip_special_tokens=True)
        texts.append(text.cpu())
    return texts

@register_type(image_input, image_output)
def image_segmentation(inp: Image, metadata):
    return inp.rotate(45)


@register_type(image_input, text_output)
def image_captioning(inp: Image, metadata):
    return ["this is a cool image lol"]



prediction_apps = dict(
    vision_classification=(vision_classification, pb.Image),
    image_segmentation=(image_segmentation, pb.Image),
    image_captioning=(image_captioning, pb.Image),
)


def generate_clipper_resp(
    default: bool, output: str, default_explanation="failed query"
):
    return {
        "default": default,
        "default_explanation": default_explanation,
        "output": output,
        "query_id": 1,
    }

@app.route("/")
def ok():
    return "OK"

@app.route("/<app_name>/predict", methods=["POST"])
def clipper(app_name):
    if app_name in ["image_r50", "image_r18", "image_r152", "keypoint", "mask", "faster"]:
        if app_name == "image_r50":
            pred_func = image_r50
        elif app_name == "image_r18":
            pred_func = image_r18
        elif app_name == "image_r152":
            pred_func = image_r152
        elif app_name == "mask":
            pred_func = mask
        elif app_name == "keypoint":
            pred_func = keypoint
        elif app_name == "faster":
            pred_func = faster
        input_cls = pb.Image
    elif app_name in ['gpt2', 'xlnet', 'biggan']:
        if app_name == 'gpt2':
            pred_func = gpt2
        elif app_name == 'biggan':
            pred_func = biggan
        else:
            pred_func = xlnet
        input_cls = pb.Text
    else:
        pred_func, input_cls = prediction_apps[app_name]
    request_proto = input_cls()
    request_proto.ParseFromString(base64.b64decode(request.json["input"]))
    
    request_proto_dict = json_format.MessageToDict(request_proto)
    metadata_dict = request_proto_dict.get("metadata", dict())
    result_proto = pred_func(request_proto, metadata_dict)

    # Populate metadata
    for k, v in metadata_dict.items():
        result_proto.metadata[k] = str(v)

    serialized = base64.b64encode(result_proto.SerializeToString()).decode()
    return jsonify(generate_clipper_resp(False, serialized))
