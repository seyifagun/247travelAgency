import { useEffect, useState } from "react";
import { Layout, Menu, Space, Button, Divider, Table } from "antd";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";
import usernameIcon from "../../public/icons/username.webp";
import travellerIcon from "../../public/icons/traveller.webp";
import creditcardIcon from "../../public/icons/credit-card.webp";
import flightIcon from "../../public/icons/flight-booking.webp";
import DeveloperNavbar from "../../components/developerNavbarr";
import PasswordIcon from "../../public/icons/PasswordIcon.png";
import ProfileIcon from "../../public/icons/username.png";
import Sidebar from "../../components/Sidebar";
import { useFetchReservation } from "../api/apiClient";

const AffiliatesProgram = () => {
  const { Header, Content, Footer, Sider } = Layout;
  // variables
  const fetchReservation = useFetchReservation();

  // states
  const [reservations, setReservations] = useState([]);

  // functions
  useEffect(() => {
    async function fetchReservationsAsync() {
      await fetchReservation()
        .then((result) => {
          setReservations(result.data.response);
          // console.log(result.data.response);
          return;
        })
        .catch((error) => {
          console.error("Flight Error:", error);
        });
    }
    fetchReservationsAsync();
  }, []);

  const columns = [
    {
      title: "Flight Order ID",
      dataIndex: "flightOrderId",
      key: "1",
    },
    {
      title: "Reservation ID",
      dataIndex: "reservationId",
      key: "2",
    },
    {
      title: "Reservation date",
      dataIndex: ["reservationDate"],
      key: "3",
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
      title: "Base Price",
      dataIndex: ["basePrice"],
      key: "4",
      render: (text, record) => (
        <>
          {parseFloat(text).toLocaleString("en-NG", {
            style: "currency",
            currency: "NGN",
          })}
        </>
      ),
    },
    {
      title: "Taxes and Fees",
      dataIndex: ["taxesAndFees"],
      key: "5",
      render: (text, record) => (
        <>
          {parseFloat(text).toLocaleString("en-NG", {
            style: "currency",
            currency: "NGN",
          })}
        </>
      ),
    },
    {
      title: "Total Price",
      dataIndex: ["totalPrice"],
      key: "6",
      render: (text, record) => (
        <>
          {parseFloat(text).toLocaleString("en-NG", {
            style: "currency",
            currency: "NGN",
          })}
        </>
      ),
    },
  ];
  return (
    <>
      <Head>
        <title>247Travels | Flight Booking</title>
      </Head>
      <div className="container developernavbar-classname"></div>
      <Layout>
        <Sidebar />
        <Layout>
          <Header
            className="site-layout-sub-header-background"
            style={{ padding: 0 }}
          />

          {/* Show this when the user has no booking history */}
          {/* <Content className="container" style={{ margin: "10px 50px 0" }}>
            <div
              className="site-layout-background"
              style={{ padding: 24, minHeight: 360 }}
            >
              <h5 className="profile-header">Booking History</h5>
              <div className="container">
                <div className="row">
                  <div className="col-sm-12 col-md-8">
                    <div className="profile-contact-container">
                      <h3 className="profile-prompt">No </h3>{" "}
                      <h3 className="profile-username">Bookings Yet!</h3>
                      <p className="profile-comments">
                        Do not have any bookings? Search and book flight for
                        your next trip
                      </p>
                    </div>
                  </div>
                  <div className="col-sm-12 col-md-4">
                    <div className="ad-container">
                      <p>Advertisement</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="container">
                <div className="travel-input-btn">
                  <Link href="\" passHref>
                    <button
                      type="button"
                      className="btn btn-outline-primary travelers-btn-custom book-flight "
                    >
                      {" "}
                      + Book a Flight
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </Content> */}
          <Content className="container" style={{}}>
            {/* <DeveloperNavbar /> */}
            {/* <Space wrap style={{ display: "none" }}>
              <Button onClick={showConfirm}>Add new B2B</Button>
            </Space> */}
            <div>
              <h3
                style={{
                  color: "#0043a4",
                  marginBottom: "0",
                  marginTop: "3rem",
                }}
              >
                Reservation History
              </h3>
            </div>

            <Divider orientation="left"></Divider>

            <Table bordered dataSource={reservations} columns={columns}></Table>
          </Content>
        </Layout>
      </Layout>
    </>
  );
};

export default AffiliatesProgram;
