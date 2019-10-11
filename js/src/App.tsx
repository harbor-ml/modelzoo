import { Icon, Layout, Menu, Input } from "antd";
import React, { FC, useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { NavItemComponent } from "./Components/NavItem";
import { API, Catalog, Contact, Home, Monitor, Register } from "./Views";
import { NavItems } from "./Config";
const { Content, Sider, Footer } = Layout;
// const { Search } = Input;
// import { Models } from "./Components/Models";

// const { Title } = Typography;

// const client = new ModelzooServiceClient(
//   `${window.location.protocol}//${window.location.hostname}:8080`,
//   null,
//   null
// );
// export const ClientContext = React.createContext(client);

const App: FC = () => {
  let [siderCollapsed, setSiderCollapsed] = useState(false);

  let contentPading = 20;
  let contentWidth = siderCollapsed ? 80 : 200;

  return (
    <Router>
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

            <Menu.Item key="user">
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
                <Home />
              </Route>
              <Route path="/catalog">
                <Catalog />
              </Route>
              <Route path="/monitor">
                <Monitor />
              </Route>
              <Route path="/api">
                <API />
              </Route>
              <Route path="/register">
                <Register />
              </Route>
              <Route path="/contact">
                <Contact />
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
