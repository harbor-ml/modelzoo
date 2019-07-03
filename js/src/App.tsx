import React, { FC } from "react";
import { Layout, Menu, Typography } from "antd";

import "./App.css";

import { ModelClient } from "protos/services_grpc_web_pb";
import { Models } from "./Components/Models";

const { Title } = Typography;

const client = new ModelClient("34.207.114.194:32424", null, null);
export const ClientContext = React.createContext(client);

const App: FC = () => {
  return (
    <ClientContext.Provider value={client}>
      <Layout>
        <Layout.Header>
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={["1"]}
            style={{ lineHeight: "64px" }}
          >
            <Menu.Item key="1" disabled>
              <Title level={4} style={{ color: "#ffffff" }}>
                ModelZoo.Live
              </Title>
            </Menu.Item>
          </Menu>
        </Layout.Header>
        <Layout.Content style={{ padding: "20px 50px" }}>
          <Models />
        </Layout.Content>
        <Layout.Footer style={{ textAlign: "center" }}>
          Created by RISELab
        </Layout.Footer>
      </Layout>
    </ClientContext.Provider>
  );
};

export default App;
