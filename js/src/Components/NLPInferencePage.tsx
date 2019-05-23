import { Button, Card, Col, Input, Row } from "antd";
import React, { FC, useState } from "react";
import { SingleText, ProfaneSingleText } from "./NLPGenerator";

interface IDImgTuple {
  id: number;
  comp: JSX.Element;
}

interface InferecePageProp {
  modelNameSelected: string;
}

const defaultPhrase = "Serverless ";

export const NLPInferencePage: FC<InferecePageProp> = props => {
  const [addedTexts, setAddedTexts] = useState<IDImgTuple[]>([]);
  const [textCache, setTextCache] = useState<string>(defaultPhrase);
  const [textIDCounter, setTextIDCounter] = useState(0);

  const removeTextComp = (val: number) => {
    setAddedTexts(addedTexts => addedTexts.filter(v => v.id !== val));
  };

  function createTextRow(result: string) {
    var Filter = require('bad-words'),
    filter = new Filter();
    result = filter.clean(result);
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

  function checkThenCreate(result: string) {
    var Filter = require('bad-words'),
    filter = new Filter();
    var profane = filter.isProfane(result);
    if (!profane) {
      return createTextRow(result);
    }
    let component = (
      <Row style={{ padding: "2px" }} key={textIDCounter}>
        <ProfaneSingleText
          key={textIDCounter}
          inputPhrase={result}
          compID={textIDCounter}
          removeFunc={removeTextComp}
          modelName={props.modelNameSelected}
        />
      </Row>
    );
  }

  function checkThenSet(result: string) {
    var Filter = require('bad-words'),
    filter = new Filter();
    var profane = filter.isProfane(result);
    if (!profane) {
      return setTextCache(result);
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
                onChange={val => checkThenSet(val.target.value)}
                onPressEnter={() => {
                  checkThenCreate(textCache);
                }}
                allowClear={true}
              />
            </Card.Grid>
           
            <Card.Grid style={{ width: "50%" }}>
              <Button
                onClick={() => {
                  createTextRow(textCache);
                }}
              >
                Add Phrase
              </Button>
            </Card.Grid>
          
          </Card>
        </Col>
      </Row>

      {addedTexts.map(v => v.comp)}

    </div>
  );
};
