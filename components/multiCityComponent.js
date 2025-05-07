import React, { useState, useRef } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { Form as FormAnt } from "antd";
import { DatePicker } from "antd";
import {
  Menu,
  Button,
  Tooltip,
  Dropdown as DropdownAnt,
  List,
  Card,
  Input,
  Select,
} from "antd";
import Image from "next/image";
import flightFrom from "../public/icons/flight-from.webp";
import flightTo from "../public/icons/flight-to_.webp";
import calenderIcon from "../public/icons/calender.webp";
import moment from "moment";
import { useFetchFlightResultsOneway } from "../pages/api/apiClient";

const { Option } = Select;

const MultiCityComponent = ({ airports }) => {

  //#region States

  // const airports = useSelector((state) => state.store.airports);

  const router = useRouter();

  const fetchFlightResultsOneway = useFetchFlightResultsOneway();


  function onChange(e) {
    console.log(`checked = ${e.target.checked}`);
  }

  const [isShow, setIsShow] = useState(false);

  const handleOk = () => {
    setIsShow(false);
  };

  const handleCancel = () => {
    setFlightSearchErrorModalVisibility(false);
  };

  // *************************** FLIGHT TAKEOFF & DEPARTURE **************************************

  // Flight TakeOffInput
  function onOriginLocationSelected(originLocation) {
    console.log(originLocation.itemData);
    flightSearchForm.setFieldsValue({
      takeOffAirport: originLocation.itemData.iataCode,
    });
    flightSearchForm.setFieldsValue({
      originLocationCityCode: `${originLocation.itemData.city} (${originLocation.itemData.iataCode})`,
    });
  }
  // Flight Departure
  function onDestinationLocationSelected(originLocation) {
    console.log(originLocation.itemData);
    flightSearchForm.setFieldsValue({
      destinationAirport: originLocation.itemData.iataCode,
    });
    flightSearchForm.setFieldsValue({
      originDestinationCityCode: `${originLocation.itemData.city} (${originLocation.itemData.iataCode})`,
    });
  }

  // *************************** CALENDER SECTION **********************************

  // Edit Calender
  function disabledDate(current) {
    // Can not select days before today and today
    return current && current < moment();
  }

  // *********************************************************************************

  // Hook for TakeOff Input
  const takeOffInput = useRef();

  // create hook for Destination Input
  const destinationInput = useRef();

  // Create Hook to hold passenger data in state
  const [flightSearchForm] = FormAnt.useForm();

  // Create Hook to hold Airport takeoff & departure Search Filter Result
  const [takeOffAirportsFilterResult, setTakeOffAirportsFilterResult] =
    useState([]);

  const [destinationAirportsFilterResult, setDestinationAirportsFilterResult] =
    useState([]);

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

  // *************************** PASSENGER SECTION **********************************

  const [flightNumberRestriction, setFlightNumberRestriction] = useState(false);

  // Hook to display modal when > 9 passengers are booked

const hideFlightRestrictionModal = () => {
  setFlightNumberRestriction(false);
};

function flightNumRestriction() {
  return adultNumValue + childrenNumValue + infantsNumValue > 9;
  // flightNumberRestriction;
}

  // PlusMinus Button functionality
  const [adultNumValue, setAdultNumValue] = useState(1);
  const [childrenNumValue, setChildrenNumValue] = useState(0);
  const [infantsNumValue, setInfantsNumValue] = useState(0);

  const adultMinValue = 1;
  const childrenMinValue = 0;
  const infantsMinValue = 0;

  // function for increasing/decreasing AdulutValue Form ||
  function increaseAdultNum() {
    setAdultNumValue(++adultNumValue);
    // Update the Form Value
    flightSearchForm.setFieldsValue({ numberOfAdults: adultNumValue });
  }

  // function for decreasing AdultNum
  function decreaseAdultNum() {
    if (adultNumValue <= adultMinValue) {
      return;
    }
    setAdultNumValue(--adultNumValue);
    // Update the Form value
    flightSearchForm.setFieldsValue({ numberOfAdults: adultNumValue });
    console.log("print", adultNumValue);
  }

  // function for increasing/decreasing ChildrenValue Form ||
  function increaseChildrenNum() {
    setChildrenNumValue(++childrenNumValue);
    // Update the Form Value
    flightSearchForm.setFieldsValue({ numberOfChildren: childrenNumValue });
  }

  // function for decreasing ChildrenNum
  function decreaseChildrenNum() {
    if (childrenNumValue <= childrenMinValue) {
      return;
    }
    setChildrenNumValue(--childrenNumValue);
    // Update the Form Value
    flightSearchForm.setFieldsValue({ numberOfChildren: childrenNumValue });
    console.log("print", childrenNumValue);
  }

  // function for increasing/decreasing InfantValue Form ||
  function increaseInfantsNum() {
    setInfantsNumValue(++infantsNumValue);
    // Update the Form ValueElement
    flightSearchForm.setFieldsValue({ numberOfInfants: infantsNumValue });
  }
  // function for decreasing InfantNum
  function decreaseInfantsNum() {
    if (infantsNumValue <= infantsMinValue) {
      return;
    }
    setInfantsNumValue(--infantsNumValue);
    // Update the Form Value
    flightSearchForm.setFieldsValue({ numberOfInfants: infantsNumValue });
    console.log("print", infantsNumValue);
  }

  // *********************** FILTER FLIGHT SEARCH ******************************
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

  const originLocationInput = useRef();

  // create hook for Destination Input
  const originDestinationInput = useRef();

  // onSubmit flightSearch fucntion
  const onClickOneway = () => {
    const requiredFieldsTestVariable = requiredFieldsTest();
    if (requiredFieldsTestVariable) {
      if (flightNumRestriction()){
        setFlightNumberRestriction(true);
        return;
      }
      flightSearchForm
        .validateFields()
        .then(async () => {
          // Display flight search processing modal
          setFlightSearchProcessingModalVisibility(true);
          // return;
          await fetchFlightResultsOneway(flightSearchForm.getFieldsValue())
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
          // console.log(flightSearchForm.getFieldsValue());
        })
        .catch((err) => {
          console.error("Form Error:", err);
        });
    }
  };

  // check this form later.
  const requiredFieldsTest = () => {
    let departure = takeOffInput.current.state.value;
    let arrival = destinationInput.current.state.value;
    console.log("get result", arrival);

    if (!departure || !arrival) {
      if (!departure) {
        setFromValidationMsg("Departing City or Airport required *");
      }
      if (!arrival) {
        setToValidationMsg("Arrival City or Airport required *");
      }
      return false;
    } else {
      return true;
    }
  };

  function handleChange(value) {
    console.log(`selected ${value}`);
  }

  // states for form validation
  const [FromvalidationMsg, setFromValidationMsg] = useState("");
  const [TovalidationMsg, setToValidationMsg] = useState("");

  // *****************************************************************************
  
    // ***************** ADD FLIGHT *******************//
//    const [addFlight, setAddFlight] = useState(false);
   const [addFlight, setAddFlight] = useState([{originLocationCityCode:"", originDestinationCityCode:""}]);
  
    
let addFormFields = () => {
    setAddFlight([...addFlight, {originLocationCityCode:"", originDestinationCityCode:""}])
 }

let removeFormFields = (i) => {
    let newFormValues = [...addFlight];
    newFormValues.splice(i, 1);
    setAddFlight(newFormValues)
}

  return (
    <>
      <FormAnt form={flightSearchForm} autoComplete="off">
        {addFlight.map((element, index) => (
            <div className="array-esque" key={index}>
              <div className="container">
                <div className="row">
                  {/* Take Off Airport Selection */}
                  <div className="col-md-4">
                    <div className="flight mt-3" style={{ position: "relative" }}>
                      {/* AIRPORT INPUT CONTAINER  */}
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
                            ref={takeOffInput}
                            name="selectedTakeOffAirport"
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
                              if (takeOffInput.current.state.value !== null) {
                                return;
                              }
                              // TODO: Why this if?
                              // if (customerSelectionError) {
                              // Clear the input
                              // takeOffInput.current.state.value = null;
                              // Empty the result collection
                              // }
                              // setTimeout(() => {
                              // }, 5000);
                              setTakeOffAirportsFilterResult([]);
                            }}
                          />
                        </Tooltip>
                        {/* End of input control */}
                      </div>
                      {/* AIRPORT RESULT AND DROPDOWN */}
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
                                  takeOffInput.current.state.value = `${airport.name} (${airport.iataCode})`;
                                  flightSearchForm.setFieldsValue({
                                    originLocationCityCode: `${airport.iataCode}`,
                                  });
                                  // console.log(airport);
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
                                    >
                                      {`${item.iataCode.toUpperCase()}`}
                                    </div>
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
                  <div className="col-md-4">
                    <div className="flight mt-3" style={{ position: "relative" }}>
                      {/* DEPARTURE INPUT SOURCE */}
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
                            ref={destinationInput}
                            name="selectedTakeOffAirport"
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
                              if (destinationInput.current.state.value !== null) {
                                // console.log(
                                //   originDestinationInput.current.state.value
                                // );
                                return;
                              }
                              // TODO: Why this if?
                              // if (customerSelectionError) {
                              // Clear the input
                              // destinationInput.current.state.value = null;
                              // Empty the result collection
                              // }
                              // setTimeout(() => {
    
                              // }, 5000);
                              setDestinationAirportsFilterResult([]);
                            }}
                          />
                        </Tooltip>
                        {/* End of input control */}
                      </div>
                      <span className="required-style">{TovalidationMsg}</span>
                      {/* DEPARTURE DROPDOWN RESULT */}
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
                                  destinationInput.current.state.value = `${airport.name} (${airport.iataCode})`;
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
                                    >
                                      {`${item.iataCode.toUpperCase()}`}
                                    </div>
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
                  {/* Departure date */}
                  <div className="col-md-4">
                    <div className="flight mt-3 mb-5">
                      <div className="roundtrip-label">Departure Date</div>
                      <div className="flight-booking-index">
                        <div className="flight-booking-icon">
                          <Image src={calenderIcon} alt={"calender-icon"} />
                        </div>
                        <FormAnt.Item name="selectedDepartureDate">
                          <DatePicker
                            superNextIcon={null}
                            disabledDate={disabledDate}
                            format={"D MMM YYYY"}
                            onChange={() =>
                              flightSearchForm.setFieldsValue({
                                departureDate: flightSearchForm.getFieldsValue()
                                  .selectedDepartureDate
                                  ? flightSearchForm
                                      .getFieldsValue()
                                      .selectedDepartureDate.format("YYYY-MM-DD")
                                  : "",
                              })
                            }
                          />
                        </FormAnt.Item>
                        <FormAnt.Item hidden={true} name="departureDate">
                          <Input name="departureDate" />
                        </FormAnt.Item>
                      </div>
                    </div>
                  </div>
                </div>
                {index ? <Button className="antd-btn-custom remove" onClick={() => removeFormFields(index)}>Remove</Button>
                : null}
              </div>
            </div>
        ))}
      </FormAnt>
    </>
  );
};

export default MultiCityComponent;
