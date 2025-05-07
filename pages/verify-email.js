import React, { useState, useEffect } from "react";
import Head from "next/head";
import { Result } from "antd";
import { useVerifyEmail } from "../pages/api/apiClient";

function VerifyEmail() {
  const [successStatus, setSuccessStatus] = useState(false);
  const [verificationMsg, setVerificationMsg] = useState({});

  const verifyEmail = useVerifyEmail();

  useEffect(() => {
    // Get the current url
    let urlString = window.location.href;

    // Get parameter and query strings
    let paramString = urlString.split("?")[1];
    let queryString = new URLSearchParams(paramString);

    // Get the trxref parameter from the query string
    let userId = queryString.get("userId");
    // Get the reference parameter from the query string
    let emailToken = queryString.get("emailToken");
    // console.log("working");
    // Invoke the payment verification request
    async function emailVerifyAsync() {
      await verifyEmail({ userId: userId, emailToken: emailToken })
        .then((result) => {
          console.log(result);
          if (result.data.successful) {
            console.log("Verify Email Result:", result);

            // Set the success message
            setSuccessStatus(true);
            // Set the verification message
            setVerificationMsg({
              status: "success",
              title:
                "Your email has been successfully verified! You will be redirected to the login page shortly",
              subTitle: "",
            });
          } else {
            setSuccessStatus(true);

            setVerificationMsg({
              status: "error",
              title: "Invalid email verification token!",
              subTitle: "Please verify your email",
            });
          }
        })
        .catch((error) => {
          console.error("Email Verification Error:", error);
          setSuccessStatus(false);
          setVerificationMsg({
            status: "error",
            title: "Your email could not be verified!",
            subTitle: "Please try again later.",
          });
        });
    }

    emailVerifyAsync();
  }, []);

  return (
    <>
      <Head>
        <title>247Travels | Verify Email</title>
      </Head>
      <div>
        {successStatus && (
          <Result
            status={verificationMsg.status}
            title={verificationMsg.title}
            subTitle={verificationMsg.subTitle}
          />
        )}
      </div>
    </>
  );
}

export default VerifyEmail;
