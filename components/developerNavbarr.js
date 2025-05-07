import React, { useState } from "react";
import { Menu } from "antd";
import Link from "next/link";

const DeveloperNavbar = () => {
  const [current, setCurrent] = useState("mail");

  const handleClick = (e) => {
    console.log("click ", e);
    setCurrent({ current: e.key });
  };

  return (
    <>
      <Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal">
        <Menu.Item key="alipay">
          <Link href="/affiliate-program" passHref>
            {/* <Link href="/B2bIndex" passHref> */}
            {/* <a
              href=""
              target="_blank"
              rel="noopener noreferrer" className="developernavbar-link"
            > */}
            Home
            {/* </a> */}
          </Link>
        </Menu.Item>
        <Menu.Item key="transactionHistory">
          <Link href="/transactionHistory" passHref>
            <a className="developernavbar-link">Transaction History</a>
          </Link>
        </Menu.Item>
        <Menu.Item key="userProfile">
          <Link href="#" passHref>
            {/* <Link href="/userProfile" passHref> */}
            <a className="developernavbar-link">User Profile</a>
          </Link>
        </Menu.Item>
        <Menu.Item key="developerAPI">
          <Link href="/developerAPI" passHref>
            <a className="developernavbar-link">Developer API</a>
          </Link>
        </Menu.Item>
        <Menu.Item key="searchHistory">
          <Link href="#" passHref>
            {/* <Link href="/searchHistory" passHref> */}
            <a className="developernavbar-link">Search History</a>
          </Link>
        </Menu.Item>
      </Menu>
    </>
  );
};

export default DeveloperNavbar;
