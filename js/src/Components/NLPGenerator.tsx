import {
  Button,
  Card,
  Input,
  Divider,
  Icon,
  InputNumber,
  Row,
  Tag
} from "antd";
import { Error as grpcError } from "grpc-web";
import { ModelClient } from "protos/services_grpc_web_pb";
import {
  TextGenerationRequest,
  ModelResponse
} from "protos/services_pb";
import {
  getResult
} from "./Results";
import React, {
  CSSProperties,
  FC,
  useContext,
  useMemo,
  useReducer
} from "react";
import { ClientContext } from "../App";
import { round } from "./Utils";

// We use require rather than import because it breaks typescript
const Filter = require("bad-words"),
  filter = new Filter();

interface TextState {
  inputPhrase: string;
  predResult: ModelResponse | null;
  predbuttonShown: boolean;
  resultCardShown: boolean;
  temperature: number;
  startInferneceTime?: DOMHighResTimeStamp;
  inferDuration?: number;
  props: SingleTextProp;
  client?: ModelClient;
  token: string;
}

enum TextAction {
  Predict,
  ShowResult,
  SetTemperature,
  SetToken,
  Close,
  SetClient
}

type newTextType = string;
type newResultType = ModelResponse | null;
type callbackType = (err: grpcError, response: ModelResponse) => void;
type temperatureType = number;
const NoPayload: string = "No Payload";
interface ActionPayload {
  type: TextAction;
  data:
    | newTextType
    | newResultType
    | callbackType
    | temperatureType
    | typeof NoPayload
    | ModelClient;
}

function initTextState(props: SingleTextProp): TextState {
  return {
    inputPhrase: props.inputPhrase,
    predResult: null,
    predbuttonShown: true,
    resultCardShown: false,
    temperature: 0.7,
    props: props,
    token: ""
  };
}

function singleTextReducer(state: TextState, action: ActionPayload): TextState {
  if (action.type === TextAction.Predict) {
    let request = new TextGenerationRequest();
    request.setInputPhrase(state.inputPhrase);
    request.setTemperature(state.temperature);
    request.setModelUuid(state.props.uuid);
    request.setToken(state.token);
    let startTS = performance.now();
    state.client!.textGeneration(request, {}, action.data as callbackType);
    return {
      ...state,
      startInferneceTime: startTS
    };
  } else if (action.type === TextAction.ShowResult) {
    return {
      ...state,
      resultCardShown: true,
      predbuttonShown: false,
      predResult: action.data as newResultType,
      inferDuration: performance.now() - state.startInferneceTime!
    };
  } else if (action.type === TextAction.SetTemperature) {
    return {
      ...state,
      temperature: action.data as temperatureType
    };
  } else if (action.type === TextAction.Close) {
    state.props.removeFunc(state.props.compID);
  } else if (action.type === TextAction.SetClient) {
    return {
      ...state,
      client: action.data as ModelClient
    };
  } else if (action.type === TextAction.SetToken) {
    return {
      ...state,
      token: action.data as newTextType
    };
  }
  return { ...state };
}

interface SingleTextProp {
  inputPhrase: string;
  compID: number;
  removeFunc: Function;
  modelName: string;
  uuid: string;
}

export const SingleText: FC<SingleTextProp> = props => {
  const [state, dispatch] = useReducer(singleTextReducer, props, initTextState);
  const client = useContext(ClientContext);
  useMemo(() => dispatch({ type: TextAction.SetClient, data: client }), [
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
        <Tag>Temperature: {state.temperature}</Tag>
        <Tag>
          {"End-to-End Inference Time (s): " +
            round(state.inferDuration! / 1000, 2)}
        </Tag>

        <Button
          onClick={() => dispatch({ type: TextAction.Close, data: NoPayload })}
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
          {state.inputPhrase}
        </Card.Grid>

        {state.predbuttonShown && (
          <Card.Grid style={{ ...gridStyle, width: "70%" }}>
            <Tag>Temperature</Tag>
            <InputNumber
              min={0.1}
              max={1.0}
              step={0.1}
              defaultValue={0.7}
              onChange={val => {
                if (val !== undefined) {
                  dispatch({
                    type: TextAction.SetTemperature,
                    data: val
                  });
                }
              }}
            />
            <Divider />
            <Tag>Token</Tag>
            <Input
              style={{ marginBottom: 32, width: 200 }}
              onChange={val => {
                if (val !== undefined) {
                  dispatch({
                    type: TextAction.SetToken,
                    data: val.target.value
                  });
                }
              }}/>
            <Divider />

            <Button
              onClick={() => {
                dispatch({
                  type: TextAction.Predict,
                  data: (err, response) => {
                    if (err == null) {
                      dispatch({
                        type: TextAction.ShowResult,
                        data: response
                      });
                    } else {
                      dispatch({
                        type: TextAction.ShowResult,
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
            {state.predResult != null ? (getResult(state.predResult)) : (
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