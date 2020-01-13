import { Card, Col, message, Row, Statistic } from "antd";
import _ from "lodash";
import { ModelzooServicePromiseClient } from "js/generated/modelzoo/protos/services_grpc_web_pb";
import { Empty } from "js/generated/modelzoo/protos/services_pb";
import React, { FC, useMemo, useState } from "react";
import { FeaturedModelTag } from "../Components/Tags";
import { ModelObject, parseModels } from "../Utils/ProtoUtil";

import { Link } from "react-router-dom";
import { TagsSet, StatsSet } from "../Components/Tags";

interface HomeProps {
  models: ModelObject[];
  client: ModelzooServicePromiseClient;
}

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
          style={{ margin: "2px" }}
          extra={<Link to={`model/${model.name}`}>Test it</Link>}
        >
          <Row>
            <StatsSet model={model} showAll={false}></StatsSet>
          </Row>
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

export const Home: FC<HomeProps> = props => {
  // let { models } = props;
  let { client } = props;

  return <Catalog client={client}></Catalog>;
};
