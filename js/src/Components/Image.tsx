import { Alert, Button, Card, Col, Icon, Input, Row, Upload } from "antd";
import { ModelzooServicePromiseClient } from "js/generated/modelzoo/protos/services_grpc_web_pb";
import { ImageDownloadRequest } from "js/generated/modelzoo/protos/services_pb";
import React, { FC, useState } from "react";
import { DefaultImages } from "../Config";

interface ImageInputProps {
  setImageString: (image: string) => void;
  client: ModelzooServicePromiseClient;
}

function b64Encode(img: File, callback: Function) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}

const defaultImageStyles = { height: "80px" };

export const ImageInput: FC<ImageInputProps> = props => {
  let { setImageString, client } = props;
  const [imageURL, setImageURL] = useState("");
  const [alertComp, setAlertComp] = useState<JSX.Element>();

  const uploadProps = {
    beforeUpload: (file: File) => {
      b64Encode(file, setImageString);
      return false;
    },
    showUploadList: false
  };

  const downloadImage = () => {
    downloadImageWithURL(imageURL);
  };

  const downloadImageWithURL = (url: string) => {
    // Image is dataurl
    if (url.startsWith("data:image")) {
      setImageString(url);
    } else {
      let req = new ImageDownloadRequest();
      req.setUrl(url);

      client
        .getImage(req, undefined)
        .then(resp => setImageString(resp.getImage()))
        .catch(err => {
          setAlertComp(
            <Alert
              message="Can't fetch image. Maybe try download the image and drag it to upload area?"
              closable={true}
              type="error"
            />
          );
          console.error(err);
        });
    }
  };

  const defaultImagesButtons = DefaultImages.map(url => (
    <Button
      onClick={() => {
        downloadImageWithURL(url);
      }}
      style={defaultImageStyles}
      key={url}
    >
      <img {...defaultImageStyles} src={url} alt="Default" />
    </Button>
  ));

  return (
    <div>
      <Row gutter={16} style={{ marginTop: "5px" }}>
        <Col span={24}>
          <Card title="Upload Image or Enter URL">
            <Card.Grid style={{ width: "50%" }}>
              <Upload.Dragger {...uploadProps}>
                <p className="ant-upload-drag-icon">
                  <Icon type="inbox" />
                </p>
                <p className="ant-upload-text">
                  Click or drag file to this area to upload
                </p>
              </Upload.Dragger>
            </Card.Grid>

            <Card.Grid style={{ width: "50%" }}>
              <Input
                placeholder="https://"
                style={{ marginBottom: 32 }}
                onChange={val => setImageURL(val.target.value)}
                onPressEnter={() => {
                  downloadImage();
                }}
                allowClear={true}
              />

              {defaultImagesButtons}

              <Button
                onClick={() => {
                  downloadImage();
                }}
              >
                Add Image
              </Button>
            </Card.Grid>
          </Card>

          {alertComp}
        </Col>
      </Row>
    </div>
  );
};

interface ImageOutputProps {
  image_uri: string;
}

export const ImageOutput: FC<ImageOutputProps> = props => {
  let { image_uri } = props;

  return (
    <Card>
      <img style={{ width: "60%" }} src={image_uri} alt="Prediction Result" />
    </Card>
  );
};
