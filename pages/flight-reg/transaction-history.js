import React, { useEffect, useState } from "react";
import {
  Menu,
  Dropdown,
  Button,
  Space,
  Divider,
  Modal,
  Layout,
  Table,
  Tooltip,
  columns,
  data,
} from "antd";
// import styles from "../styles/searchHistory.module.css";
import styles from "../../styles/searchHistory.module.css";
import DeveloperNavbar from "../../components/developerNavbarr";
// import DeveloperNavbar from "../../components/developerNavbarr";
import { ExclamationCircleOutlined } from "@ant-design/icons";
// import { DownOutlined, UserOutlined} from '@ant-design/icons';
import Sidebar from "../../components/Sidebar";
import { useFetchPayment } from "../api/apiClient";

const TransactionHistory = () => {
  const { Header, Content, Sider } = Layout;
  const { confirm } = Modal;

  // variables
  const fetchPayments = useFetchPayment();

  // states
  const [paymentsHistory, setPaymentsHistory] = useState([]);

  // functions
  useEffect(() => {
    async function fetchPaymentsAsync() {
      await fetchPayments()
        .then((result) => {
          setPaymentsHistory(result.data.response);
          console.log(result.data.response);
          return;
        })
        .catch((error) => {
          console.error("Flight Error:", error);
        });
    }
    fetchPaymentsAsync();
  }, []);

  const columns = [
    {
      title: "Origin",
      dataIndex: ["flightSearchCredentials"],
      key: "1",
      render: (text, record) => (
        <>{text.originDestinations[0].originLocationCode}</>
      ),
    },
    {
      title: "Destination",
      dataIndex: ["flightSearchCredentials"],
      key: "2",
      render: (text, record) => (
        <>{text.originDestinations[0].destinationLocationCode}</>
      ),
    },
    {
      title: "Departure date",
      dataIndex: ["flightSearchCredentials"],
      key: "3",
      render: (text, record) => (
        <>{text.originDestinations[0].departureDateTimeRange.date}</>
      ),
    },
    {
      title: "Cabin",
      dataIndex: ["flightSearchCredentials"],
      key: "5",
      render: (text, record) => (
        <>{text.searchCriteria.flightFilters.cabinRestrictions[0].cabin}</>
      ),
    },
    {
      title: "Date Created",
      dataIndex: "dateCreated",
      key: "6",
    },
    {
      title: "Search Link",
      dataIndex: "requestId",
      key: "7",
      render: (text, record) => (
          <a
            target="__blank"
            href={`https://test.247travels.com/flight-match?flightRequestId=${text}`}
          >
            Click link to search
          </a>
      ),
    },
  ];

  return (
    <>
      <Layout>
        <Sidebar />
        <Layout>
          <Header
            className="site-layout-sub-header-background"
            style={{ padding: 0 }}
          />
          <Content className="container" style={{}}>
            {/* <DeveloperNavbar /> */}

            <div>
              <h3
                style={{
                  color: "#0043a4",
                  marginBottom: "0",
                  marginTop: "3rem",
                }}
              >
                Payment/Booking History
              </h3>
            </div>

            <Divider orientation="left"></Divider>

            <Table
              bordered
              dataSource={paymentsHistory}
              columns={columns}
            ></Table>
          </Content>
        </Layout>
      </Layout>
    </>
  );
};

export default TransactionHistory;
