import React, { FC, useState, useContext } from "react";
import { Card, Row, Col, Upload, Icon, Button, Input, Alert } from "antd";
import { DefaultImages } from "./Constants";
import { b64Encode } from "./Utils";
import { ImageDownloadRequest } from "protos/services_pb";
import { SingleImage } from "./CVClassifier";
import { ClientContext } from "../App";

interface IDImgTuple {
  id: number;
  comp: JSX.Element;
}

interface InferecePageProp {
  modelNameSelected: string;
}

export const CVInferencePage: FC<InferecePageProp> = props => {
  const [addedImages, setAddedImages] = useState<IDImgTuple[]>([]);
  const [imageIDCoutner, setImageIDCounter] = useState(0);
  const [imageURL, setImageURL] = useState("");
  const [alertComp, setAlertComp] = useState<JSX.Element>();
  const client = useContext(ClientContext);

  const removeImageComp = (val: number) => {
    setAddedImages(addedImages => addedImages.filter(v => v.id !== val));
  };
  function createImageRow(result: string) {
    let component = (
      <Row style={{ padding: "2px" }} key={imageIDCoutner}>
        <SingleImage
          key={imageIDCoutner}
          img={result}
          imgID={imageIDCoutner}
          removeFunc={removeImageComp}
          modelName={props.modelNameSelected}
        />
      </Row>
    );
    setImageIDCounter(imageIDCoutner => imageIDCoutner + 1);
    setAddedImages(addedImages => [
      { id: imageIDCoutner, comp: component },
      ...addedImages
    ]);
  }
  const uploadProps = {
    beforeUpload: (file: File) => {
      b64Encode(file, createImageRow);
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
      createImageRow(url);
    } else {
      let req = new ImageDownloadRequest();
      req.setUrl(url);
      client.getImage(req, undefined, (err, resp) => {
        if (err) {
          setAlertComp(
            <Alert message="Can't fetch image. Maybe try download the image and drag it to upload area?" closable={true} type="error" />
          );
        } else {
          createImageRow(resp.getImage());
        }
      });
    }
  };
  const defaultImageStyles = { height: "80px" };
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

      {addedImages.map(v => v.comp)}
    </div>
  );
};
