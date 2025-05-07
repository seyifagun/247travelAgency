
import React from "react";
import { Table, Tooltip, columns, data } from "antd";
import { Menu, Dropdown, Button, Space, Divider, Modal } from "antd";
import styles from "../styles/searchHistory.module.css";
import { Table as TableAnt } from "antd";
import DeveloperNavbar from "../components/developerNavbarr";

import { ExclamationCircleOutlined } from "@ant-design/icons";
// import { DownOutlined, UserOutlined} from '@ant-design/icons';

const TransactionHistory = () => {
  const { confirm } = Modal;

  function showConfirm() {
    confirm({
      title: "Add new B2B",
      icon: <ExclamationCircleOutlined />,
      content: "FORM TABLE",

      onOk() {
        console.log("Save");
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  }

  const data = [
    {
      key: "1",

      name: "John Brown",
      company: "xown",
      role: "Sales Manager",
      status: "nil",
      date: "jan",
    },
    {
      key: "2",
      name: "John Brown",
      company: "xown",
      role: "Sales Manager",
      status: "nil",
      date: "jan",
    },
    {
      key: "3",
      name: "John Brown",
      company: "xown",
      role: "Sales Manager",
      status: "nil",
      date: "jan",
    },
    {
      key: "4",
      name: "John Brown",
      company: "xown",
      email: "",
      role: "Sales Manager",
      phone: "",
      status: "nil",
      date: "jan",
      login: "",
    },
    {
      key: "5",
      name: "John Brown",
      company: "xown",
      role: "Sales Manager",
      status: "nil",
      date: "jan",
    },
  ];

  return (
    <>
    <div className="container">
    <DeveloperNavbar />
      <Space wrap style={{display: "none"}}>
        <Button onClick={showConfirm}>Add new B2B</Button>
      </Space>
      <div>
          <h3 style={{color:"#0043a4", marginBottom:"0", marginTop:"3rem"}}>Booking History</h3>
      </div>

      <Divider orientation="left"></Divider>

      <Table bordered dataSource={data}>
        <Table.Column key="sn" title="S/N" dataIndex="sn" />

        <Table.Column key="airline"  title= "Airline" dataIndex="airline" />
        {/* ****1*** */}
        <Table.Column
          key="airline"
          title="Airline"
          dataIndex="airline"
        />

        <Table.Column key="id" title="ID" dataIndex="id" />

        <Table.Column
          key="id"
          title="ID"
          dataIndex="id"
        />

        <Table.Column
          key="pnr"
          title="PNR"
          dataIndex="pnr"
        />
        <Table.Column
          key="origin"
          title="Origin"
          dataIndex="origin"
        />
        <Table.Column
          key="destination"
          title="Destination"
        />

        <Table.Column
          key="no_of_traveler"
          title="Number of Traveller"
          />       
        <Table.Column
          key="total_amount"
          title="Total Amount"
         
        />
      </Table>
    </div>
    </>
  );
};

export default TransactionHistory;
