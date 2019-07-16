import {
    Collapse,
    Icon,
    Table
  } from "antd";
import {
    ModelResponse,
    TextGenerationResponse,
    ImageSegmentationResponse,
    VisionClassificationResponse
} from "protos/services_pb";
import React from "react";
import { round } from "./Utils";
import { isUndefined } from "util";


function textComponent(prop: TextGenerationResponse | undefined) {
  if (isUndefined(prop)) {
    return (<div>
      <Icon type="warning" />
  
      <p>Query Failed</p>
    </div>);
  }
    // We use require rather than import because it breaks typescript
    const Filter = require("bad-words"),
    filter = new Filter();
    return (<Collapse
        activeKey={prop.getGeneratedTextsList()
          .map((_, i) => i.toString())}
      >
        {prop
          .getGeneratedTextsList()
          .map((paragraph, i) => {
            return (
              <Collapse.Panel header="" key={i.toString()}>

                {paragraph.split("\n").map((item, i) => {
                  return <p key={i}>{filter.clean(item)}</p>;
                })}
              </Collapse.Panel>
            );
          })}
      </Collapse>);
}

function imageComponent(prop: ImageSegmentationResponse | undefined) {
  if (isUndefined(prop)) {
    return (<div>
      <Icon type="warning" />
  
      <p>Query Failed</p>
    </div>);
  }
  return (<img
  src={prop.getOutputImage()}
  height="auto"
  width="80%"
  alt=""
  vertical-align="middle"
/>);
}

function visionComponent(prop: VisionClassificationResponse | undefined) {
  if (isUndefined(prop)) {
    return (<div>
      <Icon type="warning" />
  
      <p>Query Failed</p>
    </div>);
  }
  return (<Table
                dataSource={prop.getResultsList()
                  .slice(0, prop.getResultsList().length)
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
              />);
}

export function getResult(prop: ModelResponse) {
  if (prop.getTypestring() === "text") {
    return textComponent(prop.getText());
  } else if (prop.getTypestring() === "segment") {
    return imageComponent(prop.getSegment());
  } else if (prop.getTypestring() === "vision") {
    return visionComponent(prop.getVision());
  }
  return (<div>
    <Icon type="warning" />

    <p>Query Failed</p>
  </div>);
}