import React, { useEffect, useState } from "react";
import { Layout, Menu, Button } from "antd";
import Image from "next/image";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import usernameIcon from "../public/icons/username.png";
import travellerIcon from "../public/icons/traveller.webp";
import travelerIcon from "../public/icons/Postal-code.png";
import creditcardIcon from "../public/icons/Credit-card.png";
import flightIcon from "../public/icons/flight-booking.webp";
import DeveloperNavbar from "../components/developerNavbarr";
import { EditOutlined } from "@ant-design/icons";
import PasswordIcon from "../public/icons/PasswordIcon.png";
import ProfileIcon from "../public/icons/username.png";
import Sidebar from "../components/Sidebar";

const { Header, Content, Sider } = Layout;

const AffiliatesProgram = () => {
  const router = useRouter();
  let loginCredentials = useSelector((state) => state.store.loginCredentials);
  let firstName;
  let lastName;
  let email;
  let phoneNumber;
  //   useEffect(() => {
  // console.log(loginCredentials);
  if (checkProperties(loginCredentials) == false) {
    if (checkProperties(loginCredentials.response) == true) {
      router.push("/access-comps/login");
      // console.log("working");
    } else {
      firstName = loginCredentials.response.firstName;
      lastName = loginCredentials.response.lastName;
      email = loginCredentials.response.email;
      phoneNumber = loginCredentials.response.phoneNumber;
      // console.log("not working");
    }
  } else {
    router.push("/access-comps/login");
  }
  //   });
  //   let loginCredentials = useSelector((state) => state.store.loginCredentials);
  //   console.log(loginCredentials);
  function checkProperties(obj) {
    for (var key in obj) {
      if (obj[key] !== null && obj[key] != "") return false;
    }
    return true;
  }

  return (
    <>
      <Head>
        <title>247Travels | Affiliate Profile</title>
      </Head>
      <div className="container developernavbar-classname">
        {/* <DeveloperNavbar /> */}
      </div>
      <Layout>
        <Sidebar />
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
              <div className="affiliate-profile-edit">
                <h5 className="profile-header">My Profile</h5>
                {/* <Link href="/flight-reg/edit-profile" as="affiliate/edit-profile" passHref>
                  <Button className="profile-edit-btn">
                    <EditOutlined /> Edit
                  </Button>
                </Link> */}
              </div>
              <div className="container">
                <div className="row">
                  <div className="col-sm-12 col-md-8">
                    <div className="profile-contact-container">
                      <h3 className="profile-prompt">Hey</h3>{" "}
                      <h3 className="profile-username">{firstName}</h3>
                      <p className="profile-comments">
                        Below are your profile details.
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
                <div className="input-edit-container">
                  <p className="profile-contact-info">Contact Information</p>

                  <div className="name-edit mt-3">
                    <p>Name</p>
                    <h4>
                      {firstName} {lastName}
                    </h4>
                  </div>
                  <div className="name-edit mt-3">
                    <p>Email Address</p>
                    <h4>{email}</h4>
                  </div>
                  <div className="name-edit mt-3">
                    <p>Phone Number</p>
                    <h4>{phoneNumber}</h4>
                  </div>
                </div>
              </div>
            </div>
          </Content>
        </Layout>
      </Layout>
    </>
  );
};

export default AffiliatesProgram;
