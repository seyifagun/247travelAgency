import { Layout, Menu } from "antd";
import React, { useState } from "react";
import { Modal } from "antd";
import Link from "next/link";
import Image from "next/image";
import Creditcard from "../../components/card-modal/creditcard";
import usernameIcon from "../../public/icons/username.webp";
import travellerIcon from "../../public/icons/traveller.webp";
import travelerIcon from "../../public/icons/Postal-code.png";
import creditcardIcon from "../../public/icons/Credit-card.png";
import flightIcon from "../../public/icons/flight-booking.webp";
import PasswordIcon from "../../public/icons/PasswordIcon.png";
import ProfileIcon from "../../public/icons/username.png";

const { Header, Content, Sider } = Layout;

const Credit = () => {
  const [newCreditDialog, setNewCreditDialog] = useState(false);

  function createNewCreditProfile() {
    console.log("Create Credit Card Profile");
  }
  return (
    <>
      <Layout>
        <Sider
          breakpoint="lg"
          collapsedWidth="0"
          onBreakpoint={(broken) => {
            console.log(broken);
          }}
          onCollapse={(collapsed, type) => {
            console.log(collapsed, type);
          }}
        >
          <div className="logo">
            <h5 className="sidebar-header">My Account</h5>
          </div>
          <Menu theme="" mode="inline" defaultSelectedKeys={["4"]}>
            <Menu.Item key="1">
              <Image src={ProfileIcon} alt={"username icon"} />
              <Link href="/affiliate-program" passHref>
                <h5>Profile</h5>
              </Link>
            </Menu.Item>
            <Menu.Item key="2">
              <div className="menu-item-wrapper">
                <Image src={travelerIcon} alt={"travellers icon"} width={25} height={20} />
                <Link href="/flight-reg/travelers" passHref>
                  <h5>Travelers</h5>
                </Link>
              </div>
            </Menu.Item>
            {/* <Menu.Item key="3">
              <Image src={flightIcon} alt={"flight icon"} />{" "}
              <Link href="/flight-reg/flight-book" passHref>
                <h5> Flight Bookings </h5>
              </Link>
            </Menu.Item> */}
            <Menu.Item key="4">
              <Image src={creditcardIcon} alt={"credit card icon"} />{" "}
              <Link href="/flight-reg/credit-card" passHref>
                <h5> Credit Card </h5>
              </Link>
            </Menu.Item>
            <Menu.Item key="5">
              <Image src={PasswordIcon} alt={"Password-icon"} />
              <Link href="/flight-reg/change-password" passHref>
                <h5> Change Password </h5>
              </Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Header
            className="site-layout-sub-header-background"
            style={{ padding: 0 }}
          />
          <Content className="container" style={{ margin: "10px 50px 0" }}>
            <div
              className="site-layout-background"
              style={{ padding: 24, minHeight: 360 }}
            >
              <h5 className="profile-header">Credit Card Information</h5>
              <div className="container">
                <div className="row">
                  <div className="col-sm-12 col-md-8">
                    <div className="profile-contact-container">
                      <h3 className="profile-prompt">No </h3>{" "}
                      <h3 className="profile-username">Credit Card Added!</h3>
                      <p className="profile-comments">
                        Save multiple credit cards for your company. Just add
                        your CVV on checkout when booking flights
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
                  <button
                    type="button"
                    onClick={() => setNewCreditDialog(true)}
                    className="btn btn-outline-primary travelers-btn-custom"
                  >
                    + Add New Card
                  </button>
                </div>
              </div>
            </div>
          </Content>
        </Layout>
      </Layout>
      <Modal
        title="Add New Credit Card"
        width={700}
        centered
        open={newCreditDialog}
        footer={null}
        onOk={createNewCreditProfile}
        onCancel={() => setNewCreditDialog(false)}
      >
        <Creditcard />
      </Modal>
    </>
  );
};

export default Credit;
