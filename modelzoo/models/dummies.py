
@register_type(image_input, image_output)
def image_segmentation(inp: Image, metadata):
    return inp.rotate(45)


@register_type(image_input, text_output)
def image_captioning(inp: Image, metadata):
    return ["this is a cool image lol"]
