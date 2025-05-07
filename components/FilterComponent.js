import React, { useState } from "react";
import styles from "../styles/Home.module.css";
import Image from "next/image";
import { Menu, Dropdown, message, Tabs, Tooltip } from "antd";
import Button from "react-bootstrap/Button";
import AirlineList from "../components/airline-price-list.js";
import AirlineTracker from "../components/airline-tracker.js";
import FlightNavBar from "../components/flightnav-bar.js";
import styled from "styled-components";
import { StopsDiv } from "../components/PlusMinusButton/BtnElements";
import { DownOutlined } from "@ant-design/icons";
import BookedFlightTable from "../components/bookedFlightTable.js";
import cheapestFlight from "../public/icons/cheapest-flight.webp";
import resetIcon from "../public/icons/refresh.webp";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedFlightOffer } from "../redux/actions/flightActions";

const { TabPane } = Tabs;

const FilterComponents = () => {
  const onClick = ({ key }) => {
    message.info(`Click on item ${key}`);
  };

  const dispatch = useDispatch();

  const [visible, setVisible] = useState(false);
  const [placement, setPlacement] = useState("left");

  const showDrawer = () => {
    setVisible(true);
  };

  const onChange = (e) => {
    setPlacement(e.target.value);
  };

  const onClose = () => {
    setVisible(false);
  };

  const mark = {
    0: { label: <strong className="arithmeticsign">-</strong> },
    100: { label: <strong className="arithmeticsign">+</strong> },
  };

  const state = { disabled: false };

  let flightResults = useSelector((state) => state.store.flightResults);

  let airlineName = Object.values(flightResults?.dictionaries?.carriers);
  // console.log(airlineName);

  // console.log(flightResults?.offerInfos?.slice(0, 1));

  const carriers = flightResults?.dictionaries?.carriers;

  let iataAirlines = [];
  for (let key of Object.keys(flightResults?.dictionaries?.carriers)) {
    iataAirlines.push(key);
  }

  let airlineNameAndCode = [];
  airlineNameAndCode.push(flightResults?.dictionaries?.carriers);
  // console.log(airlineNameAndCode);

  // Function to return minimum price for each airline per segment
  const returnMinforEachAirlineWithoutSegment = (response, airline) => {
    if (response && response?.offerInfos?.length > 0) {
      let minforEachAirline;
      let flightPrices = [];
      // console.log(response.offerInfos[0].itineraries[0].segments[0].carrier.name);
      for (let i = 0; i < response?.offerInfos?.length; i++) {
        if (
          response?.offerInfos[i]?.itineraries[0]?.segments[0]?.carrier?.iataCode ==
          airline
        ) {
          // console.log(response.offerInfos[i].itineraries[0].segments[0].carrier.name.toUpperCase());
          // console.log(response.offerInfos[i].itineraries[0].segments[0].carrier);
          flightPrices.push(response?.offerInfos[i]?.priceBreakdown?.total);
          // console.log(response.offerInfos[i].priceBreakdown.total);
          // if (response.offerInfos[i].priceBreakdown.total < flightPrices[i]) {
          //   console.log("Flight Price from array: " + flight[i]);
          //   minforEachAirline = response.offerInfos[i].priceBreakdown.total;
          // }
          minforEachAirline = flightPrices[0];
        }
      }
      return minforEachAirline;
    }
  };

  // Function to return minimum price for all airline per segment
  const returnMinforAllAirlines = (response, segmentLen) => {
    if (response && response?.offerInfos?.length > 0) {
      let minforEachAirline;
      let flightPrices = [];
      for (let i = 0; i < response?.offerInfos?.length; i++) {
        if (
          response?.offerInfos[i]?.itineraries[0]?.segments?.length == segmentLen
        ) {
          flightPrices.push(response?.offerInfos[i]?.priceBreakdown?.total);
          // if (response.offerInfos[i].priceBreakdown.total < flightPrices) {
          //   minforEachAirline = response.offerInfos[i].priceBreakdown.total;
          // }
          minforEachAirline = flightPrices[0];
        }
      }
      return minforEachAirline;
    }
  };

  const zeroStopPriceForAllAirlines = returnMinforAllAirlines(flightResults, 1);

  if (zeroStopPriceForAllAirlines) {
    const formattedZeroStopPriceForAllAirlines = parseFloat(
      zeroStopPriceForAllAirlines
    ).toLocaleString("en-NG", {
      style: "currency",
      currency: "NGN",
    });
  }

  const oneStopPriceForAllAirlines = returnMinforAllAirlines(flightResults, 2);

  if (oneStopPriceForAllAirlines) {
    const formattedOneStopPriceForAllAirlines = parseFloat(
      oneStopPriceForAllAirlines
    ).toLocaleString("en-NG", {
      style: "currency",
      currency: "NGN",
    });
  }

  const onePlusStopPriceForAllAirlines = returnMinforAllAirlines(
    flightResults,
    3
  );
  if (onePlusStopPriceForAllAirlines) {
    const formattedOnePlusStopPriceForAllAirlines = parseFloat(
      onePlusStopPriceForAllAirlines
    ).toLocaleString("en-NG", {
      style: "currency",
      currency: "NGN",
    });
  }
  // console.log("Flight Requests", flightRequest.originDestinations[0].departureDateTimeRange.date);
  // console.log("Flight Requests", flightRequest.originDestinations[lastOriginDestination].departureDateTimeRange.date);

  const [flightResultsLoadMore, setFlightResultsLoadMore] = useState(
    flightResults.offerInfos.slice(0, 15)
  );

  const filterPriceOnClickAllAirlines = () => {
    setFlightResultsLoadMore(flightResults.offerInfos.slice(0, 15));
  };

  const filterPriceOnClickStops = (stops) => {
    let filteredFlightResultByStops = filterByStops(stops);
    setFlightResultsLoadMore(filteredFlightResultByStops.slice(0, 15));
  };

  const filterPriceOnClickAirlineWithStops = (iataCode, stops) => {
    let filteredFlightResultWithStops = filterByAirlineWithStops(
      iataCode,
      stops
    );
    setFlightResultsLoadMore(filteredFlightResultWithStops.slice(0, 15));
  };

  const filterPriceOnClickAirline = (iataCode) => {
    let filteredFlightResult = filterByAirline(iataCode);
    setFlightResultsLoadMore(filteredFlightResult.slice(0, 15));
  };

  function filterByAirline(iataCode) {
    let filteredFlightResults = [];
    flightResults.offerInfos.filter((offerInfo) => {
      if (
        offerInfo?.itineraries[0]?.segments[0]?.carrier?.iataCode?.includes(iataCode)
      ) {
        filteredFlightResults.push(offerInfo);
      }
    });
    return filteredFlightResults;
  }

  function filterByAirlineWithStops(iataCode, stops) {
    let filteredFlightResults = [];
    flightResults.offerInfos.filter((offerInfo) => {
      if (
        offerInfo?.itineraries[0]?.segments[0]?.carrier?.iataCode?.includes(iataCode)
      ) {
        let stopsLength = offerInfo?.itineraries[0]?.segments?.length;
        if (stopsLength == stops) {
          // console.log(offerInfo);
          filteredFlightResults.push(offerInfo);
        }
      }
    });
    return filteredFlightResults;
  }

  function filterByStops(stops) {
    let filteredFlightResultsByStops = [];
    flightResults.offerInfos.filter((offerInfo) => {
      const stopsLength = offerInfo?.itineraries[0]?.segments?.length;
      if (stopsLength == stops) {
        // console.log(offerInfo);
        filteredFlightResultsByStops.push(offerInfo);
        // console.log(offerInfo);
      }
    });
    return filteredFlightResultsByStops;
  }

  const [isLoading, setIsLoading] = useState(false);

  // loadMore function
  const onLoadMore = () => {
    setIsLoading(true);

    // get the number of items in the array
    const numberOfFlightResults = flightResultsLoadMore.length;

    setTimeout(() => {
      setFlightResultsLoadMore(
        flightResultsLoadMore.concat([
          ...flightResults.offerInfos.slice(
            numberOfFlightResults,
            numberOfFlightResults + 15
          ),
        ])
      );
    }, 1000);

    setIsLoading(false);

    // console.log(numberOfFlightResults);
  };

  const { disabled } = state;

  const [isShow, setIsShow] = useState(true);
  const handleEvent = () => {
    setIsShow(!isShow);
  };

  function onFlightOfferSelected(selectedOffer) {
    dispatch(setSelectedFlightOffer(selectedOffer));
  }

  // *********************************
  return (
    <>
      <div className="col-xl-3 col-lg-4 col-12 action-panel-container ">
        <div className="action-panel">
          <div className={styles.actionPanelHeader}>
            <h5 className={styles.panelName}>Filter</h5>
            <div className={styles.resetLabel}>
              <div className={styles.restIconCase}>
                <Image src={resetIcon} alt={"reset-icon"} />
              </div>
              <small>Reset all</small>
            </div>
          </div>
        </div>

        {/* Price Filter range */}

        <div className="price-panel">
          <div className={styles.priceHeader}>
            <h5 className={styles.priceName}>Number of Stops</h5>
            <div className={styles.resetLabel}>
              <div className={styles.restIconCase}>
                <Image src={resetIcon} alt={"reset-icon"} />
              </div>
            </div>
          </div>
          <div className="row stops-num-direction">
            <div className="col-sm-12 col-md-4 col-12">
              <div className="mt-5 stopsDiv">
                <Button className={styles.stopsDiv} type="submit">
                  0
                </Button>{" "}
                {/* <StopsDiv /> */}
                <small style={{ marginLeft: "1rem" }}>
                  {formattedZeroStopPriceForAllAirlines}
                </small>
              </div>
            </div>
            <div className="col-sm-12 col-md-4 col-12">
              <div className="mt-5 stopsDiv">
                <Button className={styles.stopsDiv} type="submit">
                  1
                </Button>{" "}
                {/* <StopsDiv /> */}
                <small style={{ marginLeft: "1rem" }}>
                  {formattedOneStopPriceForAllAirlines}
                </small>
              </div>
            </div>
            <div className="col-sm-12 col-md-4 col-12">
              <div className="mt-5 stopsDiv">
                <Button className={styles.stopsDiv} type="submit">
                  2
                </Button>{" "}
                {/* <StopsDiv /> */}
                <small style={{ marginLeft: "1rem" }}>
                  {formattedOnePlusStopPriceForAllAirlines}
                </small>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="price-panel">
            <div className={styles.priceHeader}>
              <h5 className={styles.priceName}>Airlines</h5>
              <div className={styles.resetLabel}>
                <div className={styles.restIconCase}>
                  <Image src={resetIcon} alt={"reset-icon"} />
                </div>
              </div>
            </div>

            {Object.entries(carriers).map(([key, value], index) => {
              const airlinePrice = returnMinforEachAirlineWithoutSegment(
                flightResults,
                key
              );
              if (airlinePrice) {
                const formattedairlinePrice = parseFloat(
                  airlinePrice
                ).toLocaleString("en-NG", {
                  style: "currency",
                  currency: "NGN",
                });
              }

              return (
                <AirlineList
                  key={index}
                  airline={value}
                  price={formattedairlinePrice}
                />
              );
            })}
          </div>
        </div>

        {/* Take Off flight and  Return Flight Section*/}
      </div>
    </>
  );
};

export default FilterComponents;
