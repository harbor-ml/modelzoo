import {
  Alert,
  Col,
  message,
  Result,
  Row,
  Spin,
  Statistic,
  Typography,
  Divider
} from "antd";
import _ from "lodash";
import { ModelzooServicePromiseClient } from "protos/services_grpc_web_pb";
import { Image, Payload, PayloadType, Empty } from "protos/services_pb";
import React, { FC, Dispatch, useState, useReducer, useMemo } from "react";
import { useParams } from "react-router-dom";
import { ImageInput, ImageOutput } from "../Components/Image";
import { TagsSet } from "../Components/Tags";
import { TextsInput } from "../Components/Texts";
import { ModelObject, parseModels } from "../Utils/ProtoUtil";
import { stat } from "fs";

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
  outputElement: <div></div>
};

enum ModelActionType {
  SetModelName,
  SetModelNotFound,
  SetModelTypes,
  SetInput,
  SetOutputLoading,
  SetOutputResult
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
                state.dispatch!({
                  type: ModelActionType.SetInput,
                  payload: payload
                });
              }}
              client={state.client!}
            />
          );
          break;
        case "texts":
          break;
        default:
          message.error("Unknown input type " + inputType);
      }

      let outputType = modelFound.metadata["output_type"][0].toLowerCase();

      return {
        ...state,
        metadataElement: <TagsSet model={modelFound} showAll={true} />,
        inputElement: inputElement,
        outputType: outputType,
        inputType: inputType
      };

    case ModelActionType.SetInput:
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
        case "texts":
        default:
          break;
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
  }, [client, token]);

  return (
    <div>
      <Typography.Title level={2}>{name}</Typography.Title>
      <Divider></Divider>
      {state.errorElement}
      {state.metadataElement}
      {state.inputElement}
      {state.outputElement}
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
