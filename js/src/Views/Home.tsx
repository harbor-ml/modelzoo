import { Card, Col, Row, Statistic } from "antd";
import _ from "lodash";
import React, { FC } from "react";
import { FeaturedModelTag } from "../Components/Tags";
import { ModelObject } from "../Utils/ProtoUtil";

interface HomeProps {
  models: ModelObject[];
}

export const Home: FC<HomeProps> = props => {
  // let { models } = props;

  let featuredModels = _.times(3, i => (
    <Card.Grid>
      <h2>Resnet50</h2>
      <Row>
        <Col span={8}>
          <Statistic title="Accuracy" value={82.8} suffix={"%"} />
        </Col>
        <Col span={8}>
          <Statistic title="Mean Latency" value={50} suffix={"ms"} />
        </Col>
      </Row>
      <FeaturedModelTag
        name="Category"
        val="Image Classification"
        color="yellow"
      />
      <FeaturedModelTag name="Framework" val="PyTorch" color="magenta" />
      <FeaturedModelTag name="Input" val="Image" color="blue" />
      <FeaturedModelTag name="Output" val="Table" color="green" />
      <FeaturedModelTag name="Serving System" val="Clipper" color="volcano" />
    </Card.Grid>
  ));

  let globalMetrics = _.times(3, i => (
    <Card.Grid>
      <Statistic title="Active Users" value={112893} />
    </Card.Grid>
  ));

  return (
    <div>
      <Card title="Featured Models" bordered={false}>
        {featuredModels}
      </Card>

      <br></br>
      <Card title="Metric Summaries">{globalMetrics}</Card>
    </div>
  );
};
