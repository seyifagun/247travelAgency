import React, { useState, useEffect } from "react";
import Head from "next/head";
import { Result } from "antd";

function CheckVerification() {
  // const [SuccessPage, setReservationResult] = useState({});

  return (
    <>
      <Head>
        <title>247Travels | Check Verification Email</title>
      </Head>
      <Result
        status="success"
        title="Your Account has been successfully created! Kindly check your email for the verification link"
        subTitle="Please click the link to verify as soon as possible, so it doesn't expire."
      />
    </>
  );
}

export default CheckVerification;
