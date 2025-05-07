import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Spin } from "antd";

const FlightResultsRedirect = () => {
  const router = useRouter();

  const [loadSpinner, setLoadSpinner] = useState(true);

  //   const [searchById, setSearchById] = useState(false);
  useEffect(() => {
    // Get the current url
    let urlString = window.location.href;

    // Get parameter and query strings
    let paramString = urlString.split("?")[1];
    let queryString = new URLSearchParams(paramString);

    // Check if the query parameter is present
    let checkQueryParam = queryString.has("flightRequestId");

    // Get the flightRequestId parameter from the query string
    if (checkQueryParam) {
      let flightRequestId = queryString.get("flightRequestId");
      // Invoke the payment verification request
      //   setSearchById(true);
      router.push("/flight-match?flightRequestId=" + flightRequestId);
      setLoadSpinner(false);
    }
  }, []);
  return (
    <>
      {loadSpinner && (
        <div
          className="center-spinner"
          style={{ textAlign: "center", margin: "150px auto" }}
        >
          <Spin size="large" />
        </div>
      )}
    </>
  );
};

export default FlightResultsRedirect;
