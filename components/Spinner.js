import React from "react";
import { Spin } from 'antd';

const Spinner = (props) => {
  return (
    <>
      <Spin size={props.size} />
    </>
  );
};

export default Spinner;
