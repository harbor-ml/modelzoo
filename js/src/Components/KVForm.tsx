import { Button, Form, Icon, Input, Row } from "antd";
import { FormComponentProps } from "antd/lib/form/Form";

import React, { useState } from "react";

interface KVFieldsProps extends FormComponentProps {
  addFieldText: string;
}

export const KVFields: React.FC<KVFieldsProps> = props => {
  const { form, addFieldText } = props;
  const { getFieldDecorator } = form;
  getFieldDecorator("keys", { initialValue: [] });

  const keys = form.getFieldValue("keys") as Array<number>;
  const [counter, setCounter] = useState(0);

  const remove = (k: number) => {
    form.setFieldsValue({
      keys: keys.filter(key => key !== k)
    });
  };

  const add = () => {
    form.setFieldsValue({
      keys: keys.concat(counter)
    });

    setCounter(counter + 1);
  };

  const formItems = keys.map((k, index) => (
    <div key={index}>
      <Form.Item
        style={{ display: "inline-block", width: "45%" }}
        label="Key"
        required={true}
        key={`key-${k}`}
        wrapperCol={{ span: 12 }}
        labelCol={{ span: 4 }}
      >
        {getFieldDecorator(`entryKeys[${k}]`, {
          validateTrigger: ["onChange", "onBlur"],
          rules: [
            {
              required: true,
              whitespace: true,
              message: "Please enter key or delete this field."
            }
          ]
        })(<Input placeholder="Key" />)}
      </Form.Item>

      <Form.Item
        style={{ display: "inline-block", width: "45%" }}
        label="Value"
        required={true}
        key={`val-${k}`}
        wrapperCol={{ span: 12 }}
        labelCol={{ span: 4 }}
      >
        {getFieldDecorator(`entryValues[${k}]`, {
          validateTrigger: ["onChange", "onBlur"],
          rules: [
            {
              required: true,
              whitespace: true,
              message: "Please enter value or delete this field."
            }
          ]
        })(<Input placeholder="Value" />)}
      </Form.Item>

      <Icon
        style={{ display: "inline-block" }}
        type="minus-circle-o"
        onClick={() => remove(k)}
      />
    </div>
  ));

  return (
    // <Form onSubmit={handleSubmit}>
    <div>
      {formItems}

      <Form.Item>
        <Button type="dashed" onClick={add}>
          <Icon type="plus" /> {addFieldText}
        </Button>
      </Form.Item>
    </div>
    //   <Form.Item>
    //     <Button type="primary" htmlType="submit">
    //       Submit
    //     </Button>
    //   </Form.Item>
    // </Form>
  );
};
