import React, { FC } from "react";

export const Monitor: FC = () => {
  return (
    <div style={{ background: "yellow" }}>{Array(100).fill(<br></br>)}</div>
  );
};
