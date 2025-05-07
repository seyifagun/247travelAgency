import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useRouter } from "next/router";
import Image from "next/image";
import flightFrom from "../public/icons/flight-from.webp";
import flightTo from "../public/icons/flight-to_.webp";
import calenderIcon from "../public/icons/calender.webp";
import CalenderIcon from "../public/icons/calender.png";
import flightClass from "../public/icons/flight-class.webp";
import babyIcon from "../public/icons/Infant.webp";
import childrenIcon from "../public/icons/children.webp";
import adultIcon from "../public/icons/adult.webp";
import arrowIcon from "../public/icons/left-arrow.png";
// import aeroplaneImg from "../../public/aeroplane.png";
import aeroplaneImg from "../public/icons/aeroplaneImg.png";
import PlusMinusButton from "../components/PlusMinusButton";
import { DatePicker, Input, InputNumber, Tooltip } from "antd";
import moment from "moment";
import parseFormat from "moment-parseformat";
import { Form as FormAnt, List, Card, Checkbox } from "antd";
import { Menu, Button, Select, Modal, Spin } from "antd";
import { useFetchFlightResults } from "../pages/api/apiClient";
import { useFetchAirports } from "../pages/api/apiClient";
import { useDispatch } from "react-redux";

const { RangePicker } = DatePicker;

const OnelineForm = ({ airports }) => {
  const [dateErrorMsg, setDateErrorMsg] = useState("");
  const dispatch = useDispatch();
  const menu = (
    <Menu>
      <Menu.Item key="1">Economy</Menu.Item>
      <Menu.Divider />
      <Menu.Item key="2">Premium Economy</Menu.Item>
      <Menu.Divider />
      <Menu.Item key="3">Business Class</Menu.Item>
      <Menu.Divider />
      <Menu.Item key="4">First Class</Menu.Item>
    </Menu>
  );

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

  // SETTING FLIGHT PASSENGER NUMBER RESTRICTION TO BE LESS THAN 9

  const [flightNumberRestriction, setFlightNumberRestriction] = useState(false);

  function flightNumRestriction() {
    return adultNumValue + childrenNumValue + infantsNumValue > 9;
    // flightNumberRestriction;
  }

  // onSubmit flightSearch function
  const onClickRoundTrip = () => {
    // console.log(flightSearchForm.getFieldsValue());
    // return;
    window.localStorage.setItem(
      "flightRequest",
      JSON.stringify(flightSearchForm.getFieldsValue())
    );
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
              console.log("Caught Resp:", response);
              router.push("/flight-match");
              // setFlightSearchProcessingModalVisibility(false);
            })
            .catch((error) => {
              setFlightSearchProcessingModalVisibility(false);
              console.log("Caught Error 2:", error);
              // TODO: Pop up a dialog
              setFlightSearchErrorModalVisibility(true);
            });
          console.log(
            "All fields values: " + flightSearchForm.getFieldsValue()
          );
        })
        .catch((err) => {
          console.error("Form Error:", err);
        });
    }
  };

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

  // states for form validation
  const [FromvalidationMsg, setFromValidationMsg] = useState("");
  const [TovalidationMsg, setToValidationMsg] = useState("");

  // state to track arrival date
  const [arrivalDate, setArrivalDate] = useState();

  function handleArrivalDate(current) {
    const departingDate =
      flightSearchForm.getFieldsValue().selectedReturningDate;
    console.log("Log: " + current);
    // console.log(departingDate && departingDate < moment && current < flightSearchForm.getFieldsValue().selectedReturningDate);
    return current && current < moment().subtract(12, "hours");
    // return current && moment() < departingDate;
    //  return current && current < moment && current < flightSearchForm.getFieldsValue().selectedReturningDate;
    // flightSearchForm
    //   .getFieldsValue()
    //   .selectedReturningDate;

    // setArrivalDate(flightSearchForm
    //   .getFieldsValue()
    //   .selectedReturningDate);
  }

  // console.log(handleArrivalDate)

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

  //
  const [takeOffFieldValidated, setTakeOffFieldValidated] = useState(false);

  //
  const [destinationFieldValidated, setDestinationFieldValidated] =
    useState(false);

  const [adultNumValue, setAdultNumValue] = useState(1);
  const [childrenNumValue, setChildrenNumValue] = useState(0);
  const [infantsNumValue, setInfantsNumValue] = useState(0);

  const adultMinValue = 1;
  const childernMinValue = 0;
  const infantsMinValue = 0;

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

  //#endregion

  //#region Hooks

  const navigate = useNavigate();

  const router = useRouter();

  const originLocationInput = useRef();

  // create hook for Destination Input
  const originDestinationInput = useRef();

  const fetchFlightResults = useFetchFlightResults();

  const [flightSearchForm] = FormAnt.useForm();

  const [isShow, setIsShow] = useState(false);

  const [departureDateState, setDepartureDateState] = useState(
    flightSearchForm.getFieldsValue().selectedDepartureDate
  );

  const [returningDateState, setReturningDateState] = useState(
    flightSearchForm.getFieldsValue().selectedReturningDate
  );

  const handleOk = () => {
    setIsShow(false);
  };

  const handleCancel = () => {
    setIsShow(false);
  };

  const [visible, setVisible] = useState(false);

  const showModal = () => {
    setVisible(true);
  };

  const hideModal = () => {
    setFlightSearchErrorModalVisibility(false);
  };

  // Hook to display modal when > 9 passengers are booked

  const hideFlightRestrictionModal = () => {
    setFlightNumberRestriction(false);
  };

  //#endregion

  function range(start, end) {
    const result = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  }

  function disabledDate(current) {
    // Can not select days before today
    //   return moment().add(6, "hours");
    // return current && current < moment().subtract(12, "hours");
    // console.log(moment(current));
    return current && current < moment().subtract(12, "hours");
    // return current;
  }

  // console.log(disabledDate());

  // console.log(moment().add(12, "hours"));
  // console.log(moment());
  // console.log(
  //   flightSearchForm.getFieldsValue().selectedDepartureDate.format("YYYY-MM-DD")
  // );
  const formattedDepartureDate = new Date(departureDateState);
  // console.log(departureDateState);
  // console.log(formattedDepartureDate);
  function disbaledArrivalDate(current) {
    // console.log(
    //   "Current Moment date: " + current && current < moment().add(12, "days")
    console.log(departureDateState);
    // );
    // console.log("Moment Moment date: " + moment());
    const selectedDepartureDateForDatePicker =
      flightSearchForm.getFieldsValue().selectedDepartureDate;
    // const selectedDepartureDateForDatePicker = flightSearchForm.getFieldsValue().selectedDepartureDate;
    // moment.min(moment(), selectedDepartureDateForDatePicker);
    // return current && current < moment().add(70, "days");
    // const formattedDepartureDate = new Date(departureDateState);
    return current && current < moment(departureDateState, "YYYY-MM-DD");
  }

  // disbaledArrivalDate();

  // console.log(flightSearchForm.getFieldsValue().selectedDepartureDate);
  // console.log(moment().add(10, 'day'));

  function disabledPickedDate(DepartureDateSelected) {
    DepartureDateSelected, dd, mm, yyyy;
    DepartureDateSelected = flightSearchForm.setFieldsValue({
      departureDate: flightSearchForm.getFieldsValue().selectedDepartureDate,
    });

    var dd = DepartureDateSelected.getDate() + 1;
    var mm = DepartureDateSelected.getMonth() + 1;
    var yyyy = DepartureDateSelected.getFullYear();
    // return yyyy +"-"+ mm + "-" + dd;
    return DepartureDateSelected && DepartureDateSelected < moment();
  }

  function onChange(e) {
    console.log(`checked = ${e.target.checked}`);
    console.log(flightSearchForm.getFieldsValue().directFlightOnly);
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

  const { Option } = Select;

  function handleChange(value) {
    console.log(`selected ${value}`);
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

  const [showTravelClassnNumber, setShowTravelClassnNumber] = useState(false);

  const pickNumofTravelernClass = () => {
    setShowTravelClassnNumber(!showTravelClassnNumber);
  };

  const showPicker = showTravelClassnNumber ? <CustomDropdown /> : <></>;

//  CREATE HOOK TO HOLD DEFAULT VALUES IN STATE SELECT

const [passengerNumber, setPassengerNumber] = useState("1");

const [passengerClass, setPassengerClass] = useState("Premium");

  return (
    <>
       <FormAnt form={flightSearchForm} autoComplete="off">
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
                        name="selectedTakeOffAirport"
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
                        name="selectedTakeOffAirport"
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
                            console.log(
                              "Airport Result:",
                              "Airport not found!"
                            );
                            setDestinationAirportsFilterResult(
                              filteredAirports
                            );
                          } else {
                            console.log("Airport Result:", filteredAirports);
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

                              console.log(airport);
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
                        onChange={() => {
                          flightSearchForm.setFieldsValue({
                            departureDate: flightSearchForm.getFieldsValue()
                              .selectedDepartureDate
                              ? flightSearchForm
                                  .getFieldsValue()
                                  .selectedDepartureDate.format("YYYY-MM-DD")
                              : "",
                          });
                          // console.log(
                          //   flightSearchForm
                          //     .getFieldsValue()
                          //     .selectedDepartureDate.format("YYYY-MM-DD")
                          // );
                          const updatedDepartureDate =
                            flightSearchForm.getFieldsValue()
                              .selectedDepartureDate
                              ? flightSearchForm
                                  .getFieldsValue()
                                  .selectedDepartureDate.format("YYYY-MM-DD")
                              : "";
                          setDepartureDateState(updatedDepartureDate);
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
                        // disabledDate={disbaledArrivalDate}
                        disabledDate={disabledDate}
                        format={"D MMM YYYY"}
                        onChange={() => {
                          flightSearchForm.setFieldsValue({
                            returningDate: flightSearchForm.getFieldsValue()
                              .selectedReturningDate
                              ? flightSearchForm
                                  .getFieldsValue()
                                  .selectedReturningDate.format("YYYY-MM-DD")
                              : "",
                          });

                          const updatedReturningDate =
                            flightSearchForm.getFieldsValue()
                              .selectedReturningDate
                              ? flightSearchForm
                                  .getFieldsValue()
                                  .selectedReturningDate.format("YYYY-MM-DD")
                              : "";

                          setReturningDateState(updatedReturningDate);
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

                    <FormAnt.Item name="flightClass" initialValue="ECONOMY">
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
                          
                          0-2Years
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

        {/* ***check button and submit button*** */}
        <div className="flightsearch-btn mt-3 mb-3">
          <div className="container">
            <div className="addflight-div">
              <div
                className="checkbox-flex-div"
                style={{ display: "flex", alignItems: "center", width: "40%" }}
              >
                <FormAnt.Item name="directFlightOnly" valuePropName="checked">
                  <Checkbox
                    className="antd-checkbox-custom-booking"
                    onChange={onChange}
                    // defaultChecked={false}
                  >
                    {" "}
                    Direct Flight Only
                  </Checkbox>
                </FormAnt.Item>
                <FormAnt.Item name="dateWindow" valuePropName="checked">
                  <Checkbox
                    className="antd-checkbox-custom-booking"
                    onChange={onChange}
                    // defaultChecked={false}
                  >
                    +/- 3
                  </Checkbox>
                </FormAnt.Item>
              </div>

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
      <div className="container">
        <FormAnt form={flightSearchForm} autoComplete="off">
          <div className="flightsearch-section-new">
            <div className="container">
              <div className="row">
                {/* Destination Airport Selection */}
                <div className="col-md-6 col-lg-2">
                  <div className="departure-inputField">
                    <div className="flight-search-select-section">
                      {/* <div className="flight-booking-icon">
                      <Image src={flightFrom} alt={"flight-from-icon"} />
                    </div> */}

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
                      <Tooltip
                        placement="top"
                        title="Departing City or Airport"
                      >
                        <Input
                          placeholder="Departing City or Airport"
                          allowClear={true}
                          ref={originLocationInput}
                          name="selectedTakeOffAirport"
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
                {/* Image of aeroplane icon */}
                <div className="col-md-6 col-lg-1 aeroImg-config">
                  <div className="aeroplane-img-icon">
                    <Image
                      src={aeroplaneImg}
                      alt="aeroplane-img"
                      width={60}
                      height={30}
                    />
                  </div>
                </div>
                {/* Destination Airport Selection */}
                <div className="col-md-6 col-lg-2">
                  <div className="arrival-inputField">
                    <div className="flight-search-select-section">
                      {/* <div className="flight-booking-icon">
                      <Image src={flightTo} alt={"flight-to-icon"} />
                    </div> */}

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
                          name="selectedTakeOffAirport"
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
                              console.log(
                                "Airport Result:",
                                "Airport not found!"
                              );
                              setDestinationAirportsFilterResult(
                                filteredAirports
                              );
                            } else {
                              console.log("Airport Result:", filteredAirports);
                              setDestinationAirportsFilterResult(
                                filteredAirports
                              );
                            }
                          }}
                          onBlur={(e) => {
                            if (
                              originDestinationInput.current.state.value !==
                              null
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

                                console.log(airport);
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
                {/*Departure Date */}
                <div className="col-md-6 col-lg-2">
                  <div className="departure-inputDate">
                    <div className="flight-search-select-section border-left">
                      <div className="flight-search-icon">
                        <Image src={CalenderIcon} alt={"calender-icon"} />
                      </div>
                      <FormAnt.Item name="selectedDepartureDate">
                        <div className="departureDate-wrapper">
                          <DatePicker
                            placeholder="Departing"
                            superNextIcon={null}
                            disabledDate={disabledDate}
                            format={"D MMM YYYY"}
                            onChange={() => {
                              flightSearchForm.setFieldsValue({
                                departureDate: flightSearchForm.getFieldsValue()
                                  .selectedDepartureDate
                                  ? flightSearchForm
                                      .getFieldsValue()
                                      .selectedDepartureDate.format(
                                        "YYYY-MM-DD"
                                      )
                                  : "",
                              });
                              const updatedDepartureDate =
                                flightSearchForm.getFieldsValue()
                                  .selectedDepartureDate
                                  ? flightSearchForm
                                      .getFieldsValue()
                                      .selectedDepartureDate.format(
                                        "YYYY-MM-DD"
                                      )
                                  : "";
                              setDepartureDateState(updatedDepartureDate);
                            }}
                          />
                        </div>
                      </FormAnt.Item>
                      <FormAnt.Item hidden={true} name="departureDate">
                        <Input name="departureDate" />
                      </FormAnt.Item>
                    </div>
                  </div>
                </div>
                {/*Arrival Date */}
                <div className="col-md-6 col-lg-2">
                  <div className="arrival-inputDate">
                    <div className="flight-search-select-section border-left">
                      <div className="flight-search-icon">
                        <Image src={CalenderIcon} alt={"calender-icon"} />
                      </div>
                      <FormAnt.Item name="selectedReturningDate">
                        <DatePicker
                          placeholder="Returning"
                          superNextIcon={null}
                          // disabledDate={disbaledArrivalDate}
                          disabledDate={disabledDate}
                          format={"D MMM YYYY"}
                          onChange={() => {
                            flightSearchForm.setFieldsValue({
                              returningDate: flightSearchForm.getFieldsValue()
                                .selectedReturningDate
                                ? flightSearchForm
                                    .getFieldsValue()
                                    .selectedReturningDate.format("YYYY-MM-DD")
                                : "",
                            });

                            const updatedReturningDate =
                              flightSearchForm.getFieldsValue()
                                .selectedReturningDate
                                ? flightSearchForm
                                    .getFieldsValue()
                                    .selectedReturningDate.format("YYYY-MM-DD")
                                : "";

                            setReturningDateState(updatedReturningDate);
                          }}
                          onBlur={dateFormHandler}
                        />
                      </FormAnt.Item>
                      <FormAnt.Item hidden={true} name="returningDate">
                        <Input name="returningDate" />
                      </FormAnt.Item>
                    </div>
                  </div>
                </div>
                {/* Dropdown 4 traveller Num and class type */}
                <div className="col-md-6 col-lg-2">
                  <div className="select-inputField border-left flight custom-dropdown-travelerAndClass" onClick={pickNumofTravelernClass}>
                      <div className="flightClass-wrapper"><Image src={flightClass} alt="flight-class-img"  /></div>
                      {passengerNumber}, {passengerClass}

                  </div>
                </div>
                {/* Button */}
                <div className="col-md-12 col-lg-1">
                  <div className="roundtrip-searchBtn-wrapper">
                    <FormAnt.Item className="search-flex-div">
                      <Button
                        style={{
                          backgroundColor: "#0043a4",
                          color: "#fff",
                          width: "120px",
                          height: "50px",
                          textAlign: "center",
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
            </div>
          </div>
        </FormAnt>
      </div>
      <div style={{ display: "inline-flex" }}>{showPicker}</div>

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
          {/* {adultNumValue + childrenNumValue + infantsNumValue} Passengers */}
          {pluralizeAndStringify(
            adultNumValue + childrenNumValue + infantsNumValue,
            "passenger"
          )}
        </p>
        <p className="flightModalTitle">
          {flightSearchForm.getFieldsValue().flightClass}
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
        // open={visible}
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

      <Modal
        onOk={handleOk}
        closable={true}
        onCancel={hideFlightRestrictionModal}
        centered
        // open={visible}
        open={flightNumberRestriction}
        style={{ color: "#fff" }}
        width="auto"
        keyboard={false}
        footer={null}
        className="loadFlightModal"
        bodyStyle={{ backgroundColor: "#0043a4", padding: "3rem" }}
      >
        <p className="flightModalTitle">Cannot select more than 9 Passengers</p>
      </Modal>
    </>
  );
};

function itemTemplate(airport) {
  return (
    <List.Item
      key={airport.iataCode}
      style={{ padding: "0", borderBottom: "none" }}
    >
      <Card size="small" style={{ width: "100%" }}>
        <Card.Grid
          style={{
            width: "100%",
            cursor: "pointer",
            padding: "12px",
          }}
        >
          <List.Item.Meta
            title={
              <span>
                <strong>{`${airport.name} (${airport.iataCode})`}</strong>
              </span>
            }
          />
          {/* <div>Content</div> */}
        </Card.Grid>
      </Card>
    </List.Item>
  );
}

export default OnelineForm;

export function pluralizeAndStringify(value, word, suffix = "s") {
  if (value == 1) {
    return value + " " + "Passenger";
  } else {
    return value + " " + "Passenger" + suffix;
  }
}

export const CustomDropdown = () => {

  function flightNumRestriction() {
    return adultNumValue + childrenNumValue + infantsNumValue > 9;
    // flightNumberRestriction;
  }
  const [adultNumValue, setAdultNumValue] = useState(1);
  const [childrenNumValue, setChildrenNumValue] = useState(0);
  const [infantsNumValue, setInfantsNumValue] = useState(0);

  const adultMinValue = 1;
  const childernMinValue = 0;
  const infantsMinValue = 0;

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

  const [PassengerNumberAndClassType] = FormAnt.useForm();

  

  let onChange = (event) => {
    console.log(event.target.value); 

  }
  
  return (
    <>
    <FormAnt form={PassengerNumberAndClassType}>
        {console.log("Show form values", PassengerNumberAndClassType.getFieldsValue())}
      <div className="dropdown-border">
        <div className="classType-div">
          <div className="row">
            <div className="col-sm-12 col-md-6">
              <FormAnt.Item>
                <Button type="submit" className="class-block" 
                onChange={onChange}
                value="Economy">
                  Economy
                </Button>
              </FormAnt.Item>
            </div>
            <div className="col-sm-12 col-md-6">
              <FormAnt.Item>
                <Button type="submit" className="class-block">
                  Premium
                </Button>
              </FormAnt.Item>
            </div>
            <div className="col-sm-12 col-md-6">
              <FormAnt.Item>
                <Button type="submit" className="class-block">
                  Business
                </Button>
              </FormAnt.Item>
            </div>
            <div className="col-sm-12 col-md-6">
              <FormAnt.Item>
                <Button type="submit" className="class-block">
                  First
                </Button>
              </FormAnt.Item>
            </div>
          </div>
        </div>
        <div className="travelerNum-div">
          <div className="pickNumofTraveler">
            <div className="flight">
              <FormAnt.Item
                hidden={true}
                name="numberOfAdults"
                initialValue={adultNumValue}
              >
                <InputNumber name="numberOfAdults" value={adultNumValue} />
              </FormAnt.Item>
              <div className="passenger-styled-div">
                <div className="passenger-icon">
                  <Image src={adultIcon} alt={"adult-icon"} />
                </div>
                <div className="passenger-content">
                  <div>
                    <div className="passenger-label">Adult</div>
                    <small className="passenger-label-small">12+ Years</small>
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
          <div className="pickNumofTraveler">
            <div className="flight">
              <FormAnt.Item
                hidden={true}
                name="numberOfChildren"
                initialValue={childrenNumValue}
              >
                <InputNumber name="numberOfChildren" value={childrenNumValue} />
              </FormAnt.Item>
              <div className="passenger-styled-div">
                <div className="passenger-icon">
                  <Image src={childrenIcon} alt={"children-icon"} />
                </div>
                <div className="passenger-content">
                  <div>
                    <div className="passenger-label">Children </div>
                    <small className="passenger-label-small">2-11 Years</small>
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
          <div className="pickNumofTraveler">
            <div className="flight">
              <FormAnt.Item
                hidden={true}
                name="numberOfInfants"
                initialValue={infantsNumValue}
              >
                <InputNumber name="numberOfInfants" />
              </FormAnt.Item>
              <div className="passenger-styled-div">
                <div className="passenger-icon">
                  <Image src={babyIcon} alt={"infant-icon"} />
                </div>
                <div className="passenger-content">
                  <div>
                    <div className="passenger-label">Infant </div>
                    <small className="passenger-label-small"> 0-2Years </small>
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
    </FormAnt>
    </>
  );
};
