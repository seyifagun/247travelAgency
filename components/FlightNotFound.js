import React from "react";
import Image from "next/image";
import flightNotFound from "../public/error/flight-not-found.png";
import FlightNavBar from "./flightnav-bar";
import { useSelector } from "react-redux";

const FlightNotFound = ({ airports, searchMeta }) => {
  // Get the search meta
  // let searchMeta = useSelector((state) => state.store.flightRequestMeta);

  // Set the flight search credentials
  const flightRequest = searchMeta.searchCredentials;

  let lastOriginDestination;

  if (flightRequest.originDestinations.length <= 2) {
    lastOriginDestination = 0;
  } else {
    lastOriginDestination = flightRequest.originDestinations.length - 1;
  }

  function getCabinClass(cabin) {
    switch (cabin) {
      case "PREMIUM_ECONOMY":
        return "Premium Economy";
      case "ECONOMY":
        return "Economy";
      case "BUSINESS":
        return "Business";
      case "FIRST":
        return "First";
      default:
        break;
    }
  }

  return (
    <>
      <div className="container">
        <FlightNavBar
          getCabinClass={() => getCabinClass(cabin)}
          airports={airports}
          searchMeta={searchMeta}
        />
        <div className="error-div">
          <Image src={flightNotFound} alt={"Error-404-Img"} />
          <div style={{ textAlign: "center" }}>
            <h3 className="error-header">Flight Not Found</h3>
            <p className="error-detail">
              We have searched several airlines and could not find availble
              flights from{" "}
              <span className="inputData">
                {flightRequest.originDestinations[0].originLocationCode}
              </span>{" "}
              to{" "}
              <span className="inputData">
                {
                  flightRequest.originDestinations[lastOriginDestination]
                    .destinationLocationCode
                }
              </span>{" "}
              from
              <span className="inputData">
                {" "}
                &nbsp;
                {new Date(
                  flightRequest.originDestinations[0].departureDateTimeRange.date
                ).getDate() +
                  " " +
                  new Date(
                    flightRequest.originDestinations[0].departureDateTimeRange.date
                  ).toLocaleString("default", { month: "long" }) +
                  ", " +
                  new Date(
                    flightRequest.originDestinations[0].departureDateTimeRange.date
                  ).getFullYear()}
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default FlightNotFound;
