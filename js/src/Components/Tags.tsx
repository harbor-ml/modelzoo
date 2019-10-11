import React, { FC } from "react";
import { Tag } from "antd";

interface FeatureModelTagProp {
  name: string;
  val: string;
  color: string;
}

export const FeaturedModelTag: FC<FeatureModelTagProp> = props => {
  let { name, val, color } = props;

  return (
    <Tag color={color}>
      <b>{name}:</b>
      {val}
    </Tag>
  );
};
