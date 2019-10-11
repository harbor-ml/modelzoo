import { NavItem } from "./Components/NavItem";

export const NavItems: NavItem[] = [
  { route: "/", name: "Home", icon: "home" },
  { route: "/catalog", name: "Catalog", icon: "appstore" },
  { route: "/monitor", name: "Monitor", icon: "monitor" },
  { route: "/register", name: "Register", icon: "edit" },
  { route: "/api", name: "API", icon: "api" },
  { route: "/contact", name: "Contact", icon: "contacts" }
];

export enum SemanticTag {
  Framework = "framework",
  Category = "category",
  InputType = "input_type",
  OutputType = "output_type"
}

export const TagToColor = {
  [SemanticTag.Framework]: "magenta",
  [SemanticTag.Category]: "gold",
  [SemanticTag.InputType]: "blue",
  [SemanticTag.OutputType]: "purple"
};
