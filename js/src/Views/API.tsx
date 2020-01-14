import React, { FC } from "react";

import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

import { Tabs, Result } from "antd";
const { TabPane } = Tabs;

export const API: FC = () => {
  return (
    <Tabs defaultActiveKey="python">
      <TabPane tab="Python" key="python">
        <script src="https://gist.github.com/simon-mo/7780865ce3333df86a2325b84aabd37b.js"></script>
        {/* <Result
          status="404"
          title="Python API Doc coming soon"
          subTitle={
            <a href="https://pypi.org/project/modelzoo/">
              https://pypi.org/project/modelzoo/
            </a>
          }
        /> */}
      </TabPane>

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
