import { useState } from "react";
import Table from "react-bootstrap/Table";
import Image from "next/image";
import { useSelector } from "react-redux";
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";

const BookedFlightTable = ({
  filterPriceOnClickAirline,
  filterPriceOnClickAllAirlines,
  filterPriceOnClickAirlineWithStops,
  filterPriceOnClickStops,
}) => {
  let flightResults = useSelector((state) => state.store.flightResults);

  let fetchAirlines = useSelector((state) => state.store.airlines);

  const [iataAirlines] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);

  const [itemsPerPage] = useState(5);

  const findAirlineName = (array, iataCode) => {
    const airlineName = array.find((value) => value.iataCode === iataCode);
    return airlineName.name;
  };

  // console.log(fetchAirlines);
  // Write logic to return unique airline in an array
  // let iataAirlines = [];

  for (let i = 0; i < flightResults.offerInfos.length; i++) {
    let offerInfo = flightResults.offerInfos[i];
    let carrier = offerInfo.itineraries[0].segments[0].carrier;
    // console.log(carrier);
    if (iataAirlines.indexOf(carrier.iataCode) === -1) {
      iataAirlines.push(carrier.iataCode);
    }
  }

  // Get current posts
  const indexOfLastPost = currentPage * itemsPerPage;
  const indexOfFirstPost = indexOfLastPost - itemsPerPage;
  const currentPosts = iataAirlines.slice(indexOfFirstPost, indexOfLastPost);

  const showNextAirlines = () => {
    setCurrentPage(currentPage + 1);
  };

  const ShowPreviousAirlines = () => {
    setCurrentPage(currentPage - 1);
  };

  let previousAirlinesButton;

  if (currentPage === 1) {
    previousAirlinesButton = null;
  } else {
    previousAirlinesButton = (
      <div className="float-start global-blue" onClick={ShowPreviousAirlines}>
        <ArrowLeftOutlined />
        Show Previous Airlines
      </div>
    );
  }

  /**
   * Refactor the functions to be defined in the parent and passed to the child.
   **/

  // Function to return minimum price for each airline per segment
  const returnMinforEachAirline = (response, airline, segmentLen) => {
    if (response && response.offerInfos.length > 0) {
      let minforEachAirline;
      let flightPrices = [];
      for (let i = 0; i < response.offerInfos.length; i++) {
        if (
          response?.offerInfos[i]?.itineraries[0]?.segments[0]?.carrier?.iataCode ===
          airline
        ) {
          let stopsLength =
            response?.offerInfos[i]?.itineraries[0]?.segments.length;
          if (stopsLength == segmentLen) {
            flightPrices.push(response?.offerInfos[i]?.priceBreakdown?.total);
            if (response?.offerInfos[i]?.priceBreakdown?.total < flightPrices) {
              minforEachAirline = response?.offerInfos[i]?.priceBreakdown?.total;
            }
            minforEachAirline = flightPrices[0];
          }
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
          flightPrices?.push(response?.offerInfos[i]?.priceBreakdown?.total);
          // if (response.offerInfos[i].priceBreakdown.total < flightPrices) {
          //   minforEachAirline = response.offerInfos[i].priceBreakdown.total;
          // }
          minforEachAirline = flightPrices[0];
        }
      }
      // call function here to show the min price in the array
      return minforEachAirline;
    }
  };

  const zeroStopPriceForAllAirlines = returnMinforAllAirlines(flightResults, 1);
  // console.log(zeroStopPriceForAllAirlines);
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

  return (
    <>
      <Table className="tbody td th" bordered responsive>
        <thead>
          <tr>
            <th className="tableHead">
              <div className="emptyHeader"></div>
            </th>
            <th
              className="clickable-airline"
              onClick={() => filterPriceOnClickAllAirlines()}
            >
              <div>All Airlines</div>
            </th>
            {currentPosts.map((carrier, index) => {
              return (
                <th
                  className="clickable-airline"
                  key={index}
                  onClick={() => filterPriceOnClickAirline(carrier)}
                >
                  <Image
                    src={`${process.env.NEXT_WAKANOW_PUBLIC_URL}/Images/flight-logos/${carrier}.gif`}
                    alt={carrier}
                    width={50}
                    height={50}
                  />
                  <div>{findAirlineName(fetchAirlines, carrier)}</div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>Nonstop</th>
            {
              <td
                className="clickable-airline"
                onClick={() => filterPriceOnClickStops(1)}
              >
                {formattedZeroStopPriceForAllAirlines}
              </td>
            }
            {currentPosts?.map((iataAirline, index) => {
              const price = returnMinforEachAirline(
                flightResults,
                iataAirline,
                1
              );
              if (price) {
                const formattedPrice = parseFloat(price).toLocaleString(
                  "en-NG",
                  {
                    style: "currency",
                    currency: "NGN",
                  }
                );
                const clickableAirline = "clickable-airline";
                // write onClick function here
              }
              return (
                <td
                  className={clickableAirline}
                  key={index}
                  onClick={() =>
                    filterPriceOnClickAirlineWithStops(iataAirline, 1)
                  }
                >
                  {formattedPrice}
                </td>
              );
            })}
          </tr>
          <tr>
            <th className="tableHead">1 Stop</th>
            <td
              className="clickable-airline"
              onClick={() => filterPriceOnClickStops(2)}
            >
              {formattedOneStopPriceForAllAirlines}
            </td>
            {currentPosts.map((iataAirline, index) => {
              const price = returnMinforEachAirline(
                flightResults,
                iataAirline,
                2
              );
              if (price) {
                const formattedPrice = parseFloat(price).toLocaleString(
                  "en-NG",
                  {
                    style: "currency",
                    currency: "NGN",
                  }
                );
                const clickableAirline = "clickable-airline";
                // write onClick function here
              }
              return (
                <td
                  className={clickableAirline}
                  key={index}
                  onClick={() =>
                    filterPriceOnClickAirlineWithStops(iataAirline, 2)
                  }
                >
                  {formattedPrice}
                </td>
              );
            })}
          </tr>
          <tr>
            <th className="tableHead">1+ Stops</th>
            <td
              className="clickable-airline"
              onClick={() => filterPriceOnClickStops(3)}
            >
              {formattedOnePlusStopPriceForAllAirlines}
            </td>
            {currentPosts.map((iataAirline, index) => {
              const price = returnMinforEachAirline(
                flightResults,
                iataAirline,
                3
              );
              if (price) {
                const formattedPrice = parseFloat(price).toLocaleString(
                  "en-NG",
                  {
                    style: "currency",
                    currency: "NGN",
                  }
                );
                const clickableAirline = "clickable-airline";
                // write onClick function here
              }
              return (
                <td
                  className={clickableAirline}
                  key={index}
                  onClick={() =>
                    filterPriceOnClickAirlineWithStops(iataAirline, 3)
                  }
                >
                  {formattedPrice}
                </td>
              );
            })}
          </tr>
        </tbody>
      </Table>
      <div className="mb-3 pt-2">
        {previousAirlinesButton}
        <div className="float-end global-blue" onClick={showNextAirlines}>
          Show More Airlines <ArrowRightOutlined />
        </div>
      </div>
    </>
  );
};

export default BookedFlightTable;
