import React, { FC } from "react";

import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

import { Tabs } from "antd";
const { TabPane } = Tabs;

export const API: FC = () => {
  return (
    <Tabs defaultActiveKey="python">
      <TabPane tab="HTTP" key="http">
        <SwaggerUI
          // Note: this url is generated via `make proto-go` in the ROOT/Makefile
          //       it should only be working in production build
          url="static/_swagger/modelzoo/protos/services.swagger.json"
          docExpansion={"list"}
        />
      </TabPane>
    </Tabs>
  );
};
