import React, { FC, useState } from "react";
import Button from "antd/lib/button";
import { Card, Row, Col, Upload, Icon } from "antd";
import TweenOne from "rc-tween-one";

import "./App.css";

import {
  VisionClassificationRequest,
  VisionClassificationResponse
} from "protos/services_pb";
import { ModelClient } from "protos/services_grpc_web_pb";

interface BasicProp {
  msg: string;
}

function b64Encode(img: File, callback: Function) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}

const client = new ModelClient("http://0.0.0.0:8080", null, null);

const App: FC<BasicProp> = (props: BasicProp) => {
  const [img, setImage] = useState<string>("");
  const [animatePaused, setAnimatePaused] = useState(true);
  const [predResult, setPredResult] = useState<string>("");
  const [uploadButtomShown, setUploadButtomShown] = useState(true);
  const [predictButtonShown, setPredictButtonShown] = useState(false);
  const [imgCardShown, setImgCardShown] = useState(false);
  const [resultCardShown, setResultCardShown] = useState(false);

  const uploadProps = {
    beforeUpload: (file: File) => {
      b64Encode(file, (result: string) => {
        setImage(result);
        setImgCardShown(true);
        setPredictButtonShown(true);
      });
      return false;
    },
    showUploadList: false
  };

  function performPrediction() {
    var request = new VisionClassificationRequest();
    request.setInputImage("..............");
    request.setNumReturns(3);

    client.visionClassification(request, {}, (err, response) => {
      if (err == null) {
        setResultCardShown(true);
        setPredResult(JSON.stringify(response.toObject()))
      } else {
        console.error(err);
      }
    });

  }

  return (
    <div className="App">
      <Row gutter={16}>
        <Col span={8}>
          {uploadButtomShown && (
            <Upload {...uploadProps}>
              <Button>
                <Icon type="upload" /> Click to Upload
              </Button>
            </Upload>
          )}
        </Col>
      </Row>

      <Row>
        {imgCardShown && (
          <TweenOne
            animation={[
              { right: 100 },
              {
                y: 100,
                onComplete: () => {
                  setPredictButtonShown(false);
                  setUploadButtomShown(false);
                }
              }
            ]}
            paused={animatePaused}
            style={{ position: "absolute" }}
          >
            <Card style={{ width: 300 }} cover={<img src={img} alt="" />}>
              {predictButtonShown && (
                <Button
                  onClick={() => {
                    setAnimatePaused(false);
                    performPrediction();
                  }}
                >
                  <Icon type="right" /> Predict
                </Button>
              )}
            </Card>
          </TweenOne>
        )}
      </Row>

      <Row>
        {resultCardShown && (
          <Col span={8}>
            <Card>{ predResult} </Card>
          </Col>
        )}
      </Row>
    </div>
  );
};

export default App;
