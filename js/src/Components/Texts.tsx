import React, { FC, Dispatch, SetStateAction, useState } from "react";
import { Card, Input, Button, List } from "antd";

interface TextsInputProps {
  setTexts: Dispatch<SetStateAction<Array<string>>>;
}

export const TextsInput: FC<TextsInputProps> = props => {
  let { setTexts } = props;
  const [singleLine, setSingleLine] = useState("");

  return (
    <Card>
      <Input
        defaultValue="Enter text..."
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
      bordered
      dataSource={texts}
      renderItem={item => <List.Item>{item}</List.Item>}
    />
  );
};
