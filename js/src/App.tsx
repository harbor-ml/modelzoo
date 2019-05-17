import React, { FC, useReducer, useState, useMemo, CSSProperties } from "react";
import {
  Card,
  Row,
  Col,
  Upload,
  Icon,
  Table,
  Button,
  InputNumber,
  Divider,
  Tag,
  Layout,
  Input,
  Radio,
  Menu,
  Typography
} from "antd";

import { Error as grpcError } from "grpc-web";

import "./App.css";

import {
  VisionClassificationRequest,
  VisionClassificationResponse,
  ImageDownloadRequest,
  VisionClassificationGetModelsReq
} from "protos/services_pb";
import { ModelClient } from "protos/services_grpc_web_pb";

const { Title } = Typography;

function round(f: number, digit: number): number {
  return Number(f.toFixed(digit));
}

function b64Encode(img: File, callback: Function) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}

const client = new ModelClient("http://0.0.0.0:8080", null, null);

interface ImageState {
  img: string;
  predResult: VisionClassificationResponse.Result[];
  predButtomShown: boolean;
  resultCardShown: boolean;
  numReturns: number;
  startInferneceTime?: DOMHighResTimeStamp;
  inferDuration?: number;
  props: SingleImageProp;
}

enum ImageAction {
  Predict,
  ShowResult,
  SetNumReturns,
  Close
}

interface ActionPayload {
  type: ImageAction;
  newImage?: string;
  newResult?: VisionClassificationResponse.Result[] | null;
  callback?(err: grpcError, response: VisionClassificationResponse): void;
  newNumReturns?: number;
}

function initImageState(props: SingleImageProp): ImageState {
  return {
    img: props.img,
    predResult: [],
    predButtomShown: true,
    resultCardShown: false,
    numReturns: 3,
    props: props
  };
}

function singleImageReducer(
  state: ImageState,
  action: ActionPayload
): ImageState {
  if (action.type === ImageAction.Predict) {
    let request = new VisionClassificationRequest();
    request.setInputImage(state.img);
    request.setNumReturns(state.numReturns);
    request.setModelName(state.props.modelName);

    let startTS = performance.now();

    client.visionClassification(request, {}, action.callback!);

    return {
      ...state,
      startInferneceTime: startTS
    };
  } else if (action.type === ImageAction.ShowResult) {
    return {
      ...state,
      resultCardShown: true,
      predButtomShown: false,
      predResult: action.newResult!,
      inferDuration: performance.now() - state.startInferneceTime!
    };
  } else if (action.type === ImageAction.SetNumReturns) {
    return {
      ...state,
      numReturns: action.newNumReturns!
    };
  } else if (action.type === ImageAction.Close) {
    console.log(state.props.imgID);
    state.props.removeFunc(state.props.imgID);
  }
  return { ...state };
}

interface SingleImageProp {
  img: string;
  imgID: number;
  removeFunc: Function;
  modelName: string;
}

const SingleImage: FC<SingleImageProp> = props => {
  const [state, dispatch] = useReducer(
    singleImageReducer,
    props,
    initImageState
  );

  const gridStyle: CSSProperties = {
    textAlign: "center" as "center",
    verticalAlign: "middle" as "middle",
    height: "100%",
    alignItems: "center" as "center"
  };

  const getCardExtra = () => {
    return (
      <div>
        <Tag>Topk: {state.numReturns}</Tag>
        <Tag>
          {"End-to-End Inference Time (s): " +
            round(state.inferDuration! / 1000, 2)}
        </Tag>

        <Button onClick={() => dispatch({ type: ImageAction.Close })}>
          <Icon type="close" />
        </Button>
      </div>
    );
  };

  return (
    <Row gutter={32} type="flex" justify="space-between" align="middle">
      <Card
        type="inner"
        title={state.props.modelName}
        extra={state.inferDuration ? getCardExtra() : ""}
      >
        <Card.Grid
          style={{ ...gridStyle, width: state.predButtomShown ? "30%" : "40%" }}
        >
          <img
            src={state.img}
            height="auto"
            width="80%"
            alt=""
            vertical-align="middle"
          />
        </Card.Grid>

        {state.predButtomShown && (
          <Card.Grid style={{ ...gridStyle, width: "70%" }}>
            <Tag>Topk Classes</Tag>
            <InputNumber
              min={1}
              max={10}
              defaultValue={3}
              onChange={val =>
                dispatch({
                  type: ImageAction.SetNumReturns,
                  newNumReturns: val
                })
              }
            />

            <Divider />

            <Button
              onClick={() => {
                dispatch({
                  type: ImageAction.Predict,
                  callback: (err, response) => {
                    if (err == null) {
                      dispatch({
                        type: ImageAction.ShowResult,
                        newResult: response.getResultsList()
                      });
                    } else {
                      console.log(err)
                      dispatch({
                        type: ImageAction.ShowResult,
                        newResult: null
                      });
                    }
                    
                  }
                });
              }}
            >
              <Icon type="right" /> Predict
            </Button>
          </Card.Grid>
        )}

        {state.resultCardShown && (
          <Card.Grid style={{ ...gridStyle, width: "60%" }}>
            {state.predResult != null ? (
              <Table
                dataSource={state.predResult
                  .slice(0, state.numReturns)
                  .map(e => e.toObject())}
                rowKey={"rank"}
                pagination={{ pageSize: 3 }}
                columns={[
                  {
                    dataIndex: "category",
                    title: "Category"
                  },
                  {
                    dataIndex: "proba",
                    title: "Normalized Probability",
                    render: f => round(f, 4)
                  }
                ]}
              />
            ) : (
              <div>
                <Icon type="warning" />

                <p>Query Failed</p>
              </div>
            )}
          </Card.Grid>
        )}
      </Card>
    </Row>
  );
};
interface IDImgTuple {
  id: number;
  comp: JSX.Element;
}
interface InferecePageProp {
  modelName: string;
}

const InferencePage: FC<InferecePageProp> = props => {
  const [addedImages, setAddedImages] = useState<IDImgTuple[]>([]);
  const [imageIDCoutner, setImageIDCounter] = useState(0);
  const [imageURL, setImageURL] = useState("");

  const removeImageComp = (val: number) => {
    console.log(addedImages);
    console.log(val);
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
          modelName={props.modelName}
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
    let req = new ImageDownloadRequest();
    req.setUrl(imageURL);
    client.getImage(req, undefined, (err, resp) => {
      createImageRow(resp.getImage());
    });
  };

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

            <Card.Grid
              style={{ width: "50%", textAlign: "center" as "center" }}
            >
              <Input
                placeholder="https://"
                style={{ marginBottom: 32 }}
                onChange={val => setImageURL(val.target.value)}
                onPressEnter={() => {
                  downloadImage();
                }}
                allowClear={true}
              />

              <Button
                onClick={() => {
                  downloadImage();
                }}
              >
                Add Image
              </Button>
            </Card.Grid>
          </Card>
        </Col>
      </Row>

      {addedImages.map(v => v.comp)}
    </div>
  );
};

const Models: FC = () => {
  const [modelList, setModelList] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>("");

  useMemo(() => {
    let req = new VisionClassificationGetModelsReq();
    client.listModels(req, undefined, (err, resp) => {
      setModelList(resp.getModelsList());
    });
  }, []);

  return (
    <div>
      <Card key="chooseYourModel">
        <Row>Please choose your the models you want to intereact with:</Row>

        <Row>
          <Radio.Group
            buttonStyle="solid"
            onChange={v => setSelectedModel(v.target.value)}
          >
            {modelList.map(m => (
              <Radio.Button value={m} key={m}>
                {" "}
                {m}{" "}
              </Radio.Button>
            ))}
          </Radio.Group>
        </Row>
      </Card>

      {selectedModel !== "" && <InferencePage modelName={selectedModel} />}
    </div>
  );
};

const App: FC = () => {
  return (
    <Layout>
      <Layout.Header>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={["1"]}
          style={{ lineHeight: "64px" }}
        >
          <Menu.Item key="1" disabled>
            <Title level={4} style={{ color: "#ffffff" }}>
              MovelZoo.Live
            </Title>
          </Menu.Item>
        </Menu>
      </Layout.Header>
      <Layout.Content style={{ padding: "20px 50px" }}>
        <Models />
      </Layout.Content>
      <Layout.Footer style={{ textAlign: "center" }}>
        Created by RISELab
      </Layout.Footer>
    </Layout>
  );
};

export default App;
