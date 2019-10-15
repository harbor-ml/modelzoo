import { Card, Col, Row, message } from "antd";
import React, { FC, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { TagsSet } from "../Components/Tags";
import { ModelObject, parseModels } from "../Utils/ProtoUtil";
import { ModelzooServicePromiseClient } from "protos/services_grpc_web_pb";
import { Empty } from "protos/services_pb";

interface CatalogProps {
  // models: ModelObject[];
  client: ModelzooServicePromiseClient;
}

export const Catalog: FC<CatalogProps> = props => {
  // let { models } = props;
  let { client } = props;
  const [models, setModels] = useState<Array<ModelObject>>([]);

  useMemo(() => {
    client
      .listModels(new Empty(), undefined)
      .then(resp => setModels(parseModels(resp.getModelsList())))
      .catch(err => message.error("Unable to fetch all models"));
  }, [client]);

  let cards = models.map((model: ModelObject, index, arr) => {
    return (
      <Col span={8}>
        <Card
          title={model.name}
          style={{ margin: "4px" }}
          extra={<Link to={`model/${model.name}`}>Test it</Link>}
        >
          <TagsSet model={model} showAll={false}></TagsSet>
        </Card>
      </Col>
    );
  });

  return (
    <div>
      <Row>{cards}</Row>
    </div>
  );
};
