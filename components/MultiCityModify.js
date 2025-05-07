import React, { useState, useRef, useEffect } from "react";
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
import arrowIcon from "../public/icons/left-arrow.png";
// import aeroplaneImg from "../public/aeroplane.png";
import aeroplaneImg from "../public/icons/aeroplaneImg.png";
import PlusMinusButton from "../components/PlusMinusButton";
import { DatePicker, Input, InputNumber, Tooltip } from "antd";
import moment from "moment";
import parseFormat from "moment-parseformat";
import { Form as FormAnt, List, Card, Checkbox } from "antd";
import { Menu, Button, Select, Modal, Spin } from "antd";
import {
    useFetchFlightResults,
    useFetchFlightResultsMultiCity,
} from "../pages/api/apiClient";
import { useFetchAirports } from "../pages/api/apiClient";
import { useDispatch } from "react-redux";
import styles from "./custom-comps/MultiCityTrial.module.css";
import { CloseOutlined, MinusOutlined } from "@ant-design/icons";

const { RangePicker } = DatePicker;

const MultiCityTrial = ({ airports }) => {
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
        // console.log(originLocation.itemData);
        flightSearchForm.setFieldsValue({
            takeOffAirport: originLocation.itemData.iataCode,
        });
        flightSearchForm.setFieldsValue({
            originLocationCityCode: `${originLocation.itemData.city} (${originLocation.itemData.iataCode})`,
        });
    }

    function onDestinationLocationSelected(originLocation) {
        // console.log(originLocation.itemData);
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
        // console.log('Multiple Flight Request', flightSearchForm.getFieldsValue());

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
                    getFinalOriginDestinationAndDepartureDate();
                    let data = flightSearchForm.getFieldsValue();
                    let selectedRows = searchRows.filter((row) => row.active == true);
                    let totalNumberOfCities = selectedRows.length + 1;
                    let originDestinations = [];

                    for (let i = 1; i <= totalNumberOfCities; i++) {
                        let departureDate = "departureDate" + i;
                        let originLocationCityCode = "originLocationCityCode" + i;
                        let originDestinationCityCode = "originDestinationCityCode" + i;
                        originDestinations.push({
                            id: i.toString(),
                            originLocationCode: data[originLocationCityCode],
                            destinationLocationCode: data[originDestinationCityCode],
                            departureDateTimeRange: {
                                date: data[departureDate],
                            },
                        });
                    }
                    //   console.log("Origin Destinations:", originDestinations);
                    // Display flight search processing modal
                    setFlightSearchProcessingModalVisibility(true);
                    // return;
                    // Fire the API client
                    await fetchFlightResultsMultiCity(
                        flightSearchForm.getFieldsValue(),
                        originDestinations
                    )
                        .then((response) => {
                            if (response.data.response.meta.count === 0) {
                                router.push("/flight-not-found");
                            } else {
                                // console.log("Caught Resp:", response);
                                router.push(
                                    "/flight-match?flightRequestId=" + response.data.response.id
                                );
                            }
                        })
                        .catch((error) => {
                            setflightSearchErrorModalMessage(error);
                            setFlightSearchErrorModalVisibility(true);
                            console.log("Caught Error 2:", error);
                            // TODO: Pop up a dialog
                            //   setFlightSearchErrorModalVisibility(true);
                        });
                    //   console.log(
                    //     "All fields values: " + flightSearchForm.getFieldsValue()
                    //   );
                })
                .catch((err) => {
                    console.error("Form Error:", err);
                    setflightSearchErrorModalMessage(err);
                    setFlightSearchErrorModalVisibility(true);
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
    // TODO: Do an 'else' to remove validation error message when input has value
    const requiredFieldsTest = () => {
        let departure1 = originLocationInput1.current.state.value;
        let arrival1 = originDestinationInput1.current.state.value;

        const selectedRows = searchRows.filter((row) => row.active == true);

        selectedRows.forEach((row) => {
            if (row.id == 2) {
                let departure = originLocationInput2.current.state.value;
                let arrival = originDestinationInput2.current.state.value;

                if (!departure) {
                    selectedRows[
                        selectedRows.findIndex((i) => i.id === row.id)
                    ].validationError.originLocationInput =
                        "Departing City or Airport required";
                    setFromValidationMsg2("Departing City or Airport required");
                }

                if (!arrival) {
                    selectedRows[
                        selectedRows.findIndex((i) => i.id === row.id)
                    ].validationError.originLocationInput =
                        "Arriving City or Airport required";
                    setToValidationMsg2("Arriving City or Airport required");
                }
            }
            if (row.id == 3) {
                let departure = originLocationInput3.current.state.value;
                let arrival = originDestinationInput3.current.state.value;

                if (!departure) {
                    selectedRows[
                        selectedRows.findIndex((i) => i.id === row.id)
                    ].validationError.originLocationInput =
                        "Departing City or Airport required";
                    setFromValidationMsg3("Departing City or Airport required");
                }

                if (!arrival) {
                    selectedRows[
                        selectedRows.findIndex((i) => i.id === row.id)
                    ].validationError.originLocationInput =
                        "Arriving City or Airport required";
                    setToValidationMsg3("Arriving City or Airport required");
                }
            }
            if (row.id == 4) {
                let departure = originLocationInput4.current.state.value;
                let arrival = originDestinationInput4.current.state.value;

                if (!departure) {
                    selectedRows[
                        selectedRows.findIndex((i) => i.id === row.id)
                    ].validationError.originLocationInput =
                        "Departing City or Airport required";
                    setFromValidationMsg4("Departing City or Airport required");
                }

                if (!arrival) {
                    selectedRows[
                        selectedRows.findIndex((i) => i.id === row.id)
                    ].validationError.originLocationInput =
                        "Arriving City or Airport required";
                    setToValidationMsg4("Arriving City or Airport required");
                }
            }
            if (row.id == 5) {
                let departure = originLocationInput5.current.state.value;
                let arrival = originDestinationInput5.current.state.value;

                if (!departure) {
                    selectedRows[
                        selectedRows.findIndex((i) => i.id === row.id)
                    ].validationError.originLocationInput =
                        "Departing City or Airport required";
                    setFromValidationMsg5("Departing City or Airport required");
                }

                if (!arrival) {
                    selectedRows[
                        selectedRows.findIndex((i) => i.id === row.id)
                    ].validationError.originLocationInput =
                        "Arriving City or Airport required";
                    setToValidationMsg5("Arriving City or Airport required");
                }
            }
        });

        if (
            !departure1 ||
            !arrival1 ||
            selectedRows.some(
                (row) => row.validationError.originLocationInput != null
            ) ||
            selectedRows.some(
                (row) => row.validationError.originDestinationInput != null
            )
        ) {
            if (!departure1) {
                setFromValidationMsg1("Departing City or Airport required");
            }
            if (!arrival1) {
                setToValidationMsg1("Arriving City or Airport required");
            }
            return false;
        } else {
            return true;
        }
    };

    // States for form validation for first search row
    const [fromvalidationMsg1, setFromValidationMsg1] = useState("");
    const [tovalidationMsg1, setToValidationMsg1] = useState("");

    // States for form validation for second search row
    const [fromvalidationMsg2, setFromValidationMsg2] = useState("");
    const [tovalidationMsg2, setToValidationMsg2] = useState("");

    // States for form validation for third search row
    const [fromvalidationMsg3, setFromValidationMsg3] = useState("");
    const [tovalidationMsg3, setToValidationMsg3] = useState("");

    // States for form validation for fourth search row
    const [fromvalidationMsg4, setFromValidationMsg4] = useState("");
    const [tovalidationMsg4, setToValidationMsg4] = useState("");

    // States for form validation for fifth search row
    const [fromvalidationMsg5, setFromValidationMsg5] = useState("");
    const [tovalidationMsg5, setToValidationMsg5] = useState("");

    // state to track arrival date
    const [arrivalDate, setArrivalDate] = useState();

    function handleArrivalDate(current) {
        const departingDate =
            flightSearchForm.getFieldsValue().selectedReturningDate;

        return current && current < moment().subtract(12, "hours");
    }

    // console.log(handleArrivalDate)

    //#region States

    // Search rows state
    const [searchRows, setSearchRows] = useState([
        {
            id: 2,
            active: false,
            validationError: {
                originLocationInput: null,
                originDestinationInput: null,
            },
        },
        {
            id: 3,
            active: false,
            validationError: {
                originLocationInput: null,
                originDestinationInput: null,
            },
        },
        {
            id: 4,
            active: false,
            validationError: {
                originLocationInput: null,
                originDestinationInput: null,
            },
        },
        {
            id: 5,
            active: false,
            validationError: {
                originLocationInput: null,
                originDestinationInput: null,
            },
        },
    ]);

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

    const [flightSearchErrorModalMessage, setflightSearchErrorModalMessage] =
        useState("");

    // Take off airport filter result for the first city
    const [takeOffAirportsFilterResult1, setTakeOffAirportsFilterResult1] =
        useState([]);

    // Destination airport filter result for the first city
    const [
        destinationAirportsFilterResult1,
        setDestinationAirportsFilterResult1,
    ] = useState([]);

    // Take off airport filter result for the second city
    const [takeOffAirportsFilterResult2, setTakeOffAirportsFilterResult2] =
        useState([]);

    // Destination airport filter result for the second city
    const [
        destinationAirportsFilterResult2,
        setDestinationAirportsFilterResult2,
    ] = useState([]);

    // Take off airport filter result for the third city
    const [takeOffAirportsFilterResult3, setTakeOffAirportsFilterResult3] =
        useState([]);

    // Destination airport filter result for the third city
    const [
        destinationAirportsFilterResult3,
        setDestinationAirportsFilterResult3,
    ] = useState([]);

    // Take off airport filter result for the fourth city
    const [takeOffAirportsFilterResult4, setTakeOffAirportsFilterResult4] =
        useState([]);

    // Destination airport filter result for the fourth city
    const [
        destinationAirportsFilterResult4,
        setDestinationAirportsFilterResult4,
    ] = useState([]);

    // Take off airport filter result for the fifth city
    const [takeOffAirportsFilterResult5, setTakeOffAirportsFilterResult5] =
        useState([]);

    // Destination airport filter result for the fifth city
    const [
        destinationAirportsFilterResult5,
        setDestinationAirportsFilterResult5,
    ] = useState([]);

    // Add flight button disabled state
    const [addFlightButtonDisabled, setAddFlightButtonDisabled] = useState(false);

    //
    const [takeOffFieldValidated, setTakeOffFieldValidated] = useState(false);

    //
    const [destinationFieldValidated, setDestinationFieldValidated] =
        useState(false);

    // Final origin destination state
    const [finalOriginDestination, setFinalOriginDestination] = useState();

    // Final departure date
    const [finalDepartureDate, setFinalDepartureDate] = useState();

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

    // Removes the last search row
    function removeSearchRow() {
        let length = searchRows.length - 1;
        for (let i = length; i >= 0; i--) {
            // If the search row is active...
            if (searchRows[i].active) {
                // Update and set it to inactive
                const newSearchRows = [...searchRows];
                newSearchRows[i].active = false;

                setSearchRows(newSearchRows);

                // Exit the function
                return;
            }
        }
    }

    // Displays the next search row
    function displaySearchRow() {
        // Iterate over the search row sequence
        for (let i = 0; i < searchRows.length; i++) {
            // If the search row is not active...
            if (!searchRows[i].active) {
                // Update and set it to active
                const newSearchRows = [...searchRows];
                newSearchRows[i].active = true;

                setSearchRows(newSearchRows);

                // Exit the function
                return;
            }
        }
    }

    //#endregion

    //#region Hooks

    const navigate = useNavigate();

    const router = useRouter();

    // Origin location input ref for the first city
    const originLocationInput1 = useRef();

    // Origin destination input ref for the first city
    const originDestinationInput1 = useRef();

    // Origin location input ref for the second city
    const originLocationInput2 = useRef();

    // Origin destination input ref for the second city
    const originDestinationInput2 = useRef();

    // Origin location input ref for the third city
    const originLocationInput3 = useRef();

    // Origin destination input ref for the third city
    const originDestinationInput3 = useRef();

    // Origin location input ref for the fourth city
    const originLocationInput4 = useRef();

    // Origin destination input ref for the fourth city
    const originDestinationInput4 = useRef();

    // Origin location input ref for the fifth city
    const originLocationInput5 = useRef();

    // Origin destination input ref for the fifth city
    const originDestinationInput5 = useRef();

    const fetchFlightResultsMultiCity = useFetchFlightResultsMultiCity();

    const [flightSearchForm] = FormAnt.useForm();

    const [isShow, setIsShow] = useState(false);

    // Departure date state for the first city
    const [departureDateState1, setDepartureDateState1] = useState(
        flightSearchForm.getFieldsValue().selectedDepartureDate1
    );

    // Departure date state for the second city
    const [departureDateState2, setDepartureDateState2] = useState(
        flightSearchForm.getFieldsValue().selectedDepartureDate2
    );

    // Departure date state for the third city
    const [departureDateState3, setDepartureDateState3] = useState(
        flightSearchForm.getFieldsValue().selectedDepartureDate3
    );

    // Departure date state for the fourth city
    const [departureDateState4, setDepartureDateState4] = useState(
        flightSearchForm.getFieldsValue().selectedDepartureDate4
    );

    // Departure date state for the fifth city
    const [departureDateState5, setDepartureDateState5] = useState(
        flightSearchForm.getFieldsValue().selectedDepartureDate5
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

    function disabledDate1(current) {
        return current && current < moment().subtract(12, "hours");
    }

    function disabledDate2(current) {
        return (
            current &&
            current <
            moment(flightSearchForm.getFieldsValue().selectedDepartureDate1).add(
                12,
                "hours"
            )
        );
    }

    function disabledDate3(current) {
        return (
            current &&
            current <
            moment(flightSearchForm.getFieldsValue().selectedDepartureDate2).add(
                12,
                "hours"
            )
        );
    }

    function disabledDate4(current) {
        return (
            current &&
            current <
            moment(flightSearchForm.getFieldsValue().selectedDepartureDate3).add(
                12,
                "hours"
            )
        );
    }

    function disabledDate5(current) {
        return (
            current &&
            current <
            moment(flightSearchForm.getFieldsValue().selectedDepartureDate4).add(
                12,
                "hours"
            )
        );
    }

    const formattedDepartureDate = new Date(departureDateState1);
    // console.log(departureDateState);
    // console.log(formattedDepartureDate);
    function disbaledArrivalDate(current) {
        // console.log(
        //   "Current Moment date: " + current && current < moment().add(12, "days")
        // console.log(departureDateState);
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
        // console.log(flightSearchForm.getFieldsValue().directFlightOnly);
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

    function getFinalOriginDestinationAndDepartureDate() {
        let length = searchRows.length - 1;
        for (let i = length; i >= 0; i--) {
            // If the search row is active...
            if (searchRows[i].active) {
                // Set the final origin destination
                let finalOriginDestination =
                    "originDestinationCityCode" + searchRows[i].id;
                // Set the final departure date
                let finalDepartureDate = "selectedDepartureDate" + searchRows[i].id;

                // Update the state
                setFinalOriginDestination(finalOriginDestination);
                // Update the final departure date state
                setFinalDepartureDate(finalDepartureDate);
                // Exit the function
                return;
            }
        }
    }

    return (
        <>
            <FormAnt form={flightSearchForm} autoComplete="off">
                {/* flight destination div -- below */}
                <div className="flightdestination-div">
                    <div className="container">
                        {/* The first search row */}
                        <div className="row">
                            {/* Take Off Airport Selection */}
                            <div className="col-md-8 col-lg-4">
                                <div className="flight mt-3" style={{ position: "relative" }}>
                                    <div className="roundtrip-label">From</div>
                                    <div className="flight-booking-index">
                                        <div className="flight-booking-icon">
                                            <Image src={flightFrom} alt={"flight-from-icon"} />
                                        </div>

                                        {/* Start of input control */}
                                        <FormAnt.Item
                                            hidden={true}
                                            name="originLocationCityCode1"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Please Enter Departing City!",
                                                },
                                            ]}
                                        >
                                            <Input name="originLocationCityCode1" />
                                        </FormAnt.Item>
                                        <Tooltip placement="top" title="Departing City or Airport">
                                            <Input
                                                placeholder="Departing City or Airport"
                                                allowClear={true}
                                                ref={originLocationInput1}
                                                name="selectedTakeOffAirport1"
                                                // style={{border: '1px solid red'}}
                                                onChange={async (e) => {
                                                    let value = e.currentTarget.value;
                                                    // If the field has no value...
                                                    if (!value || value.length < 3) {
                                                        // Set empty search result
                                                        setTakeOffAirportsFilterResult1([]);
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
                                                        setTakeOffAirportsFilterResult1(filteredAirports);
                                                    } else {
                                                        // console.log("Airport Result:", filteredAirports);
                                                        setTakeOffAirportsFilterResult1(filteredAirports);
                                                    }
                                                }}
                                                onBlur={(e) => {
                                                    if (
                                                        originLocationInput1.current.state.value !== null
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
                                                    setTakeOffAirportsFilterResult1([]);
                                                }}
                                            />
                                        </Tooltip>
                                    </div>
                                    <span className="required-style">{fromvalidationMsg1}</span>
                                    {takeOffAirportsFilterResult1.length !== 0 ? (
                                        <>
                                            <List
                                                className="filterOriginList"
                                                dataSource={takeOffAirportsFilterResult1}
                                                renderItem={(item) => (
                                                    <List.Item
                                                        key={item.id}
                                                        style={{ padding: "0", borderBottom: "none" }}
                                                        onClick={() => {
                                                            // Set selected customer
                                                            // setSelectedCustomer(item);
                                                            let airport = item;
                                                            originLocationInput1.current.state.value = `${airport.name} (${airport.iataCode})`;
                                                            flightSearchForm.setFieldsValue({
                                                                originLocationCityCode1: `${airport.iataCode}`,
                                                            });

                                                            // console.log(airport);

                                                            setTakeOffAirportsFilterResult1([]);
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
                            <div className="col-md-8 col-lg-4">
                                <div className="flight mt-3" style={{ position: "relative" }}>
                                    <div className="roundtrip-label">To</div>
                                    <div className="flight-booking-index">
                                        <div className="flight-booking-icon">
                                            <Image src={flightTo} alt={"flight-to-icon"} />
                                        </div>

                                        <FormAnt.Item
                                            hidden={true}
                                            name="originDestinationCityCode1"
                                        >
                                            <Input name="originDestinationCityCode1" />
                                        </FormAnt.Item>

                                        <Tooltip placement="top" title="Arriving City or Airport">
                                            <Input
                                                placeholder="Arriving City or Airport"
                                                allowClear={true}
                                                ref={originDestinationInput1}
                                                name="selectedTakeOffAirport1"
                                                // style={{border: '1px solid red'}}
                                                onChange={async (e) => {
                                                    let value = e.currentTarget.value;
                                                    // If the field has no value...
                                                    if (!value || value.length < 3) {
                                                        // Set empty search result
                                                        setDestinationAirportsFilterResult1([]);
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
                                                        setDestinationAirportsFilterResult1(
                                                            filteredAirports
                                                        );
                                                    } else {
                                                        // console.log("Airport Result:", filteredAirports);
                                                        setDestinationAirportsFilterResult1(
                                                            filteredAirports
                                                        );
                                                    }
                                                }}
                                                onBlur={(e) => {
                                                    if (
                                                        originDestinationInput1.current.state.value !== null
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
                                                    setDestinationAirportsFilterResult1([]);
                                                }}
                                            />
                                        </Tooltip>

                                        {/* End of input control */}
                                    </div>
                                    <span className="required-style">{tovalidationMsg1}</span>
                                    {destinationAirportsFilterResult1.length !== 0 ? (
                                        <>
                                            <List
                                                className="filterOriginList"
                                                dataSource={destinationAirportsFilterResult1}
                                                renderItem={(item) => (
                                                    <List.Item
                                                        key={item.id}
                                                        style={{ padding: "0", borderBottom: "none" }}
                                                        onClick={() => {
                                                            // Set selected customer
                                                            // setSelectedCustomer(item);
                                                            let airport = item;
                                                            originDestinationInput1.current.state.value = `${airport.name} (${airport.iataCode})`;
                                                            flightSearchForm.setFieldsValue({
                                                                originDestinationCityCode1: `${airport.iataCode}`,
                                                            });

                                                            // console.log(airport);
                                                            setDestinationAirportsFilterResult1([]);
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
                            <div className="col-md-8 col-lg-4">
                                <div className="flight mt-3">
                                    <div className="roundtrip-label">Departure Date</div>
                                    <div className="flight-booking-index">
                                        <div className="flight-booking-icon">
                                            <Image src={calenderIcon} alt={"calender-icon"} />
                                        </div>
                                        <FormAnt.Item name="selectedDepartureDate1">
                                            <DatePicker
                                                placeholder="Departing"
                                                superNextIcon={null}
                                                disabledDate={disabledDate1}
                                                format={"D MMM YYYY"}
                                                onChange={() => {
                                                    flightSearchForm.setFieldsValue({
                                                        departureDate1: flightSearchForm.getFieldsValue()
                                                            .selectedDepartureDate1
                                                            ? flightSearchForm
                                                                .getFieldsValue()
                                                                .selectedDepartureDate1.format("YYYY-MM-DD")
                                                            : "",
                                                    });
                                                    // console.log(
                                                    //   flightSearchForm
                                                    //     .getFieldsValue()
                                                    //     .selectedDepartureDate.format("YYYY-MM-DD")
                                                    // );
                                                    const updatedDepartureDate =
                                                        flightSearchForm.getFieldsValue()
                                                            .selectedDepartureDate1
                                                            ? flightSearchForm
                                                                .getFieldsValue()
                                                                .selectedDepartureDate1.format("YYYY-MM-DD")
                                                            : "";
                                                    setDepartureDateState1(updatedDepartureDate);
                                                }}
                                            />
                                        </FormAnt.Item>
                                        <FormAnt.Item hidden={true} name="departureDate1">
                                            <Input name="departureDate1" />
                                        </FormAnt.Item>
                                    </div>
                                    {/* <span className="required-style">{dateErrorMsg}</span> */}
                                </div>
                            </div>
                        </div>

                        {/* The second search row */}
                        {searchRows[0].active ? (
                            <div className="row">
                                {/* Take Off Airport Selection */}
                                <div className="col-md-8 col-lg-4">
                                    <div className="flight mt-3" style={{ position: "relative" }}>
                                        <div className="roundtrip-label">From</div>
                                        <div className="flight-booking-index">
                                            <div className="flight-booking-icon">
                                                <Image src={flightFrom} alt={"flight-from-icon"} />
                                            </div>

                                            {/* Start of input control */}
                                            <FormAnt.Item
                                                hidden={true}
                                                name="originLocationCityCode2"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: "Please Enter Departing City!",
                                                    },
                                                ]}
                                            >
                                                <Input name="originLocationCityCode2" />
                                            </FormAnt.Item>
                                            <Tooltip
                                                placement="top"
                                                title="Departing City or Airport"
                                            >
                                                <Input
                                                    placeholder="Departing City or Airport"
                                                    allowClear={true}
                                                    ref={originLocationInput2}
                                                    name="selectedTakeOffAirport2"
                                                    // style={{border: '1px solid red'}}
                                                    onChange={async (e) => {
                                                        let value = e.currentTarget.value;
                                                        // If the field has no value...
                                                        if (!value || value.length < 3) {
                                                            // Set empty search result
                                                            setTakeOffAirportsFilterResult2([]);
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
                                                            setTakeOffAirportsFilterResult2(filteredAirports);
                                                        } else {
                                                            // console.log("Airport Result:", filteredAirports);
                                                            setTakeOffAirportsFilterResult2(filteredAirports);
                                                        }
                                                    }}
                                                    onBlur={(e) => {
                                                        if (
                                                            originLocationInput2.current.state.value !== null
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
                                                        setTakeOffAirportsFilterResult2([]);
                                                    }}
                                                />
                                            </Tooltip>
                                        </div>
                                        <span className="required-style">{fromvalidationMsg2}</span>
                                        {takeOffAirportsFilterResult2.length !== 0 ? (
                                            <>
                                                <List
                                                    className="filterOriginList"
                                                    dataSource={takeOffAirportsFilterResult2}
                                                    renderItem={(item) => (
                                                        <List.Item
                                                            key={item.id}
                                                            style={{ padding: "0", borderBottom: "none" }}
                                                            onClick={() => {
                                                                // Set selected customer
                                                                // setSelectedCustomer(item);
                                                                let airport = item;
                                                                originLocationInput2.current.state.value = `${airport.name} (${airport.iataCode})`;
                                                                flightSearchForm.setFieldsValue({
                                                                    originLocationCityCode2: `${airport.iataCode}`,
                                                                });

                                                                // console.log(airport);

                                                                setTakeOffAirportsFilterResult2([]);
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
                                <div className="col-md-8 col-lg-4">
                                    <div className="flight mt-3" style={{ position: "relative" }}>
                                        <div className="roundtrip-label">To</div>
                                        <div className="flight-booking-index">
                                            <div className="flight-booking-icon">
                                                <Image src={flightTo} alt={"flight-to-icon"} />
                                            </div>

                                            <FormAnt.Item
                                                hidden={true}
                                                name="originDestinationCityCode2"
                                            >
                                                <Input name="originDestinationCityCode2" />
                                            </FormAnt.Item>

                                            <Tooltip placement="top" title="Arriving City or Airport">
                                                <Input
                                                    placeholder="Arriving City or Airport"
                                                    allowClear={true}
                                                    ref={originDestinationInput2}
                                                    name="selectedTakeOffAirport2"
                                                    // style={{border: '1px solid red'}}
                                                    onChange={async (e) => {
                                                        let value = e.currentTarget.value;
                                                        // If the field has no value...
                                                        if (!value || value.length < 3) {
                                                            // Set empty search result
                                                            setDestinationAirportsFilterResult2([]);
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
                                                            setDestinationAirportsFilterResult2(
                                                                filteredAirports
                                                            );
                                                        } else {
                                                            // console.log("Airport Result:", filteredAirports);
                                                            setDestinationAirportsFilterResult2(
                                                                filteredAirports
                                                            );
                                                        }
                                                    }}
                                                    onBlur={(e) => {
                                                        if (
                                                            originDestinationInput2.current.state.value !==
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
                                                        setDestinationAirportsFilterResult2([]);
                                                    }}
                                                />
                                            </Tooltip>

                                            {/* End of input control */}
                                        </div>
                                        <span className="required-style">{tovalidationMsg2}</span>
                                        {destinationAirportsFilterResult2.length !== 0 ? (
                                            <>
                                                <List
                                                    className="filterOriginList"
                                                    dataSource={destinationAirportsFilterResult2}
                                                    renderItem={(item) => (
                                                        <List.Item
                                                            key={item.id}
                                                            style={{ padding: "0", borderBottom: "none" }}
                                                            onClick={() => {
                                                                // Set selected customer
                                                                // setSelectedCustomer(item);
                                                                let airport = item;
                                                                originDestinationInput2.current.state.value = `${airport.name} (${airport.iataCode})`;
                                                                flightSearchForm.setFieldsValue({
                                                                    originDestinationCityCode2: `${airport.iataCode}`,
                                                                });

                                                                // console.log(airport);
                                                                setDestinationAirportsFilterResult2([]);
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
                                <div className="col-md-6 col-lg-4">
                                    <div className="flight mt-3">
                                        <div className="roundtrip-label">Departure Date</div>
                                        <div className="flight-booking-index">
                                            <div className="flight-booking-icon">
                                                <Image src={calenderIcon} alt={"calender-icon"} />
                                            </div>
                                            <FormAnt.Item name="selectedDepartureDate2">
                                                <DatePicker
                                                    placeholder="Departing"
                                                    superNextIcon={null}
                                                    disabledDate={disabledDate2}
                                                    format={"D MMM YYYY"}
                                                    onChange={() => {
                                                        flightSearchForm.setFieldsValue({
                                                            departureDate2: flightSearchForm.getFieldsValue()
                                                                .selectedDepartureDate2
                                                                ? flightSearchForm
                                                                    .getFieldsValue()
                                                                    .selectedDepartureDate2.format("YYYY-MM-DD")
                                                                : "",
                                                        });
                                                        // console.log(
                                                        //   flightSearchForm
                                                        //     .getFieldsValue()
                                                        //     .selectedDepartureDate.format("YYYY-MM-DD")
                                                        // );
                                                        const updatedDepartureDate =
                                                            flightSearchForm.getFieldsValue()
                                                                .selectedDepartureDate2
                                                                ? flightSearchForm
                                                                    .getFieldsValue()
                                                                    .selectedDepartureDate2.format("YYYY-MM-DD")
                                                                : "";
                                                        setDepartureDateState2(updatedDepartureDate);
                                                    }}
                                                />
                                            </FormAnt.Item>
                                            <FormAnt.Item hidden={true} name="departureDate2">
                                                <Input name="departureDate2" />
                                            </FormAnt.Item>
                                        </div>
                                    </div>
                                </div>

                                {/* Remove Search Row */}
                                {/* <div className="col-md-2 col-lg-1" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                                <Button onClick={() => removeSearchRow(2)}
                                    icon={<CloseOutlined />}
                                    style={{ marginBottom: '2.5px', width: '100%' }}
                                    className={styles.rmvitinerarybtn}>
                                </Button>
                            </div> */}
                            </div>
                        ) : (
                            <></>
                        )}

                        {/* The third search row */}
                        {searchRows[1].active ? (
                            <div className="row">
                                {/* Take Off Airport Selection */}
                                <div className="col-md-8 col-lg-4">
                                    <div className="flight mt-3" style={{ position: "relative" }}>
                                        <div className="roundtrip-label">From</div>
                                        <div className="flight-booking-index">
                                            <div className="flight-booking-icon">
                                                <Image src={flightFrom} alt={"flight-from-icon"} />
                                            </div>

                                            {/* Start of input control */}
                                            <FormAnt.Item
                                                hidden={true}
                                                name="originLocationCityCode3"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: "Please Enter Departing City!",
                                                    },
                                                ]}
                                            >
                                                <Input name="originLocationCityCode3" />
                                            </FormAnt.Item>
                                            <Tooltip
                                                placement="top"
                                                title="Departing City or Airport"
                                            >
                                                <Input
                                                    placeholder="Departing City or Airport"
                                                    allowClear={true}
                                                    ref={originLocationInput3}
                                                    name="selectedTakeOffAirport3"
                                                    // style={{border: '1px solid red'}}
                                                    onChange={async (e) => {
                                                        let value = e.currentTarget.value;
                                                        // If the field has no value...
                                                        if (!value || value.length < 3) {
                                                            // Set empty search result
                                                            setTakeOffAirportsFilterResult3([]);
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
                                                            setTakeOffAirportsFilterResult3(filteredAirports);
                                                        } else {
                                                            // console.log("Airport Result:", filteredAirports);
                                                            setTakeOffAirportsFilterResult3(filteredAirports);
                                                        }
                                                    }}
                                                    onBlur={(e) => {
                                                        if (
                                                            originLocationInput3.current.state.value !== null
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
                                                        setTakeOffAirportsFilterResult3([]);
                                                    }}
                                                />
                                            </Tooltip>
                                        </div>
                                        <span className="required-style">{fromvalidationMsg3}</span>
                                        {takeOffAirportsFilterResult3.length !== 0 ? (
                                            <>
                                                <List
                                                    className="filterOriginList"
                                                    dataSource={takeOffAirportsFilterResult3}
                                                    renderItem={(item) => (
                                                        <List.Item
                                                            key={item.id}
                                                            style={{ padding: "0", borderBottom: "none" }}
                                                            onClick={() => {
                                                                // Set selected customer
                                                                // setSelectedCustomer(item);
                                                                let airport = item;
                                                                originLocationInput3.current.state.value = `${airport.name} (${airport.iataCode})`;
                                                                flightSearchForm.setFieldsValue({
                                                                    originLocationCityCode3: `${airport.iataCode}`,
                                                                });

                                                                // console.log(airport);

                                                                setTakeOffAirportsFilterResult3([]);
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
                                <div className="col-md-8 col-lg-4">
                                    <div className="flight mt-3" style={{ position: "relative" }}>
                                        <div className="roundtrip-label">To</div>
                                        <div className="flight-booking-index">
                                            <div className="flight-booking-icon">
                                                <Image src={flightTo} alt={"flight-to-icon"} />
                                            </div>

                                            <FormAnt.Item
                                                hidden={true}
                                                name="originDestinationCityCode3"
                                            >
                                                <Input name="originDestinationCityCode3" />
                                            </FormAnt.Item>

                                            <Tooltip placement="top" title="Arriving City or Airport">
                                                <Input
                                                    placeholder="Arriving City or Airport"
                                                    allowClear={true}
                                                    ref={originDestinationInput3}
                                                    name="selectedTakeOffAirport3"
                                                    // style={{border: '1px solid red'}}
                                                    onChange={async (e) => {
                                                        let value = e.currentTarget.value;
                                                        // If the field has no value...
                                                        if (!value || value.length < 3) {
                                                            // Set empty search result
                                                            setDestinationAirportsFilterResult3([]);
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
                                                            setDestinationAirportsFilterResult3(
                                                                filteredAirports
                                                            );
                                                        } else {
                                                            // console.log("Airport Result:", filteredAirports);
                                                            setDestinationAirportsFilterResult3(
                                                                filteredAirports
                                                            );
                                                        }
                                                    }}
                                                    onBlur={(e) => {
                                                        if (
                                                            originDestinationInput3.current.state.value !==
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
                                                        setDestinationAirportsFilterResult3([]);
                                                    }}
                                                />
                                            </Tooltip>

                                            {/* End of input control */}
                                        </div>
                                        <span className="required-style">{tovalidationMsg3}</span>
                                        {destinationAirportsFilterResult3.length !== 0 ? (
                                            <>
                                                <List
                                                    className="filterOriginList"
                                                    dataSource={destinationAirportsFilterResult3}
                                                    renderItem={(item) => (
                                                        <List.Item
                                                            key={item.id}
                                                            style={{ padding: "0", borderBottom: "none" }}
                                                            onClick={() => {
                                                                // Set selected customer
                                                                // setSelectedCustomer(item);
                                                                let airport = item;
                                                                originDestinationInput3.current.state.value = `${airport.name} (${airport.iataCode})`;
                                                                flightSearchForm.setFieldsValue({
                                                                    originDestinationCityCode3: `${airport.iataCode}`,
                                                                });

                                                                // console.log(airport);
                                                                setDestinationAirportsFilterResult3([]);
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
                                <div className="col-md-6 col-lg-4">
                                    <div className="flight mt-3">
                                        <div className="roundtrip-label">Departure Date</div>
                                        <div className="flight-booking-index">
                                            <div className="flight-booking-icon">
                                                <Image src={calenderIcon} alt={"calender-icon"} />
                                            </div>
                                            <FormAnt.Item name="selectedDepartureDate3">
                                                <DatePicker
                                                    placeholder="Departing"
                                                    superNextIcon={null}
                                                    disabledDate={disabledDate3}
                                                    format={"D MMM YYYY"}
                                                    onChange={() => {
                                                        flightSearchForm.setFieldsValue({
                                                            departureDate3: flightSearchForm.getFieldsValue()
                                                                .selectedDepartureDate3
                                                                ? flightSearchForm
                                                                    .getFieldsValue()
                                                                    .selectedDepartureDate3.format("YYYY-MM-DD")
                                                                : "",
                                                        });
                                                        // console.log(
                                                        //   flightSearchForm
                                                        //     .getFieldsValue()
                                                        //     .selectedDepartureDate.format("YYYY-MM-DD")
                                                        // );
                                                        const updatedDepartureDate =
                                                            flightSearchForm.getFieldsValue()
                                                                .selectedDepartureDate3
                                                                ? flightSearchForm
                                                                    .getFieldsValue()
                                                                    .selectedDepartureDate3.format("YYYY-MM-DD")
                                                                : "";
                                                        setDepartureDateState3(updatedDepartureDate);
                                                    }}
                                                />
                                            </FormAnt.Item>
                                            <FormAnt.Item hidden={true} name="departureDate3">
                                                <Input name="departureDate3" />
                                            </FormAnt.Item>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <></>
                        )}

                        {/* The fourth search row */}
                        {searchRows[2].active ? (
                            <div className="row">
                                {/* Take Off Airport Selection */}
                                <div className="col-md-8 col-lg-4">
                                    <div className="flight mt-3" style={{ position: "relative" }}>
                                        <div className="roundtrip-label">From</div>
                                        <div className="flight-booking-index">
                                            <div className="flight-booking-icon">
                                                <Image src={flightFrom} alt={"flight-from-icon"} />
                                            </div>

                                            {/* Start of input control */}
                                            <FormAnt.Item
                                                hidden={true}
                                                name="originLocationCityCode4"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: "Please Enter Departing City!",
                                                    },
                                                ]}
                                            >
                                                <Input name="originLocationCityCode4" />
                                            </FormAnt.Item>
                                            <Tooltip
                                                placement="top"
                                                title="Departing City or Airport"
                                            >
                                                <Input
                                                    placeholder="Departing City or Airport"
                                                    allowClear={true}
                                                    ref={originLocationInput4}
                                                    name="selectedTakeOffAirport4"
                                                    // style={{border: '1px solid red'}}
                                                    onChange={async (e) => {
                                                        let value = e.currentTarget.value;
                                                        // If the field has no value...
                                                        if (!value || value.length < 3) {
                                                            // Set empty search result
                                                            setTakeOffAirportsFilterResult4([]);
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
                                                            setTakeOffAirportsFilterResult4(filteredAirports);
                                                        } else {
                                                            // console.log("Airport Result:", filteredAirports);
                                                            setTakeOffAirportsFilterResult4(filteredAirports);
                                                        }
                                                    }}
                                                    onBlur={(e) => {
                                                        if (
                                                            originLocationInput4.current.state.value !== null
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
                                                        setTakeOffAirportsFilterResult4([]);
                                                    }}
                                                />
                                            </Tooltip>
                                        </div>
                                        <span className="required-style">{fromvalidationMsg4}</span>
                                        {takeOffAirportsFilterResult4.length !== 0 ? (
                                            <>
                                                <List
                                                    className="filterOriginList"
                                                    dataSource={takeOffAirportsFilterResult4}
                                                    renderItem={(item) => (
                                                        <List.Item
                                                            key={item.id}
                                                            style={{ padding: "0", borderBottom: "none" }}
                                                            onClick={() => {
                                                                // Set selected customer
                                                                // setSelectedCustomer(item);
                                                                let airport = item;
                                                                originLocationInput4.current.state.value = `${airport.name} (${airport.iataCode})`;
                                                                flightSearchForm.setFieldsValue({
                                                                    originLocationCityCode4: `${airport.iataCode}`,
                                                                });

                                                                // console.log(airport);

                                                                setTakeOffAirportsFilterResult4([]);
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
                                <div className="col-md-8 col-lg-4">
                                    <div className="flight mt-3" style={{ position: "relative" }}>
                                        <div className="roundtrip-label">To</div>
                                        <div className="flight-booking-index">
                                            <div className="flight-booking-icon">
                                                <Image src={flightTo} alt={"flight-to-icon"} />
                                            </div>

                                            <FormAnt.Item
                                                hidden={true}
                                                name="originDestinationCityCode4"
                                            >
                                                <Input name="originDestinationCityCode4" />
                                            </FormAnt.Item>

                                            <Tooltip placement="top" title="Arriving City or Airport">
                                                <Input
                                                    placeholder="Arriving City or Airport"
                                                    allowClear={true}
                                                    ref={originDestinationInput4}
                                                    name="selectedTakeOffAirport4"
                                                    // style={{border: '1px solid red'}}
                                                    onChange={async (e) => {
                                                        let value = e.currentTarget.value;
                                                        // If the field has no value...
                                                        if (!value || value.length < 3) {
                                                            // Set empty search result
                                                            setDestinationAirportsFilterResult4([]);
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
                                                            setDestinationAirportsFilterResult4(
                                                                filteredAirports
                                                            );
                                                        } else {
                                                            // console.log("Airport Result:", filteredAirports);
                                                            setDestinationAirportsFilterResult4(
                                                                filteredAirports
                                                            );
                                                        }
                                                    }}
                                                    onBlur={(e) => {
                                                        if (
                                                            originDestinationInput4.current.state.value !==
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
                                                        setDestinationAirportsFilterResult4([]);
                                                    }}
                                                />
                                            </Tooltip>

                                            {/* End of input control */}
                                        </div>
                                        <span className="required-style">{tovalidationMsg4}</span>
                                        {destinationAirportsFilterResult4.length !== 0 ? (
                                            <>
                                                <List
                                                    className="filterOriginList"
                                                    dataSource={destinationAirportsFilterResult4}
                                                    renderItem={(item) => (
                                                        <List.Item
                                                            key={item.id}
                                                            style={{ padding: "0", borderBottom: "none" }}
                                                            onClick={() => {
                                                                // Set selected customer
                                                                // setSelectedCustomer(item);
                                                                let airport = item;
                                                                originDestinationInput4.current.state.value = `${airport.name} (${airport.iataCode})`;
                                                                flightSearchForm.setFieldsValue({
                                                                    originDestinationCityCode4: `${airport.iataCode}`,
                                                                });

                                                                // console.log(airport);
                                                                setDestinationAirportsFilterResult4([]);
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
                                <div className="col-md-6 col-lg-4">
                                    <div className="flight mt-3">
                                        <div className="roundtrip-label">Departure Date</div>
                                        <div className="flight-booking-index">
                                            <div className="flight-booking-icon">
                                                <Image src={calenderIcon} alt={"calender-icon"} />
                                            </div>
                                            <FormAnt.Item name="selectedDepartureDate4">
                                                <DatePicker
                                                    placeholder="Departing"
                                                    superNextIcon={null}
                                                    disabledDate={disabledDate4}
                                                    format={"D MMM YYYY"}
                                                    onChange={() => {
                                                        flightSearchForm.setFieldsValue({
                                                            departureDate4: flightSearchForm.getFieldsValue()
                                                                .selectedDepartureDate4
                                                                ? flightSearchForm
                                                                    .getFieldsValue()
                                                                    .selectedDepartureDate4.format("YYYY-MM-DD")
                                                                : "",
                                                        });
                                                        // console.log(
                                                        //   flightSearchForm
                                                        //     .getFieldsValue()
                                                        //     .selectedDepartureDate.format("YYYY-MM-DD")
                                                        // );
                                                        const updatedDepartureDate =
                                                            flightSearchForm.getFieldsValue()
                                                                .selectedDepartureDate4
                                                                ? flightSearchForm
                                                                    .getFieldsValue()
                                                                    .selectedDepartureDate4.format("YYYY-MM-DD")
                                                                : "";
                                                        setDepartureDateState4(updatedDepartureDate);
                                                    }}
                                                />
                                            </FormAnt.Item>
                                            <FormAnt.Item hidden={true} name="departureDate4">
                                                <Input name="departureDate4" />
                                            </FormAnt.Item>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <></>
                        )}

                        {/* The fifth search row */}
                        {searchRows[3].active ? (
                            <div className="row">
                                {/* Take Off Airport Selection */}
                                <div className="col-md-8 col-lg-4">
                                    <div className="flight mt-3" style={{ position: "relative" }}>
                                        <div className="roundtrip-label">From</div>
                                        <div className="flight-booking-index">
                                            <div className="flight-booking-icon">
                                                <Image src={flightFrom} alt={"flight-from-icon"} />
                                            </div>

                                            {/* Start of input control */}
                                            <FormAnt.Item
                                                hidden={true}
                                                name="originLocationCityCode5"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: "Please Enter Departing City!",
                                                    },
                                                ]}
                                            >
                                                <Input name="originLocationCityCode5" />
                                            </FormAnt.Item>
                                            <Tooltip
                                                placement="top"
                                                title="Departing City or Airport"
                                            >
                                                <Input
                                                    placeholder="Departing City or Airport"
                                                    allowClear={true}
                                                    ref={originLocationInput5}
                                                    name="selectedTakeOffAirport5"
                                                    // style={{border: '1px solid red'}}
                                                    onChange={async (e) => {
                                                        let value = e.currentTarget.value;
                                                        // If the field has no value...
                                                        if (!value || value.length < 3) {
                                                            // Set empty search result
                                                            setTakeOffAirportsFilterResult5([]);
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
                                                            setTakeOffAirportsFilterResult5(filteredAirports);
                                                        } else {
                                                            // console.log("Airport Result:", filteredAirports);
                                                            setTakeOffAirportsFilterResult5(filteredAirports);
                                                        }
                                                    }}
                                                    onBlur={(e) => {
                                                        if (
                                                            originLocationInput5.current.state.value !== null
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
                                                        setTakeOffAirportsFilterResult5([]);
                                                    }}
                                                />
                                            </Tooltip>
                                        </div>
                                        <span className="required-style">{fromvalidationMsg5}</span>
                                        {takeOffAirportsFilterResult5.length !== 0 ? (
                                            <>
                                                <List
                                                    className="filterOriginList"
                                                    dataSource={takeOffAirportsFilterResult5}
                                                    renderItem={(item) => (
                                                        <List.Item
                                                            key={item.id}
                                                            style={{ padding: "0", borderBottom: "none" }}
                                                            onClick={() => {
                                                                // Set selected customer
                                                                // setSelectedCustomer(item);
                                                                let airport = item;
                                                                originLocationInput5.current.state.value = `${airport.name} (${airport.iataCode})`;
                                                                flightSearchForm.setFieldsValue({
                                                                    originLocationCityCode5: `${airport.iataCode}`,
                                                                });

                                                                // console.log(airport);

                                                                setTakeOffAirportsFilterResult5([]);
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
                                <div className="col-md-8 col-lg-4">
                                    <div className="flight mt-3" style={{ position: "relative" }}>
                                        <div className="roundtrip-label">To</div>
                                        <div className="flight-booking-index">
                                            <div className="flight-booking-icon">
                                                <Image src={flightTo} alt={"flight-to-icon"} />
                                            </div>

                                            <FormAnt.Item
                                                hidden={true}
                                                name="originDestinationCityCode5"
                                            >
                                                <Input name="originDestinationCityCode5" />
                                            </FormAnt.Item>

                                            <Tooltip placement="top" title="Arriving City or Airport">
                                                <Input
                                                    placeholder="Arriving City or Airport"
                                                    allowClear={true}
                                                    ref={originDestinationInput5}
                                                    name="selectedTakeOffAirport5"
                                                    // style={{border: '1px solid red'}}
                                                    onChange={async (e) => {
                                                        let value = e.currentTarget.value;
                                                        // If the field has no value...
                                                        if (!value || value.length < 3) {
                                                            // Set empty search result
                                                            setDestinationAirportsFilterResult3([]);
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
                                                            setDestinationAirportsFilterResult5(
                                                                filteredAirports
                                                            );
                                                        } else {
                                                            // console.log("Airport Result:", filteredAirports);
                                                            setDestinationAirportsFilterResult5(
                                                                filteredAirports
                                                            );
                                                        }
                                                    }}
                                                    onBlur={(e) => {
                                                        if (
                                                            originDestinationInput5.current.state.value !==
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
                                                        setDestinationAirportsFilterResult5([]);
                                                    }}
                                                />
                                            </Tooltip>

                                            {/* End of input control */}
                                        </div>
                                        <span className="required-style">{tovalidationMsg5}</span>
                                        {destinationAirportsFilterResult5.length !== 0 ? (
                                            <>
                                                <List
                                                    className="filterOriginList"
                                                    dataSource={destinationAirportsFilterResult5}
                                                    renderItem={(item) => (
                                                        <List.Item
                                                            key={item.id}
                                                            style={{ padding: "0", borderBottom: "none" }}
                                                            onClick={() => {
                                                                // Set selected customer
                                                                // setSelectedCustomer(item);
                                                                let airport = item;
                                                                originDestinationInput5.current.state.value = `${airport.name} (${airport.iataCode})`;
                                                                flightSearchForm.setFieldsValue({
                                                                    originDestinationCityCode5: `${airport.iataCode}`,
                                                                });

                                                                // console.log(airport);
                                                                setDestinationAirportsFilterResult5([]);
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
                                <div className="col-md-6 col-lg-4">
                                    <div className="flight mt-3">
                                        <div className="roundtrip-label">Departure Date</div>
                                        <div className="flight-booking-index">
                                            <div className="flight-booking-icon">
                                                <Image src={calenderIcon} alt={"calender-icon"} />
                                            </div>
                                            <FormAnt.Item name="selectedDepartureDate5">
                                                <DatePicker
                                                    placeholder="Departing"
                                                    superNextIcon={null}
                                                    disabledDate={disabledDate5}
                                                    format={"D MMM YYYY"}
                                                    onChange={() => {
                                                        flightSearchForm.setFieldsValue({
                                                            departureDate5: flightSearchForm.getFieldsValue()
                                                                .selectedDepartureDate5
                                                                ? flightSearchForm
                                                                    .getFieldsValue()
                                                                    .selectedDepartureDate5.format("YYYY-MM-DD")
                                                                : "",
                                                        });
                                                        
                                                        const updatedDepartureDate =
                                                            flightSearchForm.getFieldsValue()
                                                                .selectedDepartureDate5
                                                                ? flightSearchForm
                                                                    .getFieldsValue()
                                                                    .selectedDepartureDate5.format("YYYY-MM-DD")
                                                                : "";
                                                        setDepartureDateState5(updatedDepartureDate);
                                                    }}
                                                />
                                            </FormAnt.Item>
                                            <FormAnt.Item hidden={true} name="departureDate5">
                                                <Input name="departureDate5" />
                                            </FormAnt.Item>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <></>
                        )}

                        {/* The 'add / remove flight' controls row */}
                        <div className="row" style={{ justifyContent: "right" }}>
                            <div className="col-md-2 col-lg-1 mt-3 mb-3">
                                <Button
                                    onClick={removeSearchRow}
                                    danger
                                    icon={<CloseOutlined />}
                                ></Button>
                            </div>
                            <div className="col-md-2 col-lg-2 mt-3 mb-3">
                                <Button
                                    onClick={displaySearchRow}
                                    disabled={addFlightButtonDisabled}
                                >
                                    + Add Flight
                                </Button>
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
                        <p className="flightModalCode" style={{ textAlign: "start" }}>
                            {`${flightSearchForm.getFieldsValue().originLocationCityCode1}`}
                        </p>
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
                        <p className="flightModalCode" style={{ textAlign: "end" }}>
                            {`${flightSearchForm.getFieldsValue()[finalOriginDestination]}`}
                        </p>
                    </div>
                </div>
                <p className="flightModalTitle">
                    {`${new Date(
                        flightSearchForm.getFieldsValue().selectedDepartureDate1
                    ).toLocaleString("default", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                    })} `}
                    <span> - </span>

                    {`${new Date(
                        flightSearchForm.getFieldsValue()[finalDepartureDate]
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

export default MultiCityTrial;

export function pluralizeAndStringify(value, word, suffix = "s") {
    if (value == 1) {
        return value + " " + "Passenger";
    } else {
        return value + " " + "Passenger" + suffix;
    }
}
