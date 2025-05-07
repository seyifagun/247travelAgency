import React from "react";
import { useSelector } from "react-redux";
import FlightNotFoundComponent from "../components/FlightNotFound";
import API from "./api/apiClient";
import ApiRoutes from "./api/apiRoutes";

export const getStaticProps = async () => {
  const result = await API.get(ApiRoutes.FetchAirports);

  const airports = result.data.response;

  return {
    props: { airports: airports },
  };
};

const FlightNotFound = ({ airports }) => {
  let searchMeta = useSelector((state) => state.store.flightRequestMeta);
  return (
    <>
      <FlightNotFoundComponent airports={airports} searchMeta={searchMeta} />
    </>
  );
};

export default FlightNotFound;
