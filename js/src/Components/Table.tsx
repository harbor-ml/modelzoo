import { Table } from "antd";
import { ColumnProps } from "antd/lib/table";
import _ from "lodash";
import { Table as pb_Table } from "js/generated/modelzoo/protos/model_apis_pb";
import React, { FC } from "react";

interface TableOutputProps {
  tableProto: pb_Table;
}
export const TableOutput: FC<TableOutputProps> = props => {
  let { tableProto } = props;

  let antColumns: Array<
    ColumnProps<string>
  > = tableProto.getColumnNamesList().map((val, idx, arr) => {
    return { key: idx, title: val.toUpperCase(), dataIndex: val };
  });

  let dataSource = tableProto.toObject().tableMap.map((val, idx, arr) => {
    console.log(val);
    let rowName = val[0];
    let rowData = val[1];
    let [rowKeys, rowVals] = _.zip(...rowData.columnToValueMap)!;
    let flattendObject = _.zipObject(_.compact(rowKeys), _.compact(rowVals));
    flattendObject.key = rowName;
    return flattendObject;
  });

  return (
    <Table
      style={{ background: "white" }}
      columns={antColumns}
      dataSource={dataSource as any}
      pagination={{ pageSize: 10 }}
    ></Table>
  );
};
