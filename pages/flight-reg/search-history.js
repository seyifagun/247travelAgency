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
  data,
} from "antd";
// import styles from "../styles/searchHistory.module.css";
import styles from "../../styles/searchHistory.module.css";
import DeveloperNavbar from "../../components/developerNavbarr";
// import DeveloperNavbar from "../../components/developerNavbarr";

import { ExclamationCircleOutlined } from "@ant-design/icons";
// import { DownOutlined, UserOutlined} from '@ant-design/icons';
import Sidebar from "../../components/Sidebar";
import { useFetchSavedSearch } from "../api/apiClient";

const { Header, Content, Sider } = Layout;

const SearchHistory = () => {
  // variables
  const fetchSavedSearch = useFetchSavedSearch();

  // states
  const [savedSearchData, setSavedSearchData] = useState([]);

  // destructuring
  const { confirm } = Modal;

  // functions
  useEffect(() => {
    async function fetchSavedSearchAsync() {
      await fetchSavedSearch()
        .then((result) => {
          setSavedSearchData(result.data.response);
          // console.log(result.data.response);
          return;
        })
        .catch((error) => {
          console.error("Flight Error:", error);
        });
    }
    fetchSavedSearchAsync();
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
      render: (text, record) => {
        let formattedDate = new Date(
          text.originDestinations[0].departureDateTimeRange.date
        );
        return (
          <>
            {formattedDate.getDate()}{" "}
            {formattedDate.toLocaleString("default", {
              month: "short",
            })}{" "}
            {formattedDate.getFullYear()}
          </>
        );
      },
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
      dataIndex: ["dateCreated"],
      key: "6",
      render: (text, record) => {
        let formattedDate = new Date(text);
        return (
          <>
            {formattedDate.getDate()}{" "}
            {formattedDate.toLocaleString("default", {
              month: "short",
            })}{" "}
            {formattedDate.getFullYear()}
          </>
        );
      },
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
            <div>
              <h3
                style={{
                  color: "#0043a4",
                  marginBottom: "0",
                  marginTop: "3rem",
                }}
              >
                Search History
              </h3>
            </div>

            <Divider orientation="left"></Divider>

            <Table bordered dataSource={savedSearchData} columns={columns} />
          </Content>
        </Layout>
      </Layout>
    </>
  );
};
export default SearchHistory;
