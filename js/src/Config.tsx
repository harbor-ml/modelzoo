import { NavItem } from "./Components/NavItem";

export const NavItems: NavItem[] = [
  { route: "/", name: "Modelzoo", icon: "home", addEffect: true },
  // { route: "/catalog", name: "Catalog", icon: "appstore" },
  // { route: "/monitor", name: "Monitor", icon: "monitor" },
  { route: "/register", name: "Register", icon: "edit" },
  { route: "/api", name: "API", icon: "api" },
  // { route: "/contact", name: "Contact", icon: "contacts" },
  { route: "/compare", name: "Compare", icon: "block" }
];

export const TagToColor: Record<string, string> = {
  framework: "magenta",
  category: "cyan",
  input_type: "blue",
  output_type: "purple",
  service_type: "green"
};

// TODO: use upsplash /daily?search_term API
export const DefaultImages: string[] = [
  "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80",
  "https://images.unsplash.com/photo-1507146426996-ef05306b995a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80"
];
