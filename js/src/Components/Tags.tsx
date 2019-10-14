import { Tag } from "antd";
import _ from "lodash";
import React, { FC } from "react";
import { TagToColor } from "../Config";
import { ModelObject } from "../Utils/ProtoUtil";

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

interface TagsSetProp {
  model: ModelObject;
  showAll: boolean;
}

export const TagsSet: FC<TagsSetProp> = props => {
  let { model, showAll } = props;

  function KVsToTag(tags: Record<string, string[]>): Array<JSX.Element> {
    return _.compact(
      _.map(tags, (value, key) => {
        if (showAll || Object.keys(TagToColor).includes(key)) {
          return (
            <FeaturedModelTag
              name={key}
              val={_.join(value, ", ")}
              color={TagToColor[key]}
            ></FeaturedModelTag>
          );
        } else {
          return null;
        }
      })
    );
  }

  return <div>{KVsToTag(model.metadata)}</div>;
};
