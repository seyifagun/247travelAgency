
import React from "react";
import { Table, Tooltip, columns, data } from "antd";
import { Menu, Dropdown, Button, Space, Divider, Modal } from "antd";
import styles from "../styles/searchHistory.module.css";
import { Table as TableAnt } from "antd";
import DeveloperNavbar from "../components/developerNavbarr";
import { ExclamationCircleOutlined } from "@ant-design/icons";
// import { DownOutlined, UserOutlined} from '@ant-design/icons';

const SearchHistory = () => {
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
          <h3 style={{color:"#0043a4", margin:"2rem 0 0 0"}}>Saved Search History</h3>
      </div>

      <Divider orientation="left"></Divider>

      <Table bordered dataSource={data}>
        <Table.Column key="sn" title="S/N" dataIndex="sn" />

        <Table.Column key="name"  title= "Airline" dataIndex="name" />
        {/* ****1*** */}
        <Table.Column
          key="airline"
          title="Airline"
          dataIndex="airline"
        />

        <Table.Column key="email" title="Email-Address" dataIndex="email" />

        <Table.Column
          key="role"
          title="Role"
          dataIndex="role"
        />

        <Table.Column
          key="phone"
          title="Phone"
          dataIndex="phone"
        />
        <Table.Column
          key="status"
          title="Status"
          dataIndex="status"
        />
        <Table.Column
          key="date"
          title="Date Created"
        />

        <Table.Column
          key="login"
          title="last Login"
        />
      </Table>
    </div>
    </>
  );
};

export default SearchHistory;
