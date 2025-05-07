import { Layout, Menu } from "antd";
import React, { useState } from "react";
import { Modal } from "antd";
import Link from "next/link";
import Image from "next/image";
import Creditcard from "../components/card-modal/creditcard";
import usernameIcon from "../public/icons/username.webp";
import travellerIcon from "../public/icons/traveller.webp";
import travelerIcon from "../public/icons/Postal-code.png";
import creditcardIcon from "../public/icons/Credit-card.png";
import flightIcon from "../public/icons/flight-booking.webp";
import PasswordIcon from "../public/icons/PasswordIcon.png";
import ProfileIcon from "../public/icons/username.png";

const { Header, Content, Sider } = Layout;
const Sidebar = () => {
  // states
  const [selectedKeys, setSelectedKeys] = useState("1");
  const [newCreditDialog, setNewCreditDialog] = useState(false);

  //   functions
  const updateActiveMenu = (key) => {
    setSelectedKeys(key);
  };

  return (
    <>
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
        <Menu theme="" mode="inline" defaultSelectedKeys={[selectedKeys]}>
          <Menu.Item key="1">
            <Image src={ProfileIcon} alt={"username icon"} />
            <Link
              href="/affiliate-program"
              passHref
              onClick={() => updateActiveMenu(1)}
            >
              <h5>Profile</h5>
            </Link>
          </Menu.Item>

          <Menu.Item key="2">
            <Image
              src={travelerIcon}
              alt={"travellers icon"}
              width={25}
              height={20}
            />
            <Link href="/flight-reg/search-history" passHref onClick={() => updateActiveMenu(2)}>
              {/* <Link href="/flight-reg/travelers" passHref> */}
              <h5>Search History</h5>
            </Link>
          </Menu.Item>

          <Menu.Item key="3">
            <Image src={flightIcon} alt={"flight icon"} />
            <Link
              href="/flight-reg/flight-book"
              passHref
              onClick={() => updateActiveMenu(3)}
            >
              <h5>Reservation History </h5>
            </Link>
          </Menu.Item>

          <Menu.Item key="4">
            <Image src={creditcardIcon} alt={"credit card icon"} />
            {/* <Link href="#" passHref> */}
            <Link
              href="/flight-reg/transaction-history"
              passHref
              onClick={() => updateActiveMenu(4)}
            >
              <h5> Bookings History </h5>
            </Link>
          </Menu.Item>

          {/* <Menu.Item key="4">
            <Image src={creditcardIcon} alt={"credit card icon"} />
            <Link
              href="/flight-reg/transaction-history"
              passHref
              onClick={() => updateActiveMenu(4)}
            >
              <h5> Developer API</h5>7
            </Link>
          </Menu.Item> */}

          <Menu.Item key="5">
            <Image src={PasswordIcon} alt={"Password-icon"} />
            <Link
              href="/flight-reg/change-password"
              passHref
              onClick={() => updateActiveMenu(5)}
            >
              <h5> Change Password </h5>
            </Link>
          </Menu.Item>
        </Menu>
      </Sider>
    </>
  );
};

export default Sidebar;
