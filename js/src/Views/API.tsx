import React, { FC } from "react";

import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

import { Tabs, Result } from "antd";
const { TabPane } = Tabs;

export const API: FC = () => {
  return (
    <Tabs defaultActiveKey="python">
      <TabPane tab="Python" key="python">
        <Result
          status="404"
          title="Python API Doc coming soon"
          subTitle={
            <a href="https://pypi.org/project/modelzoo/">
              https://pypi.org/project/modelzoo/
            </a>
          }
        />
      </TabPane>

      <TabPane tab="HTTP" key="http">
        <SwaggerUI
          url="https://raw.githubusercontent.com/harbor-ml/modelzoo/906d49fa4d008055dcd855b4ff7078f7e8c75306/go/protos/services.swagger.json"
          // url="https://petstore.swagger.io/v2/swagger.json"
          docExpansion={"list"}
        />
      </TabPane>
    </Tabs>
    // <div style={{ background: "white" }}>{Array(100).fill(<br></br>)}</div>
  );
};
