import { Button, Card, Input, List } from "antd";
import { ModelzooServicePromiseClient } from "protos/services_grpc_web_pb";
import React, { FC, useState } from "react";

interface TextsInputProps {
  setTexts: (texts: Array<string>) => void;
  client: ModelzooServicePromiseClient;
}

export const TextsInput: FC<TextsInputProps> = props => {
  let { setTexts } = props;
  const [singleLine, setSingleLine] = useState("");

  return (
    <Card>
      <Input
        placeholder="Enter text here..."
        onChange={event => setSingleLine(event.target.value)}
        onPressEnter={() => setTexts([singleLine])}
      ></Input>
      <Button onClick={e => setTexts([singleLine])}>Run</Button>
    </Card>
  );
};

interface TextsOutputProps {
  texts: Array<string>;
}
export const TextsOutput: FC<TextsOutputProps> = props => {
  let { texts } = props;

  return (
    <List
      header={<div>Result</div>}
      style={{ background: "white" }}
      bordered
      dataSource={texts}
      renderItem={item => <List.Item>{item}</List.Item>}
    />
  );
};
