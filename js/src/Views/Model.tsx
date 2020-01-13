import { Divider, message, Result, Spin, Typography, Col, Row } from "antd";
import _ from "lodash";
import { ModelzooServicePromiseClient } from "protos/services_grpc_web_pb";
import { Empty, Payload, PayloadType } from "protos/services_pb";
import { Image, Text } from "protos/model_apis_pb";
import React, { Dispatch, FC, useMemo, useReducer } from "react";
import { useParams } from "react-router-dom";
import { ImageInput, ImageOutput } from "../Components/Image";
import { TableOutput } from "../Components/Table";
import { TagsSet, StatsSet } from "../Components/Tags";
import { TextsInput, TextsOutput } from "../Components/Texts";
import { ModelObject, parseModels } from "../Utils/ProtoUtil";

interface ModelProps {
  client: ModelzooServicePromiseClient;
  token: string;
}

enum ModelFoundState {
  ModelFetching,
  ModelFound,
  ModelNotFound
}

interface ModelInferenceState {
  modelName: string;
  token: string;
  client: ModelzooServicePromiseClient | undefined;
  dispatch: Dispatch<ModelActionUnion> | undefined;

  modelObject: ModelObject | undefined;
  modelFound: ModelFoundState;
  inputType: string;
  outputType: string;

  errorElement: JSX.Element;
  metadataElement: JSX.Element;
  inputElement: JSX.Element;
  displayElement: JSX.Element;
  outputElement: JSX.Element;
}

const modelInitialState: ModelInferenceState = {
  modelName: "",
  token: "",
  client: undefined,
  dispatch: undefined,

  modelObject: undefined,
  modelFound: ModelFoundState.ModelFetching,
  inputType: "",
  outputType: "",

  errorElement: <div></div>,
  metadataElement: <div></div>,
  inputElement: <div></div>,
  displayElement: <div></div>,
  outputElement: <div></div>
};

enum ModelActionType {
  SetModelName,
  SetModelNotFound,
  SetModelTypes,
  SetInput,
  SetOutputLoading,
  SetOutputResult,
  SetDisplayResult
}

interface ModelAction {
  type: ModelActionType;
}
interface SetModelNameAction extends ModelAction {
  modelName: string;
  client: ModelzooServicePromiseClient;
  dispatch: Dispatch<ModelActionUnion>;
  token: string;
}
interface SetModelTypeAction extends ModelAction {
  modelObject: ModelObject;
}
interface SetPayloadAction extends ModelAction {
  payload: Payload;
}
type SetInputAction = SetPayloadAction;
type SetDisplayAction = SetPayloadAction;
type SetOutputAction = SetPayloadAction;
type ModelActionUnion =
  | SetModelNameAction
  | SetModelTypeAction
  | ModelAction
  | SetPayloadAction;

function reducer(
  state: ModelInferenceState,
  action: ModelActionUnion
): ModelInferenceState {
  switch (action.type) {
    case ModelActionType.SetModelName:
      let actionCast = action as SetModelNameAction;
      return {
        ...state,
        modelName: actionCast.modelName,
        client: actionCast.client,
        dispatch: actionCast.dispatch,
        token: actionCast.token
      };

    case ModelActionType.SetModelTypes:
      console.log(state);
      let modelFound = (action as SetModelTypeAction).modelObject;

      let inputType = modelFound.metadata["input_type"][0].toLowerCase();
      let inputElement: JSX.Element = <div></div>;
      switch (inputType) {
        case "image":
          inputElement = (
            <ImageInput
              setImageString={(image: string) => {
                let payload = new Payload();
                let imageProto = new Image();
                imageProto.setImageDataUrl(image);
                imageProto.setAccessToken(state.token);
                imageProto.setModelName(state.modelName);
                payload.setImage(imageProto);
                payload.setType(PayloadType.IMAGE);
                state.dispatch!({
                  type: ModelActionType.SetInput,
                  payload: payload
                });
              }}
              client={state.client!}
            />
          );
          break;
        case "text":
          inputElement = (
            <TextsInput
              setTexts={(texts: Array<string>) => {
                let payload = new Payload();
                let textProto = new Text();
                textProto.setTextsList(texts);
                textProto.setAccessToken(state.token);
                textProto.setModelName(state.modelName);
                payload.setText(textProto);
                payload.setType(PayloadType.TEXT);
                state.dispatch!({
                  type: ModelActionType.SetInput,
                  payload: payload
                });
              }}
              client={state.client!}
            />
          );
          break;
        default:
          message.error("Unknown input type " + inputType);
      }

      let outputType = modelFound.metadata["output_type"][0].toLowerCase();

      return {
        ...state,
        metadataElement: (
          <div>
            <StatsSet model={modelFound} showAll={true} />
            <TagsSet model={modelFound} showAll={true} />
            <Divider></Divider>
          </div>
        ),
        inputElement: inputElement,
        outputType: outputType,
        inputType: inputType
      };

    case ModelActionType.SetInput:
      state.dispatch!({
        type: ModelActionType.SetDisplayResult,
        payload: (action as SetInputAction).payload
      });

      state
        .client!.inference((action as SetInputAction).payload, undefined)
        .then(resp =>
          state.dispatch!({
            type: ModelActionType.SetOutputResult,
            payload: resp
          })
        )
        .catch(err =>
          message.error("Can't ping the inference API: " + err.message)
        );

      return {
        ...state,
        outputElement: <Spin></Spin>
      };
      break;
    case ModelActionType.SetDisplayResult:
      let displayPayload = (action as SetDisplayAction).payload;
      switch (state.inputType) {
        case "image":
          return {
            ...state,
            displayElement: (
              <ImageOutput
                image_uri={displayPayload.getImage()!.getImageDataUrl()}
              ></ImageOutput>
            )
          };
        case "text":
          return {
            ...state,
            displayElement: (
              <TextsOutput
                texts={displayPayload.getText()!.getTextsList()}
              ></TextsOutput>
            )
          };
        case "table":
          return {
            ...state,
            displayElement: (
              <TableOutput
                tableProto={displayPayload.getTable()!}
              ></TableOutput>
            )
          };
        default:
          message.error("Unknown input type " + state.inputType);
          return state;
      }
      break;
    case ModelActionType.SetOutputResult:
      let payload = (action as SetOutputAction).payload;
      switch (state.outputType) {
        case "image":
          return {
            ...state,
            outputElement: (
              <ImageOutput
                image_uri={payload.getImage()!.getImageDataUrl()}
              ></ImageOutput>
            )
          };
        case "text":
          return {
            ...state,
            outputElement: (
              <TextsOutput
                texts={payload.getText()!.getTextsList()}
              ></TextsOutput>
            )
          };
        case "table":
          return {
            ...state,
            outputElement: (
              <TableOutput tableProto={payload.getTable()!}></TableOutput>
            )
          };
        default:
          message.error("Unknown output type " + state.outputType);
          return state;
      }

    case ModelActionType.SetModelNotFound:
      return {
        ...state,
        errorElement: (
          <Result
            status="404"
            title="Model not found"
            subTitle="Please visit the catalog 👈 or use search ☝"
          />
        )
      };

    default:
      return {
        ...state,
        errorElement: <Result status="500" title="Something went wrong..." />
      };
  }
}

// TODO(simon): this is vastly in-efficient.
// User shouldn't need to ListModels when they are linked to a single one.
export const Model: FC<ModelProps> = props => {
  // Parse props
  let { name } = useParams();
  let { client, token } = props;
  const [state, dispatch] = useReducer(reducer, modelInitialState);

  console.log("model re-renders with token " + token);

  // Initial Action: fetch model
  useMemo(() => {
    dispatch({
      type: ModelActionType.SetModelName,
      modelName: name as string,
      client: client,
      dispatch: dispatch,
      token: token
    });

    client
      .listModels(new Empty(), undefined)
      .then(resp => {
        let models = parseModels(resp.getModelsList());
        let modelFound = _.find(models, (value: ModelObject, index, array) => {
          return value.name === name;
        });
        if (modelFound) {
          dispatch({
            type: ModelActionType.SetModelTypes,
            modelObject: modelFound
          });
        } else {
          dispatch({
            type: ModelActionType.SetModelNotFound
          });
        }
      })
      .catch(err => {
        dispatch({
          type: ModelActionType.SetModelNotFound
        });
      });
  }, [client, token, name]);

  return (
    <div>
      <Typography.Title level={2}>{name}</Typography.Title>
      <Divider></Divider>
      {state.errorElement}
      {state.metadataElement}
      {state.inputElement}
      <Divider></Divider>
      <Row>
        <Col span={8}>{state.displayElement}</Col>
        <Col span={12}>{state.outputElement}</Col>
      </Row>
    </div>
  );

  // let outputType = modelFound.metadata["output_type"][0].toLowerCase();

  // const setOutput = (outputPayload: Payload) => {
  //   switch (outputPayload.getPayloadCase()) {
  //     case Payload.PayloadCase.IMAGE:
  //       setOutputElement(
  //         <ImageOutput
  //           image_uri={outputPayload.getImage()!.getImageDataUrl()}
  //         ></ImageOutput>
  //       );
  //       break;
  //     case Payload.PayloadCase.TEXT:
  //       // setTextsOutput(outputPayload.getText()!.getTextsList());
  //       break;
  //     default:
  //       message.error("Unknown output type");
  //       break;
  //   }
  // };

  // let payload = new Payload();
  // let setInferenceTask = () => {
  //   setOutputElement(<Spin></Spin>);
  //   payload.setType(PayloadType.IMAGE);

  //   let payloadImage = new Image();
  //   payloadImage.setImageDataUrl(imageInput);
  //   payloadImage.setAccessToken(token);
  //   payloadImage.setModelName(modelFound!.name);
  //   payload.setImage(payloadImage);

  //   client
  //     .inference(payload, undefined)
  //     .then(resp => setOutput(resp))
  //     .catch(err => message.error("Failed image inference"));
  // };

  // return (
  //   <div>
  //     <h2>{name}</h2>

  //     <Row>
  //       <Col span={8}>
  //         <Statistic title="Accuracy" value={82.8} suffix={"%"} />
  //       </Col>
  //       <Col span={8}>
  //         <Statistic title="Mean Latency" value={50} suffix={"ms"} />
  //       </Col>
  //     </Row>

  //     <TagsSet model={modelFound} showAll={true} />

  //     {inputElement}

  //     {outputElement}
  //   </div>
  // );
};
