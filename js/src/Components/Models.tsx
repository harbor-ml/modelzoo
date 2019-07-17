import React, { FC, useState, useMemo, useContext } from "react";
import { Card, Row, Radio } from "antd";
import { GetModelsReq, GetModelsResp, ModelCategory } from "protos/services_pb";
import { ClientContext } from "../App";
import { CVInferencePage } from "./CVInferencePage";
import { NLPInferencePage } from "./NLPInferencePage";
import { ImSegInferencePage } from "./ImSegInferencePage";

function getCategoryHumanName(cat: ModelCategory): string {
  if (cat === ModelCategory.TEXTGENERATION) {
    return "text-gen";
  } else if (cat === ModelCategory.VISIONCLASSIFICATION) {
    return "vision";
  } else if (cat === ModelCategory.IMAGESEGMENTATION) {
    return "img-segmentation"
  } else if (cat === ModelCategory.IMAGECAPTIONING) {
    return "img-captioning"
  }
  return "";
}

export const Models: FC = () => {
  const [modelList, setModelList] = useState<GetModelsResp.Model[]>([]);
  const [inferencePage, setInferencePage] = useState<JSX.Element>();
  const client = useContext(ClientContext);

  useMemo(() => {
    let req = new GetModelsReq();
    client.listModels(req, undefined, (err, resp) => {
      setModelList(resp.getModelsList());
    });
  }, [client]);

  return (
    <div>
      <Card key="chooseYourModel">
        <Row>Please choose the models you wish to use from the menu below:</Row>
        <Row>The text generation models may take up to 5 seconds.</Row>

        <Row>
          <Radio.Group
            buttonStyle="solid"
            onChange={v => {
              const cat = v.target.value.getModelCategory();
              const val = v.target.value.getModelName();
              if (cat === ModelCategory.VISIONCLASSIFICATION) {
                setInferencePage(<CVInferencePage modelNameSelected={val} />);
              } else if (cat === ModelCategory.TEXTGENERATION) {
                setInferencePage(<NLPInferencePage modelNameSelected={val} />);
              } else if (cat === ModelCategory.IMAGESEGMENTATION || cat === ModelCategory.IMAGECAPTIONING) {
                setInferencePage(<ImSegInferencePage modelNameSelected={val} />);
              }
            }}
          >
            {modelList.map(m => (
              <Radio.Button value={m} key={m.getModelName()}>
                {" "}
                {getCategoryHumanName(m.getModelCategory()) +
                  ":" +
                  m.getModelName()}{" "}
              </Radio.Button>
            ))}
          </Radio.Group>
        </Row>
      </Card>

      {inferencePage}
    </div>
  );
};
