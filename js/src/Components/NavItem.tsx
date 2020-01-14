import React, { FC } from "react";
import { Menu, Icon } from "antd";
import { Link } from "react-router-dom";

export interface NavItem {
  route: string;
  icon: string;
  name: string;
  addEffect?: boolean;
}

export const NavItemComponent: FC<NavItem> = (nav: NavItem) => {
  const { addEffect } = nav;
  let nameField = <span>{nav.name}</span>;
  if (addEffect !== undefined && addEffect) {
    nameField = <span style={{
      fontFamily: "Josefin Sans",
      fontStyle: "italic",
      fontSize: "larger"
    }}>{nav.name}</span >
  }
  return (
    <Menu.Item key={nav.name}>
      <Link to={nav.route}>
        <Icon type={nav.icon} />
        {nameField}
      </Link>
    </Menu.Item>
  );
};
