import React, {
  FC,
  useReducer,
  CSSProperties,
  useContext,
  useMemo
} from "react";
import {
  Card,
  Row,
  Icon,
  Table,
  Button,
  InputNumber,
  Divider,
  Tag
} from "antd";
import { Error as grpcError } from "grpc-web";
import { round } from "./Utils";
import {
  VisionClassificationRequest,
  VisionClassificationResponse
} from "protos/services_pb";

import { ModelClient } from "protos/services_grpc_web_pb";

import { ClientContext } from "../App";

interface ImageState {
  img: string;
  predResult: VisionClassificationResponse.Result[] | null;
  predbuttonShown: boolean;
  resultCardShown: boolean;
  numReturns: number;
  startInferneceTime?: DOMHighResTimeStamp;
  inferDuration?: number;
  props: SingleImageProp;
  client?: ModelClient;
}

enum ImageAction {
  Predict,
  ShowResult,
  SetNumReturns,
  Close,
  SetClient
}

type newImageType = string;
type newResultType = VisionClassificationResponse.Result[] | null;
type callbackType = (
  err: grpcError,
  response: VisionClassificationResponse
) => void;
type newNumReturnsType = number;
const NoPayload: string = "No Payload";
interface ActionPayload {
  type: ImageAction;
  data:
    | newImageType
    | newResultType
    | callbackType
    | newNumReturnsType
    | typeof NoPayload
    | ModelClient;
}

function initImageState(props: SingleImageProp): ImageState {
  return {
    img: props.img,
    predResult: [],
    predbuttonShown: true,
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
    state.client!.visionClassification(
      request,
      {},
      action.data as callbackType
    );
    return {
      ...state,
      startInferneceTime: startTS
    };
  } else if (action.type === ImageAction.ShowResult) {
    return {
      ...state,
      resultCardShown: true,
      predbuttonShown: false,
      predResult: action.data as newResultType,
      inferDuration: performance.now() - state.startInferneceTime!
    };
  } else if (action.type === ImageAction.SetNumReturns) {
    return {
      ...state,
      numReturns: action.data as newNumReturnsType
    };
  } else if (action.type === ImageAction.Close) {
    state.props.removeFunc(state.props.imgID);
  } else if (action.type === ImageAction.SetClient) {
    return {
      ...state,
      client: action.data as ModelClient
    };
  }
  return { ...state };
}

interface SingleImageProp {
  img: string;
  imgID: number;
  removeFunc: Function;
  modelName: string;
}

export const SingleImage: FC<SingleImageProp> = props => {
  const [state, dispatch] = useReducer(
    singleImageReducer,
    props,
    initImageState
  );
  const client = useContext(ClientContext);
  useMemo(() => dispatch({ type: ImageAction.SetClient, data: client }), [
    client
  ]);

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

        <Button
          onClick={() => dispatch({ type: ImageAction.Close, data: NoPayload })}
        >
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
          style={{ ...gridStyle, width: state.predbuttonShown ? "30%" : "40%" }}
        >
          <img
            src={state.img}
            height="auto"
            width="80%"
            alt=""
            vertical-align="middle"
          />
        </Card.Grid>

        {state.predbuttonShown && (
          <Card.Grid style={{ ...gridStyle, width: "70%" }}>
            <Tag>Topk Classes</Tag>
            <InputNumber
              min={1}
              max={10}
              defaultValue={3}
              onChange={val => {
                if (val !== undefined) {
                  dispatch({
                    type: ImageAction.SetNumReturns,
                    data: val
                  });
                }
              }}
            />

            <Divider />

            <Button
              onClick={() => {
                dispatch({
                  type: ImageAction.Predict,
                  data: (err, response) => {
                    if (err == null) {
                      dispatch({
                        type: ImageAction.ShowResult,
                        data: response.getResultsList()
                      });
                    } else {
                      dispatch({
                        type: ImageAction.ShowResult,
                        data: null
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
