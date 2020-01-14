import { Tag, Typography, Statistic } from "antd";
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

  if (name.endsWith("_url") || name.startsWith("metric_")) {
    return <div></div>;
  }

  return (
    <Tag color={color}>
      <Typography.Text strong style={{ fontSize: "1.2x" }}>
        {name}:
      </Typography.Text>

      {name.endsWith("_link") ? <a href={val}>{val}</a> : val}
    </Tag>
  );
};

interface TagsSetProp {
  model: ModelObject;
  showAll: boolean;
}

export const StatsSet: FC<TagsSetProp> = props => {
  let { model } = props;

  function KVsToStats(tags: Record<string, string[]>): Array<JSX.Element> {
    return _.compact(
      _.map(tags, (value, key) => {
        if (key.toString().startsWith("metric_")) {
          let split = key.toString().split("_");
          let metricUnit = split.pop();
          let metricName = split
            .slice(1)
            .map((val, idx, arr) => _.upperFirst(val))
            .join(" ");

          return (
            <Statistic
              key={metricName}
              title={metricName}
              suffix={metricUnit}
              value={value.toString()}
            ></Statistic>
          );
        }
      })
    );
  }

  return <div>{KVsToStats(model.metadata)}</div>;
};

export const TagsSet: FC<TagsSetProp> = props => {
  let { model, showAll } = props;

  function KVsToTag(tags: Record<string, string[]>): Array<JSX.Element> {
    return _.compact(
      _.map(tags, (value, key) => {
        if (showAll || Object.keys(TagToColor).includes(key)) {
          return (
            <FeaturedModelTag
              key={key}
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
