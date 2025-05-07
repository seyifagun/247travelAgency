import React, { useState, useRef } from "react";
import axios from "axios";
import styles from "../styles/Home.module.css";
import { Form as FormAnt, Input, Button, Spin, message } from "antd";
import { useSelector } from "react-redux";
import { useShareFlightResults } from "../pages/api/apiClient";
import FlightItinarary from "./FlightItinarary";
import { ToastComponent } from "@syncfusion/ej2-react-notifications";
import Image from "next/image";

const FlightDetails = ({ flightOffer }) => {
  const state = { disabled: false };

  const [shareFlightDetailsForm] = FormAnt.useForm();

  const toastInstance = useRef(null);

  // const flightResults = useSelector((state) => state.store.flightResults);

  // console.log(flightOffer);

  const [showTab2, setShowTab2] = useState(true);

  const shareFlightResults = useShareFlightResults();

  const onToggle2 = () => {
    setShowTab2(!showTab2);
  };

  const [toggleState, setToggleState] = useState(1);

  const toggleTab = (index) => {
    setToggleState(index);
  };

  const [spinner, setSpinner] = useState("");

  function displayError(title, content) {
    toastInstance.current.title = title;
    toastInstance.current.content = content;
    toastInstance.current.cssClass = "e-success";
    toastInstance.current.show();
  }

  let flightItinararyJson = {};
  const shareFlightItinerary = (selectedFlightItinerary) => {
    // replace the text in the button to spinner
    const antSpinner = <Spin size="small" />;
    setSpinner(antSpinner);
    // get necessary data
    // get email and selected OfferInfo
    // console.log(shareFlightDetailsForm.getFieldsValue().emailAddress);
    // console.log(selectedFlightItinerary);
    flightItinararyJson = {
      email: shareFlightDetailsForm.getFieldsValue().emailAddress,
      offerInfo: selectedFlightItinerary,
    };
    // send data to endpoint
    // console.log(flightItinararyJson);
    shareFlightDetailsForm
      .validateFields()
      .then(async () => {
        await shareFlightResults(flightItinararyJson)
          .then((response) => {
            // console.log("Caught Resp:", response);
            message.success(
              'Success! The Flight Itinerary has been sent to the email provided.', 3
            );
            setSpinner("Send");
            // router.push("/flight-match");
            // setFlightSearchProcessingModalVisibility(false);
          })
          .catch((error) => {
            setSpinner("Send");
            // setFlightSearchProcessingModalVisibility(false);
            console.log("Caught Error 2:", error);
            message.error('Error! Cannot send Flight Itinenary', 3);
            // TODO: Pop up a dialog
            // setFlightSearchErrorModalVisibility(true);
          });
      })
      .catch((err) => {
        console.error("Form Error:", err);
        message.error('Error! Cannot send Flight Itinenary', 3);
      });
    // console.dir("working");
  };

  const suffixSelector = (
    <FormAnt.Item name="suffix" noStyle className="share-btn">
      <Button
        className="itinenary-share-btn"
        type="primary"
        onClick={() => shareFlightItinerary(flightOffer)}
        style={{ width: 70 }}
      >
        {spinner ? spinner : "Send"}
      </Button>
    </FormAnt.Item>
  );

  const { disabled } = state;
  return (
    <>
      <div className="row">
        <div className="col-sm-12 col-md-8">
          <div className="flightdetails-itinenary">
            {flightOffer.itineraries.map((itinarary, index) => (
              <FlightItinarary
                itinarary={itinarary}
                key={index}
                fareDetails={
                  flightOffer?.travelerPricings[0]?.fareDetailsBySegment
                }
              />
            ))}
          </div>
        </div>
        <div className="col-sm-12 col-md-4">
          <div style={{ paddingRight: "1rem" }}>
            <p style={{ color: "#0043a4", fontWeight: "600" }}>
              Fare Breakdown
            </p>

            <div className={styles.fareBreakdown}>
              <p>Adult</p>
              <p>1</p>
            </div>
            {/*  */}
            <div className={styles.fareBreakdown}>
              <p>Base Fare</p>
              <p>
                {parseFloat(flightOffer?.priceBreakdown?.base).toLocaleString(
                  "en-NG",
                  {
                    style: "currency",
                    currency: "NGN",
                  }
                )}
              </p>
            </div>
            {/*  */}
            <div className={styles.fareBreakdown}>
              <p>Tax &amp; Fee</p>
              <p>
                {" "}
                {parseFloat(
                  flightOffer?.priceBreakdown?.taxesAndFees
                ).toLocaleString("en-NG", {
                  style: "currency",
                  currency: "NGN",
                })}{" "}
              </p>
            </div>
            <div
              className={styles.fareBreakdownTotal}
              style={{
                backgroundColor: "#0043a4",
                padding: "0.5rem 0.4rem",
                color: "#fff",
              }}
            >
              <p style={{ marginBottom: "0" }}>Total: </p>
              <p style={{ marginBottom: "0" }}>
                {parseFloat(flightOffer?.priceBreakdown?.total).toLocaleString(
                  "en-NG",
                  {
                    style: "currency",
                    currency: "NGN",
                  }
                )}
              </p>
            </div>
            {/* <div className="baggage-bloc-tabs">
                <button
                  className={
                    toggleState === 2
                      ? "baggage-tab active-baggage-tab"
                      : "baggage-tab"
                  }
                  onClick={() => toggleTab(2)}
                >
                  <button onClick={onToggle2} className="toggletab-icon">
                    <span className="tab-icon">
                      <Image src={baggageImg} alt={""}  />
                      &nbsp;
                      <small>Baggage Info</small>
                    </span>
                  </button>
                </button>
              </div> */}

            {/* <div className="baggage-content-tabs">
                {showTab2 ? (
                  <div
                    className={
                      toggleState === 2
                        ? "content-toggle  baggage-active-content"
                        : "content-toggle"
                    }
                  >
                    Baggage Info
                  </div>
                ) : null}
              </div> */}
            <div className="baggage-content-tabs pt-3 pb-3">
              Baggage Info:{" "}
              {
                flightOffer?.travelerPricings[0]?.fareDetailsBySegment[0]?.includedCheckedBags?.quantity
              }{" "}
              bag(s)
              {/* {console.log(flightOffer.travelerPricings[0].fareDetailsBySegment[0].includedCheckedBags.quantity)} */}
            </div>
            <small style={{ color: "#0043a4", fontWeight: "600" }}>
              Share Itinenary
            </small>
            <FormAnt form={shareFlightDetailsForm} layout="vertical">

              {/*  */}
              <div>
                <FormAnt.Item
                  name="emailAddress"
                  className=""
                  rules={[
                    {
                      type: "email",
                      message: "The input is not valid E-mail!",
                    },
                    {
                      required: true,
                      message: "Please input your E-mail!",
                    },
                  ]}
                >
                  <Input
                    addonAfter={suffixSelector}
                    style={{ width: "100%", padding: "0" }}
                  />
                </FormAnt.Item>
              </div>
            </FormAnt>
          </div>
        </div>
      </div>
      <ToastComponent
        ref={toastInstance}
        animation={{
          show: { effect: "SlideRightIn", duration: 300, easing: "linear" },
          hide: { effect: "SlideRightOut", duration: 300, easing: "linear" },
        }}
        position={{ X: "Right", Y: "Top" }}
      />
    </>
  );
};

export default FlightDetails;

{
  /* <Input.Group compact>
  <Input
    style={{ width: "calc(100% - 83px)" }}
    placeholder="Enter E-mail"
  />
    <Button type="primary">Submit</Button>
</Input.Group> */
}
