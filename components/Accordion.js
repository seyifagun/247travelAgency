import React, { useState } from "react";
import { Collapse, Select, Form, Input } from "antd";
import { SettingOutlined } from "@ant-design/icons";

const { Panel } = Collapse;
const { Option } = Select;

function callback(key) {
  console.log(key);
}

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

const seat = `Seatmap is not available`;

const baggage = `Extra baggage is not available for the selected flight`;

const genExtra = () => (
  <SettingOutlined
    onClick={(event) => {
      // If you don't want click extra trigger collapse, you can prevent this:
      event.stopPropagation();
    }}
  />
);

const Accordion = () => {
  //   state = {
  //     expandIconPosition: 'left',
  //   };
  const [expandIconPosition, setExpandIconPosition] = useState("right");

  const onFinish = (values) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <>
      <Collapse
        defaultActiveKey={["1"]}
        onChange={callback}
        expandIconPosition={"right"}
        className="site-collapse-custom-collapse mt-5"
        bordered={false}
      >
        <Panel
          header="Choose A Seat"
          key="1"
          className="site-collapse-custom-panel"
        >
          <div>{seat}</div>
        </Panel>
        <Panel
          header="Add Extra Luggage"
          key="2"
          className="site-collapse-custom-panel"
        >
          <div>{baggage}</div>
        </Panel>
        <Panel
          header="Voucher or Discount Code"
          key="3"
          className="site-collapse-custom-panel"
        >
          <div>
          <Form
              name="basic"
              labelCol={{
                span: 24,
              }}
              wrapperCol={{
                span: 16,
              }}
              initialValues={{
                remember: true,
              }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <Form.Item
                label="Discount Code"
                name="username"
                rules={[
                  {
                    required: true,
                    message: "Please enter your Discount Code",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Form>
          </div>
        </Panel>
        <Panel
          header="Corporate Code"
          key="4"
          className="site-collapse-custom-panel"
        >
          <div>
            <Form
              name="basic"
              labelCol={{
                span: 24,
              }}
              wrapperCol={{
                span: 16,
              }}
              initialValues={{
                remember: true,
              }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <Form.Item
                label="Corporate Code"
                name="username"
                rules={[
                  {
                    required: true,
                    message: "Please enter your Corporate Code",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Form>
          </div>
        </Panel>
      </Collapse>
      <br />
    </>
  );
};

export default Accordion;
