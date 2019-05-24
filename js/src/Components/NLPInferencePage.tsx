import { Button, Card, Col, Input, Row, Alert } from "antd";
import React, { FC, useState } from "react";
import { SingleText } from "./NLPGenerator";

interface IDImgTuple {
  id: number;
  comp: JSX.Element;
}

interface InferecePageProp {
  modelNameSelected: string;
}

const defaultPhrase = "Serverless ";

var Filter = require('bad-words'),
filter = new Filter();

export const NLPInferencePage: FC<InferecePageProp> = props => {
  const [addedTexts, setAddedTexts] = useState<IDImgTuple[]>([]);
  const [textCache, setTextCache] = useState<string>(defaultPhrase);
  const [textIDCounter, setTextIDCounter] = useState(0);
  const [alertComponent, setAlertComponent] = useState<JSX.Element>();

  const removeTextComp = (val: number) => {
    setAddedTexts(addedTexts => addedTexts.filter(v => v.id !== val));
  };

  function createTextRow(result: string) {
    var profane = filter.isProfane(result);
    let component = (
      <Row style={{ padding: "2px" }} key={textIDCounter}>
        <SingleText
          key={textIDCounter}
          inputPhrase={result}
          compID={textIDCounter}
          removeFunc={removeTextComp}
          modelName={props.modelNameSelected}
        />
      </Row>
    );
    setTextIDCounter(textIDCounter => textIDCounter + 1);
    setAddedTexts(addedTexts => [
      { id: textIDCounter, comp: component },
      ...addedTexts
    ]);
  }

  function createAlert() {
    setAlertComponent(
      <Alert
      closable
        message="Please be nice to the bot! No profanity."
        type="error"
      />
    );
  }

  function createProfaneFilter(result: string) {
    if (!filter.isProfane(result)) {
      return createTextRow(result);
    } else {
      return createAlert();
    }
  }

  return (
    <div>
      <Row gutter={16} style={{ marginTop: "5px" }}>
        <Col span={24}>
          <Card title="Enter a starting phrase">
            
            <Card.Grid style={{ width: "50%" }}>
              <Input
                placeholder={defaultPhrase}
                style={{ marginBottom: 32 }}
                onChange={val => {
                  setTextCache(val.target.value);
                  setAlertComponent((<div></div>));
                }}
                onPressEnter={() => createProfaneFilter(textCache)}
                allowClear={true}
              />
            </Card.Grid>
           
            <Card.Grid style={{ width: "50%" }}>
              <Button
                onClick={() => {
                  createProfaneFilter(textCache);
                }}
              >
                Add Phrase
              </Button>

              {alertComponent}
            </Card.Grid>
          
            
            

          </Card>
        </Col>
      </Row>

      {addedTexts.map(v => v.comp)}

    </div>
  );
};
