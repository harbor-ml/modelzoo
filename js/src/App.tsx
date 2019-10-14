import { Icon, Layout, Menu, Input, message, Drawer, Typography } from "antd";
import React, { FC, useState, useMemo } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { NavItemComponent } from "./Components/NavItem";
import { API, Catalog, Contact, Home, Monitor, Register, Model } from "./Views";
import { NavItems } from "./Config";
import { ModelzooServicePromiseClient } from "protos/services_grpc_web_pb";
import { Empty } from "protos/services_pb";
import { ModelObject, parseModels } from "./Utils/ProtoUtil";
const { Content, Sider, Footer } = Layout;
// const { Search } = Input;
// import { Models } from "./Components/Models";

// const { Title } = Typography;

const App: FC = () => {
  let [siderCollapsed, setSiderCollapsed] = useState(false);
  const [token, setToken] = useState("");
  const [tokenDrawerVisible, setTokenDrawerVisible] = useState(false);
  const [allModels, setAllModels] = useState<Array<ModelObject>>([]);
  console.log("App renders with token " + token);

  const client = useMemo(() => {
    let newClient = new ModelzooServicePromiseClient(
      `${window.location.protocol}//${window.location.hostname}:8080`,
      null,
      null
    );

    // Use new client to fetch list of models immediately
    newClient
      .listModels(new Empty(), undefined)
      .then(resp => setAllModels(parseModels(resp.getModelsList())))
      .catch(err => {
        message.error("Failed to fetch models");
        console.error(err);
      });

    newClient
      .getToken(new Empty(), undefined)
      .then(resp => setToken(resp.getToken()))
      .catch(err => {
        message.loading("Failed to retrieve token");
        console.log(err);
      });
    return newClient;
  }, []);

  let contentPading = 20;
  let contentWidth = siderCollapsed ? 80 : 200;

  return (
    <Router>
      <Drawer
        title="Access Token"
        placement="right"
        closable
        onClose={() => setTokenDrawerVisible(false)}
        visible={tokenDrawerVisible}
      >
        <Typography.Text code copyable>
          {token}
        </Typography.Text>
      </Drawer>

      <Layout style={{ minHeight: "100vh" }}>
        <Sider
          theme="dark"
          style={{
            overflow: "auto",
            height: "100vh",
            position: "fixed",
            top: 0,
            left: 0
          }}
          collapsible
          collapsed={siderCollapsed}
          onCollapse={(collapsed, _) => setSiderCollapsed(collapsed)}
        >
          <Menu theme="dark" defaultSelectedKeys={["home"]} mode="inline">
            {NavItems.map(NavItemComponent)}
          </Menu>
        </Sider>

        <Layout>
          <Menu
            mode="horizontal"
            theme="light"
            style={{
              margin: `0px 0px 10px ${contentWidth}px`,
              textAlign: "right",
              boxShadow: "0 1px 4px rgba(0,21,41,.08)"
            }}
            defaultSelectedKeys={["search"]}
          >
            <Menu.Item key="search">
              <Input.Search
                allowClear
                onSearch={value => console.log(value)}
              ></Input.Search>
            </Menu.Item>

            <Menu.Item
              key="token"
              onClick={() => setTokenDrawerVisible(!tokenDrawerVisible)}
            >
              <Icon type="user" />
            </Menu.Item>
          </Menu>

          <Content
            style={{
              margin: `8px 8px 8px ${contentWidth + contentPading}px`,
              overflow: "initial",
              padding: 12
            }}
          >
            <Switch>
              <Route exact path="/">
                <Home models={allModels} />
              </Route>
              <Route path="/catalog">
                <Catalog
                  client={client}
                  // models={allModels}
                />
              </Route>
              <Route path="/monitor">
                <Monitor />
              </Route>
              <Route path="/api">
                <API />
              </Route>
              <Route path="/register">
                <Register client={client} />
              </Route>
              <Route path="/contact">
                <Contact />
              </Route>
              <Route path="/model/:name">
                <Model
                  client={client}
                  token={token}
                  // models={allModels}
                />
              </Route>
              <Route path="/compare">
                <h2>
                  Comparison fucntion coming soon. View your result in one
                  place.
                </h2>
              </Route>
            </Switch>
          </Content>

          <Footer
            style={{
              textAlign: "center",
              margin: `0px 0px 10px ${contentWidth}px`
            }}
          >
            Modelzoo.Live © 2019 Created by RISELab
          </Footer>
        </Layout>
      </Layout>
    </Router>
  );
};

export default App;
