import styles from "../styles/BookPage.module.css";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import downScaleImg from '../public/icons/downscale.png';
import Image from "next/image";

const BookingSummary = ({ setSelectedFlightOffer }) => {
  // console.log(setSelectedFlightOffer);
  // const setSelectedFlightOffer = useSelector(
  //   (state) => state.store.selectedOffer
  // );

  // useEffect(() => {
  // get traveller pricing data
  // }, []);
  const itinerariesReturn = setSelectedFlightOffer[0]?.itineraries.length - 1;

  const travelerPricing = setSelectedFlightOffer[0]?.travelerPricings;

  if (travelerPricing) {
    let adultCount = 0;
    let childCount = 0;
    let seatedInfantCount = 0;
    for (let i = 0; i < travelerPricing.length; i++) {
      if (travelerPricing[i]?.travelerType == "ADULT") {
        adultCount++;
      } else if (travelerPricing[i]?.travelerType == "CHILD") {
        childCount++;
      } else if (travelerPricing[i]?.travelerType == "HELD_INFANT") {
        seatedInfantCount++;
      }
    }
  }

  let returnSection;

  if (setSelectedFlightOffer[0]?.itineraries?.length == 1) {
    returnSection = <></>;
  } else {
    returnSection = (
      <div className="price-panel">
        <div className={styles.priceHeader}>
          <h5 className={styles.flightStatusName}>Return</h5>
          <div className={styles.resetLabel}>
            <h5 className={styles.flightStatusDate}>
              {`${new Date(
                setSelectedFlightOffer[0]?.itineraries[
                  itinerariesReturn
                ]?.segments[0]?.segmentDeparture?.at
              ).toLocaleString("default", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}`}
            </h5>
          </div>
        </div>
        <div className={styles.priceHeader} style={{ marginTop: "1rem" }}>
          <h5 className={styles.priceName}>
            {`${String(
              new Date(
                setSelectedFlightOffer[0]?.itineraries[
                  itinerariesReturn
                ]?.segments[0]?.segmentDeparture?.at
              ).getHours()
            ).padStart(2, "0")}:${String(
              new Date(
                setSelectedFlightOffer[0]?.itineraries[
                  itinerariesReturn
                ]?.segments[0]?.segmentDeparture?.at
              ).getMinutes()
            ).padStart(2, "0")}`}
            &nbsp; (
            {
              setSelectedFlightOffer[0]?.itineraries[itinerariesReturn]?.segments[0]?.segmentDeparture?.airport?.iataCode
            }
            )
          </h5>
          <div className={styles.resetLabel}>
            <h5 className={styles.priceName}>
              {`${String(
                new Date(
                  setSelectedFlightOffer[0]?.itineraries[
                    itinerariesReturn
                  ]?.segments[setSelectedFlightOffer[0]?.itineraries[itinerariesReturn]?.segments?.length - 1]?.segmentArrival?.at
                ).getHours()
              ).padStart(2, "0")}:${String(
                new Date(
                  setSelectedFlightOffer[0]?.itineraries[itinerariesReturn]?.segments[setSelectedFlightOffer[0]?.itineraries[itinerariesReturn]?.segments.length - 1]?.segmentArrival?.at
                ).getMinutes()
              ).padStart(2, "0")}`}
              (
              {
                setSelectedFlightOffer[0]?.itineraries[itinerariesReturn]?.segments[setSelectedFlightOffer[0]?.itineraries[itinerariesReturn]?.segments?.length - 1]?.segmentArrival?.airport?.iataCode
              }
              )
            </h5>
          </div>
        </div>
        <div className={styles.priceHeader} style={{ marginTop: "1rem" }}>
          <h5 className={styles.priceName}>
            {
              setSelectedFlightOffer[0]?.itineraries[itinerariesReturn]?.segments[0]?.segmentDeparture?.airport?.name
            }
            , &nbsp;
            {
              setSelectedFlightOffer[0]?.itineraries[itinerariesReturn]?.segments[0]?.segmentDeparture?.airport?.city
            }
          </h5>
          {/* ****** ARRIVAL ********** */}
          <div className={styles.resetLabel}>
            <h5 className={styles.ArrivalName}>
              {
                setSelectedFlightOffer[0]?.itineraries[itinerariesReturn]?.segments[setSelectedFlightOffer[0]?.itineraries[itinerariesReturn]?.segments.length - 1]?.segmentArrival?.airport?.name
              }
              , &nbsp;
              {
                setSelectedFlightOffer[0]?.itineraries[itinerariesReturn]?.segments[setSelectedFlightOffer[0]?.itineraries[itinerariesReturn].segments.length - 1]?.segmentArrival?.airport?.city
              }
            </h5>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="BookSummaryComp">
        <div className="action-panel">
          <div className={styles.actionPanelHeader}>
            <h5 className={styles.panelName}>Booking Summary</h5>
            <div className={styles.resetLabel}>
              {/* <div className={styles.restIconCase}>
                      <Image src={resetIcon} alt={"reset-icon"} />
                    </div>
                    <small>Reset all</small> */}
            </div>
          </div>
        </div>
        {/* ************ DEPARTURE ************ */}
        <div className="price-panel">
          <div className={styles.priceHeader}>
            <h5 className={styles.flightStatusName}>Departure</h5>
            <div className={styles.resetLabel}>
              <h5 className={styles.flightStatusDate}>
                {`${new Date(
                  setSelectedFlightOffer[0]?.itineraries[0]?.segments[0]?.segmentDeparture?.at
                ).toLocaleString("default", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}`}
              </h5>
            </div>
          </div>
          <div className={styles.priceHeader} style={{ marginTop: "1rem" }}>
            <h5 className={styles.priceName}>
              {`${String(
                new Date(
                  setSelectedFlightOffer[0]?.itineraries[0]?.segments[0]?.segmentDeparture.at
                ).getHours()
              ).padStart(2, "0")}:${String(
                new Date(setSelectedFlightOffer[0]?.itineraries[0]?.segments[0]?.segmentDeparture?.at).getMinutes()).padStart(2, "0")}`}
              &nbsp; (
              {
                setSelectedFlightOffer[0]?.itineraries[0]?.segments[0]?.segmentDeparture?.airport?.iataCode
              }
              )
            </h5>
            <div className={styles.resetLabel}>
              <h5 className={styles.priceName}>
                {`${String(
                  new Date(
                    setSelectedFlightOffer[0]?.itineraries[0]?.segments[
                      setSelectedFlightOffer[0]?.itineraries[0]?.segments.length -
                      1
                    ]?.segmentArrival?.at
                  ).getHours()
                ).padStart(2, "0")}:${String(
                  new Date(
                    setSelectedFlightOffer[0]?.itineraries[0]?.segments[
                      setSelectedFlightOffer[0]?.itineraries[0]?.segments.length -
                      1
                    ]?.segmentArrival?.at
                  ).getMinutes()
                ).padStart(2, "0")}`}
                (
                {
                  setSelectedFlightOffer[0]?.itineraries[0]?.segments[
                    setSelectedFlightOffer[0]?.itineraries[0]?.segments?.length - 1
                  ]?.segmentArrival?.airport?.iataCode
                }
                )
              </h5>
            </div>
          </div>
          <div className={styles.priceHeader} style={{ marginTop: "1rem" }}>
            <h5 className={styles.priceName}>
              {
                setSelectedFlightOffer[0]?.itineraries[0]?.segments[0]?.segmentDeparture.airport.name
              }
              , &nbsp;
              {
                setSelectedFlightOffer[0]?.itineraries[0]?.segments[0]?.segmentDeparture.airport.city
              }
            </h5>
            <div className={styles.resetLabel}>
              <h5 className={styles.ArrivalName}>
                {
                  setSelectedFlightOffer[0]?.itineraries[0]?.segments[
                    setSelectedFlightOffer[0]?.itineraries[0]?.segments.length - 1
                  ].segmentArrival.airport.name
                }
                , &nbsp;
                {
                  setSelectedFlightOffer[0]?.itineraries[0]?.segments[
                    setSelectedFlightOffer[0]?.itineraries[0]?.segments.length - 1
                  ]?.segmentArrival?.airport?.city
                }
              </h5>
            </div>
          </div>
        </div>
        {/* ************ RETURN ************** */}

        {returnSection}
        <div>
          <div className="price-panel">
            <div className={styles.priceHeader}>
              <h5 className={styles.flightFare}>Flight Base Fare</h5>
            </div>
            <div className="airline-link-price">
              {/* <div className="flight-checkbox d-flex ">
                <p className="checkbox-paragraph">Adult</p>
              </div> */}
              <div className="">
                <p className="price-list-p"></p>
              </div>
            </div>
            {/* {console.log(setSelectedFlightOffer)} */}
            <FlightBaseFare airline={"Adult"} price={adultCount} />
            <FlightBaseFare airline={"Children"} price={childCount} />
            <FlightBaseFare airline={"Infants"} price={seatedInfantCount} />
            <FlightBaseFare
              airline={"Base Fare"}
              price={parseFloat(
                setSelectedFlightOffer[0]?.priceBreakdown?.base).toLocaleString("en-NG", { style: "currency", currency: "NGN" })}
            />
            <FlightBaseFare airline={"Discount"} price={"No"} />
            <FlightBaseFare
              airline={"Total Fare"}
              price={parseFloat(setSelectedFlightOffer[0]?.priceBreakdown?.total).toLocaleString("en-NG", {
                style: "currency",
                currency: "NGN",
              })}
            />
          </div>
          <div className={styles.totalSummary}>
            <h5 className={styles.totalFig}>Total</h5>
            <div className={styles.resetLabel}>
              <h5 className={styles.totalFig}>
                {parseFloat(
                  setSelectedFlightOffer[0]?.priceBreakdown?.total
                ).toLocaleString("en-NG", {
                  style: "currency",
                  currency: "NGN",
                })}
              </h5>
            </div>
          </div>
          <div className="price-panel price-movement-warning">
            <div className='downscale-div'>
              <Image src={downScaleImg} alt={'price-trend-indicator'} />
            </div>
            <h5 className={styles.priceHike}>
              This price may increase if you don&apos;t book now{" "}
            </h5>
          </div>
        </div>
        <div className="price-panel mt-5">
          <div className={styles.priceHeader}>
            <h5 className={styles.priceName}>
              For Enquiries or Support, Please call:
            </h5>
          </div>
          <div className={styles.priceHeader}>
            <h5 className={styles.enquiryNum}>+234 705 7000 247</h5>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookingSummary;

const FlightBaseFare = (props) => {
  return (
    <>
      <div className="airline-link-price mt-3">
        <div className="flight-checkbox d-flex ">
          <p className="checkbox-paragraph">{props?.airline}</p>
        </div>
        <div className="">
          <p className="price-list-p"> {props?.price}</p>
        </div>
      </div>
    </>
  );
};
