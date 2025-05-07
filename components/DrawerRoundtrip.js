import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useRouter } from "next/router";
import Image from "next/image";
import flightFrom from "../public/icons/flight-from.webp";
import flightTo from "../public/icons/flight-to_.webp";
import calenderIcon from "../public/icons/calender.webp";
import flightClass from "../public/icons/flight-class.webp";
import babyIcon from "../public/icons/Infant.webp";
import childrenIcon from "../public/icons/children.webp";
import adultIcon from "../public/icons/adult.webp";
import aeroplaneImg from "../public/aeroplane.png";
import PlusMinusButton from "../components/PlusMinusButton";
import {
  DatePicker,
  Input,
  InputNumber,
  Tooltip,
  Form as FormAnt,
  List,
  Card,
  Checkbox,
  Button,
  Select,
  Modal,
  Spin,
  Form,
} from "antd";
import moment from "moment";
import { useFetchFlightResults } from "../pages/api/apiClient";

const { RangePicker } = DatePicker;

const DrawerRoundtrip = ({
  departureData,
  arrivalData,
  cabin,
  flightRequestData,
  directFlight,
  airports,
}) => {
  // const setSelectedFlightOffer = useSelector((state) =>
  //   state.store.flightResults.offerInfos.slice(0, 1)
  // );

  // const setSelectedFlightRequest = useSelector(
  //   (state) => state.store.flightRequestMeta
  // );

  // deserialize the json string to object
  const deserialize = (str) => {
    return JSON.parse(str);
  };

  // const flightRequestJson = deserialize(setSelectedFlightRequest.flightRequest);

  // console.log(flightRequestJson);

  // destructure the directFlight key from the flightRequestJson
  // const { directFlightOnly } = flightRequestJson;

  // destructure the directFlight key from the flightRequestJson

  // const lastSegment =
  //   setSelectedFlightOffer[0].itineraries[0].segments.length - 1;

  const flightRequest = useSelector((state) => state.store.flightRequestMeta);

  // const lastOriginDestination =
  //   setSelectedFlightOffer[0].itineraries.length - 1;

  const getCabinClass = (cabin) => {
    switch (cabin) {
      case "PREMIUM_ECONOMY":
        return "Premium Economy";
      case "Premium_Economy":
        return "Premium Economy";
      case "ECONOMY":
        return "Economy";
      case "Economy":
        return "Economy";
      case "BUSINESS":
        return "Business";
      case "Business":
        return "Business";
      case "FIRST":
        return "First Class";
      case "First":
        return "First Class";
      default:
        break;
    }
  };
  // *************************************************************
  // );
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

  //#region States

  // Flight search processing modal visibility state
  const [
    flightSearchProcessingModalVisibility,
    setFlightSearchProcessingModalVisibility,
  ] = useState(false);

  // Flight search error
  const [
    flightSearchErrorModalVisibility,
    setFlightSearchErrorModalVisibility,
  ] = useState(false);

  const [takeOffAirportsFilterResult, setTakeOffAirportsFilterResult] =
    useState([]);
  const [destinationAirportsFilterResult, setDestinationAirportsFilterResult] =
    useState([]);

  // ************************************************************************

  // get traveller pricing data
  // const travelerPricing = setSelectedFlightOffer[0].travelerPricings;

  // if (travelerPricing) {
  //   let adultCount = 0;
  //   let childCount = 0;
  //   let seatedInfantCount = 0;
  //   for (let i = 0; i < travelerPricing.length; i++) {
  //     if (travelerPricing[i].travelerType == "ADULT") {
  //       adultCount++;
  //     } else if (travelerPricing[i].travelerType == "CHILD") {
  //       childCount++;
  //     } else if (travelerPricing[i].travelerType == "HELD_INFANT") {
  //       seatedInfantCount++;
  //     }
  //   }
  // }

  // get traveller pricing data
  const adultCount = flightRequestData.numberOfAdults;
  const childCount = flightRequestData.numberOfChildren;
  const seatedInfantCount = flightRequestData.numberOfInfants;

  const [adultNumValue, setAdultNumValue] = useState(adultCount);
  const [childrenNumValue, setChildrenNumValue] = useState(childCount);
  const [infantsNumValue, setInfantsNumValue] = useState(seatedInfantCount);

  const adultMinValue = 1;
  const childernMinValue = 0;
  const infantsMinValue = 0;

  const hideModal = () => {
    setFlightSearchErrorModalVisibility(false);
  };

  function increaseAdultNum() {
    setAdultNumValue(++adultNumValue);

    // Update the from value
    flightSearchForm.setFieldsValue({
      numberOfAdults: adultNumValue,
    });
  }

  function decreaseAdultNum() {
    if (adultNumValue <= adultMinValue) {
      return;
    }

    setAdultNumValue(--adultNumValue);

    // Update the from value
    flightSearchForm.setFieldsValue({
      numberOfAdults: adultNumValue,
    });
  }
  function increaseChildrenNum() {
    setChildrenNumValue(++childrenNumValue);

    // Update the from value
    flightSearchForm.setFieldsValue({
      numberOfChildren: childrenNumValue,
    });
  }

  function decreaseChildrenNum() {
    if (childrenNumValue <= childernMinValue) {
      return;
    }

    setChildrenNumValue(--childrenNumValue);

    // Update the from value
    flightSearchForm.setFieldsValue({
      numberOfChildren: childrenNumValue,
    });
  }
  function increaseInfantsNum() {
    setInfantsNumValue(++infantsNumValue);

    // Update the from value
    flightSearchForm.setFieldsValue({
      numberOfInfants: infantsNumValue,
    });
  }

  function decreaseInfantsNum() {
    if (infantsNumValue <= infantsMinValue) {
      return;
    }

    setInfantsNumValue(--infantsNumValue);

    // Update the from value
    flightSearchForm.setFieldsValue({
      numberOfInfants: infantsNumValue,
    });
  }

  function flightNumRestriction() {
    // return, if travellers are more than 9
    return adultNumValue + childrenNumValue + infantsNumValue > 9;
  }

  //#endregion

  //#region Hooks

  const navigate = useNavigate();

  const router = useRouter();

  const originLocationInput = useRef();

  // create hook for Destination Input
  const originDestinationInput = useRef();

  const fetchFlightResults = useFetchFlightResults();

  const [flightSearchForm] = FormAnt.useForm();

  // hooks to handle the visibility of flight search err modal
  const [isShow, setIsShow] = useState(false);

  const [departureDateState, setDepartureDateState] = useState(
    flightSearchForm.getFieldsValue().selectedDepartureDate
  );

  const [returningDateState, setReturningDateState] = useState(
    flightSearchForm.getFieldsValue().selectedReturningDate
  );

  const [dateErrorMsg, setDateErrorMsg] = useState("");

  // states for form validation
  const [FromvalidationMsg, setFromValidationMsg] = useState("");
  const [TovalidationMsg, setToValidationMsg] = useState("");

  // console.log(departureDateState);
  const dateFormHandler = () => {
    if (moment(departureDateState).isAfter(returningDateState)) {
      setDateErrorMsg("Returning date cannot be earlier");
      // if(moment(departureDateState).isSame(returningDateState)){

      // }
    } else {
      setDateErrorMsg("");
    }
  };

  const handleOk = () => {
    setIsShow(false);
  };

  // function to disable the previous dates in calender
  function disabledDate(current) {
    // Can not select days before today and today
    return current && current < moment();
  }

  function disbaledArrivalDate(current) {
    const selectedDepartureDateForDatePicker =
      flightSearchForm.getFieldsValue().selectedDepartureDate;
    return (
      current &&
      current < moment(selectedDepartureDateForDatePicker).add(12, "hours")
    );
  }

  // function to track the ticking of checkboxes
  function onChange(e) {
    console.log(`checked = ${e.target.checked}`);
  }

  async function filterLocation(value) {
    const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
    await sleep(1000).then(() => {
      // console.log("Completed");
    });
    var matches = [];
    if (value.length === 3) {
      // First filter for iataCode...
      matches = airports.filter((p) =>
        p.iataCode.toLowerCase().includes(value.toLocaleLowerCase())
      );
      // Then filter for others...
      var otherMatches = airports.filter(
        (p) =>
          p.name.toLocaleLowerCase().includes(value.toLocaleLowerCase()) ||
          p.city.toLocaleLowerCase().includes(value.toLocaleLowerCase()) ||
          p.country.toLocaleLowerCase().includes(value.toLocaleLowerCase())
      );
      otherMatches.forEach((match) => {
        matches.push(match);
      });
    } else {
      matches = airports.filter(
        (p) =>
          p.name.toLocaleLowerCase().includes(value.toLocaleLowerCase()) ||
          p.city.toLocaleLowerCase().includes(value.toLocaleLowerCase()) ||
          p.country.toLocaleLowerCase().includes(value.toLocaleLowerCase())
      );
    }
    return matches;
  }

  // check this form later.
  const requiredFieldsTest = () => {
    let departure = originLocationInput.current.state.value;
    let arrival = originDestinationInput.current.state.value;

    if (!departure || !arrival) {
      if (!departure) {
        setFromValidationMsg("Departing City or Airport required");
      }
      if (!arrival) {
        setToValidationMsg("Arrival City or Airport required");
      }
      return false;
    } else {
      return true;
    }
  };

  // onSubmit flightSearch function
  const onClickRoundTrip = () => {
    const requiredFieldsTestVariable = requiredFieldsTest();
    if (requiredFieldsTestVariable) {
      if (flightNumRestriction()) {
        setFlightNumberRestriction(true);
        return;
      }
      flightSearchForm
        .validateFields()
        .then(async () => {
          // Display flight search processing modal
          setFlightSearchProcessingModalVisibility(true);
          // return;
          // console.log(flightSearchForm.getFieldsValue());
          await fetchFlightResults(flightSearchForm.getFieldsValue())
            .then((response) => {
              router.push(
                "/flight-results-redirect?flightRequestId=" + response.requestId
              );
            })
            .catch((error) => {
              setFlightSearchProcessingModalVisibility(false);
              // console.log("Caught Error 2:", error);
              // TODO: Pop up a dialog
              setFlightSearchErrorModalVisibility(true);
            });
          // console.log(
          //   "All fields values: " + flightSearchForm.getFieldsValue()
          // );
        })
        .catch((err) => {
          // console.error("Form Error:", err);
        });
    }
  };

  return (
    <>
      <FormAnt
        form={flightSearchForm}
        autoComplete="off"
        initialValues={{
          originLocationCityCode: departureData.iataCode,
          originDestinationCityCode: arrivalData.iataCode,
          departureDate: moment(flightRequestData.selectedDepartureDate).format(
            "YYYY-MM-DD"
          ),
          returningDate: moment(flightRequestData.selectedReturningDate).format(
            "YYYY-MM-DD"
          ),
          selectedDepartureDate: moment(
            flightRequestData.selectedDepartureDate
          ),
          selectedReturningDate: moment(
            flightRequestData.selectedReturningDate
          ),
        }}
      >
        {console.log(directFlight)}
        {/* flight destination div -- below */}
        <div className="flightdestination-div">
          <div className="container">
            <div className="row">
              {/* Take Off Airport Selection */}
              <div className="col-md-6 col-lg-3">
                <div
                  className="flight mt-3 mb-5"
                  style={{ position: "relative" }}
                >
                  <div className="roundtrip-label">From</div>
                  <div className="flight-booking-index">
                    <div className="flight-booking-icon">
                      <Image src={flightFrom} alt={"flight-from-icon"} />
                    </div>

                    {/* Start of input control */}
                    <FormAnt.Item
                      hidden={true}
                      name="originLocationCityCode"
                      rules={[
                        {
                          required: true,
                          message: "Please Enter Departing City!",
                        },
                      ]}
                    >
                      <Input name="originLocationCityCode" />
                    </FormAnt.Item>

                    <Tooltip placement="top" title="Departing City or Airport">
                      <Input
                        placeholder="Departing City or Airport"
                        allowClear={true}
                        ref={originLocationInput}
                        defaultValue={`${departureData.name} ${departureData.iataCode}}`}
                        // style={{border: '1px solid red'}}
                        onChange={async (e) => {
                          let value = e.currentTarget.value;
                          // If the field has no value...
                          if (!value || value.length < 3) {
                            // Set empty search result
                            setTakeOffAirportsFilterResult([]);
                            // Set selectedCustomer to null
                            // because 'user' is not specified
                            // as a result of the empty field
                            // setSelectedCustomer(null);
                            // Set customerSelectionError to true
                            // so that the field will not be validated
                            // if user has not selected a customer
                            // setCustomerSelectionError(true);
                            // Exit the function
                            return;
                          }
                          var filteredAirports = [];
                          var matches = await filterLocation(value);
                          // console.log(matches);

                          matches.forEach((match) => {
                            filteredAirports.push(match);
                          });
                          if (filteredAirports.length === 0) {
                            // console.log(
                            //   "Airport Result:",
                            //   "Airport not found!"
                            // );
                            setTakeOffAirportsFilterResult(filteredAirports);
                          } else {
                            // console.log("Airport Result:", filteredAirports);
                            setTakeOffAirportsFilterResult(filteredAirports);
                          }
                        }}
                        onBlur={(e) => {
                          if (
                            originLocationInput.current.state.value !== null
                          ) {
                            // console.log(
                            //   originLocationInput.current.state.value
                            // );
                            return;
                          }
                          // TODO: Why this if?
                          // if (customerSelectionError) {
                          //   // Clear the input
                          // console.git(push(e) => ())
                          //   originLocationInput.current.state.value = null;
                          //   // Empty the result collection
                          //   setTakeOffAirportsFilterResult([]);
                          // }
                          // Empty the result collection
                          setTakeOffAirportsFilterResult([]);
                        }}
                      />
                    </Tooltip>
                  </div>
                  <span className="required-style">{FromvalidationMsg}</span>
                  {takeOffAirportsFilterResult.length !== 0 ? (
                    <>
                      <List
                        className="filterOriginList"
                        dataSource={takeOffAirportsFilterResult}
                        renderItem={(item) => (
                          <List.Item
                            key={item.id}
                            style={{ padding: "0", borderBottom: "none" }}
                            onClick={() => {
                              // Set selected customer
                              // setSelectedCustomer(item);
                              let airport = item;
                              originLocationInput.current.state.value = `${airport.name} (${airport.iataCode})`;
                              flightSearchForm.setFieldsValue({
                                originLocationCityCode: `${airport.iataCode}`,
                              });

                              console.log(airport);

                              setTakeOffAirportsFilterResult([]);
                            }}
                          >
                            <Card size="small" style={{ width: "100%" }}>
                              <Card.Grid
                                style={{
                                  width: "100%",
                                  cursor: "pointer",
                                  padding: "12px",
                                  textAlign: "left",
                                  position: "relative",
                                }}
                              >
                                <div>{`${item.city}, ${item.country}`}</div>
                                <small>{`${item.name} (${item.iataCode})`}</small>
                                <div
                                  style={{
                                    position: "absolute",
                                    right: "0",
                                    top: "30%",
                                    marginRight: "12px",
                                    fontWeight: "500",
                                    border: "1px solid #0a0a0a",
                                    padding: "2px 5px",
                                    lineHeight: "1.5",
                                    borderRadius: "8px",
                                  }}
                                >{`${item.iataCode.toUpperCase()}`}</div>
                              </Card.Grid>
                            </Card>
                          </List.Item>
                        )}
                        style={{
                          maxHeight: "250px",
                          overflowY: "auto",
                          width: "100%",
                          position: "absolute",
                          zIndex: 1,
                        }}
                      ></List>
                    </>
                  ) : (
                    <></>
                  )}
                </div>
              </div>

              {/* Destination Airport Selection */}
              <div className="col-md-6 col-lg-3">
                <div
                  className="flight mt-3 mb-5"
                  style={{ position: "relative" }}
                >
                  <div className="roundtrip-label">To</div>
                  <div className="flight-booking-index">
                    <div className="flight-booking-icon">
                      <Image src={flightTo} alt={"flight-to-icon"} />
                    </div>

                    <FormAnt.Item
                      hidden={true}
                      name="originDestinationCityCode"
                    >
                      <Input name="originDestinationCityCode" />
                    </FormAnt.Item>

                    <Tooltip placement="top" title="Arriving City or Airport">
                      <Input
                        placeholder="Arriving City or Airport"
                        allowClear={true}
                        ref={originDestinationInput}
                        defaultValue={`${arrivalData.name} ${arrivalData.iataCode}`}
                        // style={{border: '1px solid red'}}
                        onChange={async (e) => {
                          let value = e.currentTarget.value;
                          // If the field has no value...
                          if (!value || value.length < 3) {
                            // Set empty search result
                            setDestinationAirportsFilterResult([]);
                            // Set selectedCustomer to null
                            // because 'user' is not specified
                            // as a result of the empty field
                            // setSelectedCustomer(null);
                            // Set customerSelectionError to true
                            // so that the field will not be validated
                            // if user has not selected a customer
                            // setCustomerSelectionError(true);
                            // Exit the function
                            return;
                          }
                          var filteredAirports = [];
                          var matches = await filterLocation(value);

                          matches.forEach((match) => {
                            filteredAirports.push(match);
                          });
                          if (filteredAirports.length === 0) {
                            // console.log(
                            //   "Airport Result:",
                            //   "Airport not found!"
                            // );
                            setDestinationAirportsFilterResult(
                              filteredAirports
                            );
                          } else {
                            // console.log("Airport Result:", filteredAirports);
                            setDestinationAirportsFilterResult(
                              filteredAirports
                            );
                          }
                        }}
                        onBlur={(e) => {
                          if (
                            originDestinationInput.current.state.value !== null
                          ) {
                            // console.log(
                            //   originDestinationInput.current.state.value
                            // );
                            return;
                          }
                          // TODO: Why this if?
                          // if (customerSelectionError) {
                          //   // Clear the input
                          //   originDestinationInput.current.state.value = null;
                          // }
                          // Empty the result collection
                          setDestinationAirportsFilterResult([]);
                        }}
                      />
                    </Tooltip>

                    {/* End of input control */}
                  </div>
                  <span className="required-style">{TovalidationMsg}</span>
                  {destinationAirportsFilterResult.length !== 0 ? (
                    <>
                      <List
                        className="filterOriginList"
                        dataSource={destinationAirportsFilterResult}
                        renderItem={(item) => (
                          <List.Item
                            key={item.id}
                            style={{ padding: "0", borderBottom: "none" }}
                            onClick={() => {
                              // Set selected customer
                              // setSelectedCustomer(item);
                              let airport = item;
                              originDestinationInput.current.state.value = `${airport.name} (${airport.iataCode})`;
                              flightSearchForm.setFieldsValue({
                                originDestinationCityCode: `${airport.iataCode}`,
                              });

                              // console.log(airport);
                              setDestinationAirportsFilterResult([]);
                            }}
                          >
                            <Card size="small" style={{ width: "100%" }}>
                              <Card.Grid
                                style={{
                                  width: "100%",
                                  cursor: "pointer",
                                  padding: "12px",
                                  textAlign: "left",
                                  position: "relative",
                                }}
                              >
                                <div>{`${item.city}, ${item.country}`}</div>
                                <small>{`${item.name} (${item.iataCode})`}</small>
                                <div
                                  style={{
                                    position: "absolute",
                                    right: "0",
                                    top: "30%",
                                    marginRight: "12px",
                                    fontWeight: "500",
                                    border: "1px solid #0a0a0a",
                                    padding: "2px 5px",
                                    lineHeight: "1.5",
                                    borderRadius: "8px",
                                  }}
                                >{`${item.iataCode.toUpperCase()}`}</div>
                              </Card.Grid>
                            </Card>
                          </List.Item>
                        )}
                        style={{
                          maxHeight: "250px",
                          overflowY: "auto",
                          width: "100%",
                          position: "absolute",
                          zIndex: 1,
                        }}
                      ></List>
                    </>
                  ) : (
                    <></>
                  )}
                </div>
              </div>

              {/* Departure Date Selection */}
              <div className="col-md-6 col-lg-3">
                <div className="flight mt-3 mb-5">
                  <div className="roundtrip-label">Departure Date</div>
                  <div className="flight-booking-index">
                    <div className="flight-booking-icon">
                      <Image src={calenderIcon} alt={"calender-icon"} />
                    </div>
                    <FormAnt.Item name="selectedDepartureDate">
                      <DatePicker
                        placeholder="Departing"
                        superNextIcon={null}
                        disabledDate={disabledDate}
                        format={"D MMM YYYY"}
                        defaultValue={moment(
                          flightRequestData.selectedDepartureDate
                        )}
                        onChange={() => {
                          const updatedDepartureDate =
                            flightSearchForm.getFieldsValue()
                              .selectedDepartureDate
                              ? flightSearchForm
                                  .getFieldsValue()
                                  .selectedDepartureDate.format("YYYY-MM-DD")
                              : "";

                          flightSearchForm.setFieldsValue({
                            departureDate: updatedDepartureDate,
                          });

                          setDepartureDateState(updatedDepartureDate);
                          // console.log("departureDate: " + updatedDepartureDate);
                        }}
                      />
                    </FormAnt.Item>
                    <FormAnt.Item hidden={true} name="departureDate">
                      <Input name="departureDate" />
                    </FormAnt.Item>
                  </div>
                  {/* <span className="required-style">{dateErrorMsg}</span> */}
                </div>
              </div>

              {/* Arrival Date Selection */}
              <div className="col-md-6 col-lg-3">
                <div className="flight mt-3 mb-5">
                  <div className="roundtrip-label">Arriving Date</div>
                  <div className="flight-booking-index">
                    <div className="flight-booking-icon">
                      <Image src={calenderIcon} alt={"calender-icon"} />
                    </div>
                    <FormAnt.Item name="selectedReturningDate">
                      <DatePicker
                        placeholder="Returning"
                        superNextIcon={null}
                        disabledDate={disbaledArrivalDate}
                        defaultValue={moment(
                          flightRequestData.selectedDepartureDate
                        )}
                        format={"D MMM YYYY"}
                        onChange={() => {
                          const updatedReturningDate =
                            flightSearchForm.getFieldsValue()
                              .selectedReturningDate
                              ? flightSearchForm
                                  .getFieldsValue()
                                  .selectedReturningDate.format("YYYY-MM-DD")
                              : "";

                          flightSearchForm.setFieldsValue({
                            returningDate: updatedReturningDate,
                          });

                          setReturningDateState(updatedReturningDate);
                          // console.log("returningDate: " + updatedReturningDate);
                        }}
                        onBlur={dateFormHandler}
                      />
                    </FormAnt.Item>
                    <FormAnt.Item hidden={true} name="returningDate">
                      <Input name="returningDate" />
                    </FormAnt.Item>
                  </div>
                  <span className="required-style">{dateErrorMsg}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* flight destination div -- below */}
        <div className="passengerInfo">
          <div className="container">
            <div className="row">
              <div className="col-md-6 col-lg-3">
                <div className="flight">
                  <div className="flight-booking-index">
                    <div className="flight-booking-icon">
                      <Image src={flightClass} alt={"flight-from-icon"} />
                    </div>

                    <FormAnt.Item name="flightClass" initialValue={cabin}>
                      <Select defaultValue="ECONOMY" name="flightClass">
                        <Select.Option value="ECONOMY">Economy</Select.Option>
                        <Select.Option value="PREMIUM_ECONOMY">
                          Premium Economy
                        </Select.Option>
                        <Select.Option value="BUSINESS">Business</Select.Option>
                        <Select.Option value="FIRST">First Class</Select.Option>
                      </Select>
                    </FormAnt.Item>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-lg-3">
                <div className="flight">
                  <FormAnt.Item
                    hidden={true}
                    name="numberOfAdults"
                    initialValue={adultNumValue}
                  >
                    <InputNumber name="numberOfAdults" value={adultNumValue} />
                  </FormAnt.Item>
                  <div className="passenger-index">
                    <div className="passenger-icon">
                      <Image src={adultIcon} alt={"adult-icon"} />
                    </div>
                    <div className="passenger-content">
                      <div>
                        <div className="passenger-label">Adult</div>
                        <small className="passenger-label-small">
                          12+ Years
                        </small>
                      </div>
                      <PlusMinusButton
                        increaseNum={increaseAdultNum}
                        decreaseNum={decreaseAdultNum}
                        numValue={adultNumValue}
                        onChange={flightNumRestriction}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-lg-3">
                <div className="flight">
                  <FormAnt.Item
                    hidden={true}
                    name="numberOfChildren"
                    initialValue={childrenNumValue}
                  >
                    <InputNumber
                      name="numberOfChildren"
                      value={childrenNumValue}
                    />
                  </FormAnt.Item>
                  <div className="passenger-index">
                    <div className="passenger-icon">
                      <Image src={childrenIcon} alt={"children-icon"} />
                    </div>
                    <div className="passenger-content">
                      <div>
                        <div className="passenger-label">Children </div>
                        <small className="passenger-label-small">
                          2-11 Years
                        </small>
                      </div>
                      <PlusMinusButton
                        increaseNum={increaseChildrenNum}
                        decreaseNum={decreaseChildrenNum}
                        numValue={childrenNumValue}
                        onChange={flightNumRestriction}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-lg-3">
                <div className="flight">
                  <FormAnt.Item
                    hidden={true}
                    name="numberOfInfants"
                    initialValue={infantsNumValue}
                  >
                    <InputNumber name="numberOfInfants" />
                  </FormAnt.Item>
                  <div className="passenger-index">
                    <div className="passenger-icon">
                      <Image src={babyIcon} alt={"infant-icon"} />
                    </div>
                    <div className="passenger-content">
                      <div>
                        <div className="passenger-label">Infant </div>
                        <small className="passenger-label-small">
                          {" "}
                          0-2Years{" "}
                        </small>
                      </div>
                      <PlusMinusButton
                        increaseNum={increaseInfantsNum}
                        decreaseNum={decreaseInfantsNum}
                        numValue={infantsNumValue}
                        onChange={flightNumRestriction}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ****** */}
        <div className="flightsearch-btn mt-3 mb-3">
          <div className="container">
            {/* <div className="addflight-div">
              <div className="directflight-indicate">
                <div className="flight-checkbox d-flex ">
                  <Form.Group className="" controlId="formBasicCheckbox">
                    <Form.Check
                      className="form-checkbox-custom"
                      type="checkbox"
                    />
                  </Form.Group>
                  <p className="checkbox-paragraph"> Direct Flight Only</p>


                  <Form.Group
                    className="arithmetic-checkbox"
                    controlId="formBasicCheckbox"
                    >
                    <Form.Check
                      className="form-checkbox-custom"
                      type="checkbox"
                      />
                  </Form.Group>
                  <p className="checkbox-paragraph">+/-3</p>
                </div>
              </div>
            </div> */}

            <div className="addflight-div">
              <div
                className="checkbox-flex-div"
                style={{ display: "flex", alignItems: "center", width: "40%" }}
              >
                <FormAnt.Item name="directFlightOnly" valuePropName="checked">
                  <Checkbox
                    className="antd-checkbox-custom-booking"
                    onChange={onChange}
                    defaultChecked={directFlight}
                  >
                    {" "}
                    Direct Flight Only
                  </Checkbox>
                </FormAnt.Item>
                <FormAnt.Item name="dateWindow" valuePropName="checked">
                  <Checkbox
                    className="antd-checkbox-custom-booking"
                    onChange={onChange}
                  >
                    {" "}
                    +/- 3
                  </Checkbox>
                </FormAnt.Item>
              </div>

              {/* {console.log(flightSearchForm.getFieldsValue().directFlightOnly)} */}
              <FormAnt.Item className="search-flex-div">
                <Button
                  style={{
                    backgroundColor: "#0043a4",
                    color: "#fff",
                    width: "120px",
                    height: "60px",
                  }}
                  className="antd-btn-custom"
                  onClick={onClickRoundTrip}
                >
                  Search
                </Button>
              </FormAnt.Item>
            </div>
          </div>
        </div>
      </FormAnt>

      <Modal
        centered
        open={flightSearchProcessingModalVisibility}
        width="auto"
        closable={false}
        keyboard={false}
        footer={null}
        className="loadFlightModal"
        bodyStyle={{ backgroundColor: "#0043a4", padding: "2rem" }}
      >
        <p className="flightModalTitle">Loading the best flights</p>
        <div className="row row-custom">
          <div
            className="col-4 col-sm-4 flightFrom"
            style={{ display: "flex", flexDirection: "column" }}
          >
            <p className="flightStatus">Flight</p>
            <p className="flightStatus">From:</p>
            <p className="flightModalCode" style={{ textAlign: "start" }}>{`${
              flightSearchForm.getFieldsValue().originLocationCityCode
            }`}</p>
          </div>

          <div className="col-4 col-sm-4 plane-img">
            <Image src={aeroplaneImg} alt={"aeroplane-img"} />
          </div>
          <div
            className="col-4 col-sm-4 flightTo"
            style={{ display: "flex", flexDirection: "column" }}
          >
            <p className="flightStatus" style={{ textAlign: "end" }}>
              Flight
            </p>
            <p className="flightStatus" style={{ textAlign: "end" }}>
              To:
            </p>
            <p className="flightModalCode" style={{ textAlign: "end" }}>{`${
              flightSearchForm.getFieldsValue().originDestinationCityCode
            }`}</p>
          </div>
        </div>
        <p className="flightModalTitle">
          {`${new Date(
            flightSearchForm.getFieldsValue().selectedDepartureDate
          ).toLocaleString("default", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })} `}
          <span> - </span>
          {`${new Date(
            flightSearchForm.getFieldsValue().selectedReturningDate
          ).toLocaleString("default", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}`}
        </p>
        <p className="flightModalTitle">
          {adultNumValue + childrenNumValue + infantsNumValue} Passengers
        </p>
        <p className="flightModalTitle">
          {getCabinClass(flightSearchForm.getFieldsValue().flightClass)}
        </p>

        <div>
          <center>
            <Spin style={{ color: "rgba(252, 166, 43, 0.8)" }} />
          </center>
        </div>
      </Modal>

      <Modal
        onOk={handleOk}
        closable={true}
        onCancel={hideModal}
        centered
        open={flightSearchErrorModalVisibility}
        style={{ color: "#fff" }}
        width="auto"
        keyboard={false}
        footer={null}
        className="loadFlightModal"
        bodyStyle={{ backgroundColor: "#0043a4", padding: "3rem" }}
      >
        <p className="flightModalTitle">
          Oops!, Please check your inputs and try again.
        </p>
      </Modal>
    </>
  );
};

export default DrawerRoundtrip;
