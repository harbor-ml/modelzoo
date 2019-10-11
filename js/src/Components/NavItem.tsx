import React, { FC } from "react";
import { Menu, Icon } from "antd";
import { Link } from "react-router-dom";

export interface NavItem {
  route: string;
  icon: string;
  name: string;
}

export const NavItemComponent: FC<NavItem> = (nav: NavItem) => {
  return (
    <Menu.Item key={nav.name}>
      <Link to={nav.route}>
        <Icon type={nav.icon} />
        <span>{nav.name}</span>
      </Link>
    </Menu.Item>
  );
};
