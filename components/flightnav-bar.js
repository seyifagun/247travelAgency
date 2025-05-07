import React, { useState, useEffect } from "react";
import { Drawer, Space } from "antd";
import { Button as ButtonAnt } from "antd";
import Link from "next/link";
import styles from "../styles/flightNavBar.module.css";
import Image from "next/image";
import Button from "react-bootstrap/Button";
import toFro from "../public/icons/to-fro.webp";
import DrawerOneway from "../components/DrawerOneway";
import DrawerRoundtrip from "../components/DrawerRoundtrip";
import DrawerMultiCity from "../components/DrawerMultiCity";
import { Form as FormAnt } from "antd";
import { useSelector } from "react-redux";
import RouteModel from "./routeModel";
import FlightMatchNav from "./FlightMatchNav";
import SearchPanelModify from "./SearchPanelModify";

const FlightNavBar = ({ getCabinClass, airports }) => {
  const [flightSearchForm] = FormAnt.useForm();

  function onOriginLocationSelected(originLocation) {
    console.log(originLocation.itemData);
    flightSearchForm.setFieldsValue({
      takeOffAirport: originLocation.itemData.iataCode,
    });
    flightSearchForm.setFieldsValue({
      originLocationCityCode: `${originLocation.itemData.city} (${originLocation.itemData.iataCode})`,
    });
  }

  function onDestinationLocationSelected(originLocation) {
    console.log(originLocation.itemData);
    flightSearchForm.setFieldsValue({
      destinationAirport: originLocation.itemData.iataCode,
    });
    flightSearchForm.setFieldsValue({
      originDestinationCityCode: `${originLocation.itemData.city} (${originLocation.itemData.iataCode})`,
    });
  }

  const [visibleDrawer, setVisibleDrawer] = useState(false);
  const [placement, setPlacement] = useState("top");

  const showDrawer = () => {
    setVisibleDrawer(true);
  };

  const onClose = () => {
    setVisibleDrawer(false);
  };

  // Get the search meta
  let searchMeta = useSelector((state) => state.store.flightRequestMeta);

  // Set the flight search credentials
  const flightRequest = JSON.parse(searchMeta.flightRequest);

  // console.log(searchMeta);

  const setSelectedFlightOffer = useSelector((state) =>
    state.store.flightResults.offerInfos.slice(0, 1)
  );

  const setSelectedFlightType = useSelector(
    (state) => state.store.flightRequestMeta
  );

  // console.log("one time", flightRequest);

  // console.log("second time", setSelectedFlightType);

  let departureData;
  let arrivalData;
  let objectId = "";

  // departure Date
  let departureTravellingDay = "";

  let departureTravellingMonth = "";

  let departureTravellingYear = "";
  // End departure Date

  // Arrival Date
  let arrivalTravellingDay = "";

  let arrivalTravellingMonth = "";

  let arrivalTravellingYear = "";
  // end Arrival Date

  // Set the search rows
  const searchRows = JSON.parse(setSelectedFlightType.searchRows);

  // True if we have at least one active search row
  const _activeSearchRow = searchRows?.some(row => row.active);

  if (setSelectedFlightType.routeModel == RouteModel.MultiCity) {

    // If we have any visible search row...
    if (searchRows.some(row => row.active)) {
      // Get the index of the last visible row
      let index = searchRows.map(value => value.active).lastIndexOf(true);
      // Get the id of the last visible row by the index
      objectId = (searchRows[index].id).toString();

      // Set the arrival details from the last row
      arrivalData = airports.find(
        (value) => value.iataCode == flightRequest[`originDestinationCityCode${objectId}`]
      );

      // Set the arrival date from the last row
      arrivalTravellingDay = new Date(flightRequest[`departureDate${objectId}`]).getDate();

      // Set the arrival month from the last row
      arrivalTravellingMonth = new Date(
        flightRequest[`departureDate${objectId}`]
      ).toLocaleString("default", { month: "short" });

      // Set the arrival year from the last row
      arrivalTravellingYear = new Date(
        flightRequest[`departureDate${objectId}`]
      ).getFullYear();
    }
    // Otherwise...
    else {

      // Set the arrival details from the last row
      arrivalData = airports.find(
        (value) => value.iataCode == flightRequest.originDestinationCityCode1
      );
    }

    // Get departure details
    departureData = airports.find(
      (value) => value.iataCode == flightRequest.originLocationCityCode1
    );

    departureTravellingDay = new Date(
      flightRequest.departureDate1
    ).getDate();

    departureTravellingMonth = new Date(
      flightRequest.departureDate1
    ).toLocaleString("default", { month: "short" });

    departureTravellingYear = new Date(
      flightRequest.departureDate1
    ).getFullYear();
    // End departure Date

    // end Arrival Date
  } else {
    // get departure details
    departureData = airports.find(
      (value) => value.iataCode == flightRequest.originLocationCityCode
    );

    // get arrival details
    arrivalData = airports.find(
      (value) => value.iataCode == flightRequest.originDestinationCityCode
    );

    // departure Date
    departureTravellingDay = new Date(
      flightRequest.departureDate
    ).getDate();

    departureTravellingMonth = new Date(
      flightRequest.departureDate
    ).toLocaleString("default", { month: "short" });

    departureTravellingYear = new Date(
      flightRequest.departureDate
    ).getFullYear();
    // End departure Date

    // Arrival Date
    arrivalTravellingDay = new Date(flightRequest.returningDate).getDate();

    arrivalTravellingMonth = new Date(
      flightRequest.returningDate
    ).toLocaleString("default", { month: "short" });

    arrivalTravellingYear = new Date(
      flightRequest.returningDate
    ).getFullYear();
    // end Arrival Date
  }

  // get traveller pricing data
  const adultCount = flightRequest.numberOfAdults;
  const childCount = flightRequest.numberOfChildren;
  const seatedInfantCount = flightRequest.numberOfInfants;

  const cabin = flightRequest.flightClass;

  let flightStop = searchMeta.routeModel;

  let directFlightValue = flightStop === 1 ? true : false;

  const [formVisibility, setFormVisibility] = useState(false);

  const [directFlight] = useState(directFlightValue);

  const showFormDiv = () => {
    setFormVisibility(!formVisibility);

  };

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

  let modifyDrawer;

  if (searchMeta.routeModel == RouteModel.OneWay) {
    modifyDrawer = (
      // <DrawerOneway
      //   className="modifyform-animation"
      //   airports={airports}
      //   departureData={departureData}
      //   arrivalData={arrivalData}
      //   cabin={cabin}
      //   flightRequestData={flightRequest}
      //   directFlight={directFlight}
      // />
      <SearchPanelModify
        airports={airports}
        searchMeta={searchMeta}
        selectedFlightRequest={flightRequest}
      />
    );
  } else if (searchMeta.routeModel == RouteModel.RoundTrip) {
    modifyDrawer = (
      // <DrawerRoundtrip
      //   className="modifyform-animation"
      //   airports={airports}
      //   departureData={departureData}
      //   arrivalData={arrivalData}
      //   cabin={cabin}
      //   flightRequestData={flightRequest}
      //   directFlight={directFlight}
      // />
      <SearchPanelModify
        airports={airports}
        searchMeta={searchMeta}
        selectedFlightRequest={flightRequest}
      />
    );
  } else if (searchMeta.routeModel == RouteModel.MultiCity) {
    modifyDrawer = (
      <SearchPanelModify
        airports={airports}
        searchMeta={searchMeta}
        selectedFlightRequest={flightRequest}
      />
    );
  }

  const modifyForm = formVisibility ? modifyDrawer : <></>;

  // Initialize and set the media query for mobile
  const [onMobile, setOnMobile] = useState(
    window.matchMedia("(max-width: 768px)").matches
  );

  useEffect(() => {
    // Set the media query for mobile
    window.matchMedia("(max-width: 768px)").addEventListener("change", (e) => {
      setOnMobile(e.matches);
    });
  }, [onMobile]);

  return (
    <>
      {onMobile && (
        <FlightMatchNav
          showForm={showFormDiv}
          getCabinClass={getCabinClass}
          departureData={departureData}
          arrivalData={arrivalData}
          departureTravellingMonth={departureTravellingMonth}
          departureTravellingDay={departureTravellingDay}
          departureTravellingYear={departureTravellingYear}
          arrivalTravellingMonth={arrivalTravellingMonth}
          arrivalTravellingDay={arrivalTravellingDay}
          arrivalTravellingYear={arrivalTravellingYear}
          cabin={cabin}
          adultCount={adultCount}
          childCount={childCount}
          seatedInfantCount={seatedInfantCount}
          routeModel={searchMeta.routeModel}
          singleRowMultiCity={_activeSearchRow}
        />
      )}
      <div className="site-drawer-render-in-current-wrapper">
        <div className="flightNavBarContainer-query">
          {!onMobile && (
            <div className={styles.flightNavWrapper}>
              <div className="row">
                {/* location OR airports */}
                <div className="col-sm-12 col-md-12 col-lg-12 col-xl-5 destinationOrigin">
                  <div className={styles.destinationOrigin}>
                    <div className={styles.locations}>
                      {/* <p className={styles.airportName}>{flightResultsSummary.itineraries[0].segments[0].segmentDeparture,airport.city}, Nigeria, </p> */}
                      <p className={styles.airportName}>
                        {`${departureData.city}, ${departureData.country}`}
                      </p>
                      <p className={styles.airportName}>
                        {`${departureData.name}, ${departureData.iataCode}`}
                      </p>
                    </div>
                    <div className={styles.tofroCase}>
                      <Image src={toFro} alt={"to-and-fro-movement"} />
                    </div>
                    <div className={styles.locations}>
                      <p className={styles.airportName}>
                        {`${arrivalData.city}, ${arrivalData.country}`}
                      </p>
                      <p className={styles.airportName}>
                        {`${arrivalData.name}, ${arrivalData.iataCode}`}
                      </p>
                    </div>
                  </div>
                </div>
                {/* date */}
                <div className="col-sm-12 col-md-4 col-lg-4 col-xl-2 dateCase d-flex">
                  <div className={styles.dateCase}>
                    <div>
                      <p className={styles.date}>
                        <span>{departureTravellingMonth} {departureTravellingDay}, {departureTravellingYear}</span> &nbsp;
                        {searchMeta.routeModel == RouteModel.OneWay || _activeSearchRow ?
                          (<></>) : (<>– &nbsp;<span>{arrivalTravellingMonth} {arrivalTravellingDay}, {arrivalTravellingYear}</span></>)}
                      </p>
                    </div>
                  </div>
                </div>
                {/* cabin */}
                <div className="col-sm-12 col-md-3 col-lg-3 col-xl-1 classCase d-flex">
                  <div className={styles.classCase}>
                    <div className={styles.class}>
                      <p className={styles.date}>{getCabinClass(cabin)}</p>
                    </div>
                  </div>
                </div>
                {/* travelers */}
                <div className="col-sm-12 col-md-3 col-lg-3 col-xl-3">
                  <div className="d-flex travelerNum">
                    <div className={styles.adultNum}>
                      <span>Adult</span>
                      <small>{adultCount}</small>
                    </div>
                    <div className={styles.childNum}>
                      <span>Children</span>
                      <small>{childCount}</small>
                    </div>
                    <div className={styles.infantNum}>
                      <span>Infant</span>
                      <small>{seatedInfantCount}</small>
                    </div>
                  </div>
                </div>
                {/* btn */}
                <div
                  className="col-sm-12 col-md-2 col-lg-2 col-xl-1"
                  style={{ padding: 0 }}
                >
                  <div className="modify-btn">
                    {/* <Link href="/"> */}
                    {/* <a> */}
                    <Button
                      className={styles.modifyBtn}
                      type="submit"
                      onClick={showFormDiv}
                    >
                      Modify
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="hideModifyForm transform">{modifyForm}</div>
        </div>
        <Drawer
          placement={placement}
          width={500}
          onClose={onClose}
          open={visibleDrawer}
          closable={true}
          getContainer={false}
          style={{ position: "absolute" }}
          extra={
            <Space>
              <ButtonAnt onClick={onClose}>Cancel</ButtonAnt>
            </Space>
          }
        >
          {modifyDrawer}
          {/* <DrawerRoundtrip airports={airports} /> */}
        </Drawer>
      </div>
    </>
  );
};

export default FlightNavBar;
