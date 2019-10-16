import React, { FC, useState } from "react";
import { FormComponentProps } from "antd/lib/form/Form";
import { Redirect } from "react-router-dom";
import { KVFields } from "../Components/KVForm";
import {
  Form,
  Divider,
  Input,
  Typography,
  Button,
  Radio,
  message,
  Spin
} from "antd";
import { ModelzooServicePromiseClient } from "protos/services_grpc_web_pb";
import { Model as pb_Model, KVPair } from "protos/services_pb";
import _ from "lodash";

interface RegisterProp {
  client: ModelzooServicePromiseClient;
}

export const Register: FC<RegisterProp> = registerProps => {
  const { client } = registerProps;

  const RegisterForm: FC<FormComponentProps> = props => {
    const { form } = props;
    const { getFieldDecorator } = form;
    const [serviceType, setServiceType] = useState("");
    const [loadingRedirect, setLoadingRedirect] = useState<JSX.Element>(
      <p></p>
    );

    const handleSubmit = (e: any) => {
      e.preventDefault();
      form.validateFields((err, values) => {
        if (!err) {
          setLoadingRedirect(<Spin></Spin>);

          let metadata = _.zipObject(values.entryKeys, values.entryValues);
          let mergedMetadata = _.merge(
            metadata,
            _.pick(values, [
              "input_type",
              "output_type",
              "service_type",
              "clipper_url"
            ])
          );

          let modelProto = new pb_Model();
          _.transform(mergedMetadata, (result, value, key) => {
            let kvEntry = new KVPair();
            kvEntry.setKey(key);
            kvEntry.setValue(value as string);
            modelProto.addMetadata(kvEntry);
          });
          modelProto.setModelName(values["model_name"]);

          client
            .createModel(modelProto, undefined)
            .then(resp => {
              message.success("Success!");
              setLoadingRedirect(<Redirect to="/" />);
            })
            .catch(err => {
              message.error(
                `Unable to create models. Error: "${err.message}"`,
                10
              );
              console.error(err);
            });
        }
      });
    };

    return (
      <div>
        <Typography.Title level={3}>Add a new model</Typography.Title>
        <Form onSubmit={handleSubmit}>
          <Divider orientation="left">Required Fields</Divider>
          <Form.Item
            label="Model Name"
            required
            wrapperCol={{ span: 16 }}
            labelCol={{ span: 4 }}
          >
            {getFieldDecorator("model_name", {
              validateTrigger: ["onChange", "onBlur"],
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: "Please enter the model name."
                }
              ]
            })(<Input placeholder="Fancy model" />)}
          </Form.Item>

          <Form.Item
            label="Input type"
            required
            wrapperCol={{ span: 8 }}
            labelCol={{ span: 4 }}
          >
            {getFieldDecorator("input_type", {
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: "Please select the input type"
                }
              ]
            })(
              <Radio.Group>
                <Radio.Button value="image">Image</Radio.Button>
                <Radio.Button value="texts">Texts</Radio.Button>
              </Radio.Group>
            )}
          </Form.Item>

          <Form.Item
            label="Output type"
            required
            wrapperCol={{ span: 8 }}
            labelCol={{ span: 4 }}
          >
            {getFieldDecorator("output_type", {
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: "Please select the output type"
                }
              ]
            })(
              <Radio.Group>
                <Radio.Button value="image">Image</Radio.Button>
                <Radio.Button value="texts">Texts</Radio.Button>
                <Radio.Button value="table">Table</Radio.Button>
              </Radio.Group>
            )}
          </Form.Item>

          <Form.Item
            label="Service type"
            required
            wrapperCol={{ span: 8 }}
            labelCol={{ span: 4 }}
          >
            {getFieldDecorator("service_type", {
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: "Please select the service type"
                }
              ]
            })(
              <Radio.Group>
                <Radio.Button
                  value="clipper"
                  onClick={() => setServiceType("clipper")}
                >
                  Clipper
                </Radio.Button>
              </Radio.Group>
            )}
          </Form.Item>

          <Divider orientation="left">Prediction Server</Divider>
          {serviceType === "clipper" ? (
            <Form.Item
              label="Clipper URL"
              required
              wrapperCol={{ span: 16 }}
              labelCol={{ span: 4 }}
            >
              {getFieldDecorator("clipper_url", {
                validateTrigger: ["onChange", "onBlur"],
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    message: "Please enter the clipper URL to send request to."
                  }
                ]
              })(<Input placeholder="http://..." />)}
            </Form.Item>
          ) : (
            ""
          )}

          <Divider orientation="left">Metadata</Divider>
          <KVFields form={form} addFieldText="Add new entry"></KVFields>

          <Divider></Divider>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>

          {loadingRedirect}
        </Form>
      </div>
    );
  };
  const WrappedForm = Form.create()(RegisterForm);
  return <WrappedForm></WrappedForm>;
};
