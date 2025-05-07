import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { BsChevronDown, BsChevronUp, BsCheck } from 'react-icons/bs';
import { AiFillCaretDown, AiOutlinePlus, AiFillCaretUp, AiOutlineInfoCircle, AiOutlineMinus } from 'react-icons/ai';
import { css } from 'styled-components';
import { AeroplaneIcon } from './CustomSVGIcon';
import { FlightDepartureSuggestion, FlightArrivalSuggestion } from './FlightSuggestion';
import Tooltip from './search-form/tooltips';
import DatePicker from 'react-datepicker';
import { MyContainer, MyContainerArrival } from './custom-comps/MyContainer';
import moment from 'moment';
import { useFetchFlightResults, useFetchFlightResultsOneway, useFetchFlightResultsMultiCity } from '../pages/api/apiClient';
import aeroplaneImg from "../public/icons/aeroplaneImg.png";
import FlightSearchProcessing from './FlightSearchProcessing';
import BannerImg from "../public/banner/xmas-desktop-bg.webp";
import mobileBannerImg from "../public/banner/xmas-mobile-bg.webp";
import { useRouter } from 'next/router';
import RouteModel from './routeModel';

const SearchPanel = ({ airports }) => {

    const router = useRouter();

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



    //#region States
    // Initialize and set the media query for mobile
    const [onMobile, setOnMobile] = useState(window.matchMedia("(max-width: 768px)").matches);

    // States for trips section
    const [routeModel, setRouteModel] = useState(RouteModel.RoundTrip);
    const [tripValue, setTripValue] = useState(normalizeRouteModel(RouteModel.RoundTrip));
    const [optionVisible, setOptionVisible] = useState(false);

    // States for passengers section
    const [passengersVisible, setPassengersVisible] = useState(false);
    const [passengers, setPassengers] = useState(1);
    const [adultCount, setAdultCount] = useState(1);
    const [childrenCount, setChildrenCount] = useState(0);
    const [infantCount, setInfantCount] = useState(0);

    // States for class section
    const [classOptionsVisible, setClassOptionsVisible] = useState(false);
    const [classValue, setClassValue] = useState('Economy');
    const [flightClass, setFlightClass] = useState('ECONOMY');

    // States for location section 
    const [locationResultsVisible, setLocationResultsVisible] = useState(false);
    const [arrivalLocationResultsVisible, setArrivalLocationResultsVisible] = useState(false);
    const [depLocationSuggestionsIsHovered, setDepLocationSuggestionsIsHovered] = useState(false);
    const [depLocationSuggestionsVisible, setDepLocationSuggestionsVisible] = useState(false);
    const [arrivalLocationSuggestionsVisible, setArrivalLocationSuggestionsVisible] = useState(false);
    const [arrivalLocationSuggestionsIsHovered, setArrivalLocationSuggestionsIsHovered] = useState(false);
    const [departureLocation, setDepartureLocation] = useState('');
    const [arrivalLocation, setArrivalLocation] = useState('');

    // Form data states 
    const [departureDate, setDepartureDate] = useState(new Date());
    const [arrivalDate, setArrivalDate] = useState(new Date(moment(departureDate).add(1, 'days')));
    const [selectedDepartureDateVal, setSelectedDepartureDateVal] = useState(null);
    const [selectedArrivalDateVal, setSelectedArrivalDateVal] = useState(null);
    // const todayDate = useState(departureDate);

    // States for location filter 
    const [departureAirportsFilterResult, setDepartureAirportsFilterResult] = useState([]);
    const [arrivalAirportsFilterResult, setArrivalAirportsFilterResult] = useState([]);
    // create hook for Departure Input
    const originDepartureInput = useRef();
    const originArrivalInput = useRef();
    const originDepartureDateInput = useRef();
    const originArrivalDateInput = useRef();
    const [originDepartureInputVal, setOriginDepartureInputVal] = useState();
    const [originArrivalInputVal, setOriginArrivalInputVal] = useState();
    const [originDepartureDateInputVal, setOriginDepartureDateInputVal] = useState();
    // Date error states
    const [departureError, setDepartureError] = useState(false);
    const [arrivalError, setArrivalError] = useState(false);

    //State for dateWindow
    const [dateWindow, setDateWindow] = useState(false);
    //State for directFlightOnly
    const [directFlightOnly, setDirectFlightOnly] = useState(false);

    //#endregion

    //#region Ref

    const minusBtnRef = React.useRef(null);
    const addAdultBtnRef = React.useRef(null);
    const addChildrenBtnRef = React.useRef(null);
    const addInfantBtnRef = React.useRef(null);
    const tripsDropDownRef = React.useRef();

    //#endregion

    //#region Functions

    // Function to update trip options 
    function updateTripOptions(e) {
        // console.log(e);
        // Set trip value to the clicked target's value 
        setRouteModel(e.target.value);
        setTripValue(normalizeRouteModel(e.target.value));
        // Set state to close dropdown 
        setOptionVisible(!optionVisible);
    }

    function normalizeRouteModel(value) {
        switch (value) {
            case '0': return 'One Way';

            case '1': return 'Round Trip';

            case '2': return 'Multi City';

            default: return 'Round Trip';
        }
    }

    /**
     * Function to update class options 
     * @param {*} e The event sendervalue
     */
    function updateClassOptions(e) {
        // console.log(e);
        // Set trip value to the clicked target's value 
        setClassValue(e.target.value);
        setFlightClass(normalizeClassValue(e.target.value));
        // Set state to close dropdown 
        setClassOptionsVisible(!classOptionsVisible);
    }

    function normalizeClassValue(flightClass) {
        switch (flightClass) {
            case 'Economy':
                return 'ECONOMY';
            case 'Business':
                return 'BUSINESS';
            case 'Premium Economy':
                return 'PREMIUM_ECONOMY';
            case 'First Class':
                return 'FIRST';
            default:
                return 'ECONOMY';
        }
    }

    // Function to toggle trip options 
    function toggleTripsOptions() {
        setOptionVisible(!optionVisible);
        // Hide other dropdown
        setPassengersVisible(false);
        setClassOptionsVisible(false);
    }
    // Function to toggle passenger options 
    function togglePassengerOptions() {
        setPassengersVisible(!passengersVisible);
        // Hide other dropdown
        setOptionVisible(false);
        setClassOptionsVisible(false);
    }
    // Function to toggle class options 
    function toggleClassOptions() {
        setClassOptionsVisible(!classOptionsVisible);
        // Hide other dropdown
        setOptionVisible(false);
        setPassengersVisible(false);
    }
    function decrementAdultCount() {
        // If adult count is equal to or less than 1,
        // console.log(addAdultBtnRef);
        // if adult is 1 and children is 0 and infant is 0, show message 
        if (adultCount === 1 && childrenCount === 0 && infantCount === 0) {
            // console.log('Number of total passengers must be between 1 and 9');
            // Set Tooltip style to block display
            addAdultBtnRef.current.children[3].style.display = 'block';
            // then do nothing 
            return;
            // If passengers are more than 1, and less than 9 
        } else if (passengers > 1 || passengers < 9) {
            // Set Tooltip style to no display
            addAdultBtnRef.current.children[3].style.display = 'none';
        }
        if (adultCount === 1) {
            // do nothing 
            return;
        }
        setAdultCount(prevAdultCount => prevAdultCount - 1);
    }
    function incrementAdultCount() {
        if (passengers > 1 || passengers < 9) {
            addAdultBtnRef.current.children[3].style.display = 'none';
        }
        // If total passengers is up to 9, do nothing
        if (passengers === 9) {
            // console.log('Number of total passengers must be between 1 and 9');
            // Set tooltip style to block display 
            addAdultBtnRef.current.children[3].style.display = 'block';
            return;
        }
        // Add 
        setAdultCount(prevAdultCount => prevAdultCount + 1);
    }
    function decrementChildrenCount() {
        // If chikdren count is equal to or less than 1, do nothing 
        if (childrenCount === 0 && infantCount === 0 && adultCount < 2) {
            // console.log('Number of total passengers must be between 1 and 9');
            // Show Tooltip 
            addChildrenBtnRef.current.children[3].style.display = 'block';
        } else if (passengers > 1 || passengers < 9) {
            // Hide tooltip
            addChildrenBtnRef.current.children[3].style.display = 'none';
        }
        if (childrenCount === 0) {
            return;
        }
        setChildrenCount(prevChildrenCount => prevChildrenCount - 1)
    }
    function incrementChildrenCount() {
        // If total passengers is up to 9
        if (passengers === 9) {
            // console.log('Number of total passengers must be between 1 and 9');
            addChildrenBtnRef.current.children[3].style.display = 'block';
            return;
        }
        setChildrenCount(prevChildrenCount => prevChildrenCount + 1)
    }
    function decrementInfantCount() {
        // If infant count is equal to or less than 1, do nothing 
        if (childrenCount <= 0 && infantCount <= 0 && adultCount < 2) {
            // console.log('Number of total passengers must be between 1 and 9');
            addInfantBtnRef.current.children[3].style.display = 'block';
        }
        if (infantCount <= adultCount) {
            addInfantBtnRef.current.children[4].style.display = 'none';
        }
        if (infantCount <= 0) {
            return;
        }
        setInfantCount(prevInfantCount => prevInfantCount - 1);
    }
    function incrementInfantCount() {
        // If total passengers is up to 9, do nothing
        if (passengers === 9) {
            return;
        } else if (passengers < 9) {
            addInfantBtnRef.current.children[3].style.display = 'none';
        }
        if (infantCount === adultCount) {
            // console.log('Each adult can only accompany a max of 1 infant');
            addInfantBtnRef.current.children[4].style.display = 'block';
            return;
        } else if (infantCount < adultCount) {
            setInfantCount(prevInfantCount => prevInfantCount + 1);
        }
    }

    // Async function to filterLocation which runs when input value changes 
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

    // Filter departure location - input
    function filterDepLocation(e) {
        // Set departure location suggestions to false
        setDepLocationSuggestionsVisible(false);
        // Set departure location value to input target value - usestate function
        setDepartureLocation(e.target.value);
    }
    // Update departure location to selected value
    function updateDepartureLocation(e) {
        setDepartureLocation(e.target.parentElement.parentElement.childNodes[1].innerHTML);
        // Close dropdown 
        setLocationResultsVisible(false);
    }

    function showDepLocationSuggestions() {

        // Hide the arrival location suggestions card, if visible
        setArrivalLocationSuggestionsVisible(false);

        // Show the departure location suggestions card
        setDepLocationSuggestionsVisible(true);
    }

    function hideDepLocationSuggestions() {

        // If we are not hovered on the location suggestion card...
        if (!depLocationSuggestionsIsHovered) {
            // Hide the card
            setDepLocationSuggestionsVisible(false);
        }
    }

    // Update arrival location to selected value
    function updateArrivalLocation(e) {
        setArrivalLocation(e.target.parentElement.parentElement.childNodes[1].innerHTML);
        // Close dropdown 
        setArrivalLocationResultsVisible(false);
    }
    // Filter arrival location - input
    function filterArrivalLocation(e) {
        // Set arrival location suggestions to false
        setArrivalLocationSuggestionsVisible(false);
        // Set arrival location value to input target value - usestate function
        setArrivalLocation(e.target.value);
    }

    /**
     * Display arrival cities suggestion
     */
    function showArrivalSuggestions() {
        setArrivalLocationSuggestionsVisible(true);
    }

    /**
     * Hide arrival cities suggestion
     */
    function hideArrivalSuggestions() {

        // If we're on mobile...
        if (onMobile) {
            // Exit the function
            return;
        }

        // If we are not hovered on the location suggestion card...
        if (!arrivalLocationSuggestionsIsHovered) {
            // Hide the card
            setArrivalLocationSuggestionsVisible(false);
        }
    }

    // Update arrival date
    function autoSetArrivalDate() {
        if (departureDate >= arrivalDate)
            setArrivalDate(new Date(moment(departureDate).add(1, 'days')));
    }

    //#endregion

    //#region UseEffect Hooks

    // useEffect function that sets the passengers amount
    useEffect(() => {
        setPassengers(adultCount + childrenCount + infantCount);
        // set the passengers amount only when parameters below change
    }, [adultCount, childrenCount, infantCount]);

    // Infant & Adult validation 
    useEffect(() => {
        // If adultcount is decreased by 1, and infant count is less than adult count
        if (--adultCount && infantCount > adultCount) {
            // Set infantCount to decrement by 1 
            setInfantCount(prevInfantCount => prevInfantCount - 1);
        }
        // return;
    }, [adultCount]);

    // Useeffect for arrival location filter 
    useEffect(() => {
        // console.log(arrivalLocation);
        // If arrival location length is 3, show results 
        if (arrivalLocation.length == 3 || arrivalLocation > 3) {
            setArrivalLocationResultsVisible(true);
            // If arrival location length is less than 3, hide results, but show suggestions
        }
        else if (arrivalLocation.length < 1 && arrivalLocation.length > 0) {
            setArrivalLocationResultsVisible(false);
            setArrivalLocationSuggestionsVisible(true);
        }

        // Cleanup 
        return () => {
            // close the dropdown when component unmounts
            setLocationResultsVisible(false);
        };
    }, [arrivalLocation]);

    // Useeffect for departure location filter 
    useEffect(() => {
        // console.log(departureLocation);
        // If departure location length is 3, show results 
        if (departureLocation.length == 3 || departureLocation > 3) {
            setLocationResultsVisible(true);
            // If departure location length is less than 3, hide results, but show suggestions
        }
        else if (departureLocation.length < 1 && departureLocation.length > 0) {
            setLocationResultsVisible(false);
            setDepLocationSuggestionsVisible(true);
            // If departure location length is less than 2, hide suggestions
        }

        // Cleanup 
        return () => {
            // close the dropdown when component unmounts
            setLocationResultsVisible(false);
        };
    }, [departureLocation]);

    // useEffect to focus on arrival input ref when origin departure input value has a value 
    useEffect(() => {
        if (originDepartureInputVal) {
            // Set the value
            flightSearchCredentials.originLocationCityCode1 = originDepartureInputVal;
            // Update the flight search credentials
            setFlightSearchCredentials(flightSearchCredentials);
            // Focus on the next field
            originArrivalInput.current.focus();
        }
    }, [originDepartureInputVal]);

    // useEffect to focus on departure date input ref when arrival input value has a value 
    useEffect(() => {
        if (originArrivalInputVal) {
            // Set the value
            flightSearchCredentials.originDestinationCityCode1 = originArrivalInputVal;
            // Update the flight search credentials
            setFlightSearchCredentials(flightSearchCredentials);
            // Set focus on the next field
            originDepartureDateInput.current.setFocus();
        }
    }, [originArrivalInputVal]);

    // useEffect to focus on arrival date input ref when departure date input value has a value 
    useEffect(() => {
        // If origin departure date input has a value and routeModel is Round trip
        if (originDepartureDateInputVal && routeModel == RouteModel.RoundTrip) {
            // Set origin arrival date ref input focus to true
            originArrivalDateInput.current.setFocus();
        }
    }, [originDepartureDateInputVal]);

    // Run function that updates arrival date automatically when departureDate changes
    useEffect(() => {
        autoSetArrivalDate();
    }, [departureDate]);

    // Update selected departure date when departureDate changes
    useEffect(() => {
        let formattedDate = moment(departureDate).format('yyyy-MM-DD');
        setSelectedDepartureDateVal(formattedDate);
        if (RouteModel.MultiCity)
            flightSearchCredentials.departureDate1 = formattedDate;
        setFlightSearchCredentials(flightSearchCredentials);
    }, [departureDate]);
    // Update selected arrival date when arrivalDate changes 
    useEffect(() => {
        setSelectedArrivalDateVal(moment(arrivalDate).format('yyyy-MM-DD'));
    }, [arrivalDate]);

    // useEffect hook for mobile responsiveness 
    useEffect(() => {
        // Set the media query for mobile
        window.matchMedia("(max-width: 768px)").addEventListener('change', e => {
            setOnMobile(e.matches);
        });
    }, [onMobile]);
    //#endregion

    //#region API hooks

    const fetchFlightResults = useFetchFlightResults();
    const fetchFlightResultsOneWay = useFetchFlightResultsOneway();
    const fetchFlightResultsMultiCity = useFetchFlightResultsMultiCity();

    //#endregion


    //#region mobile screen functions

    // Function that controls movement of active indicator for mobile screen
    function functionIndicator() {
        if (routeModel == RouteModel.RoundTrip) {
            return '0%';
        } else if (routeModel == RouteModel.OneWay) {
            return '33.5%';
        } else if (routeModel == RouteModel.MultiCity) {
            return '66.5%';
        }
    }
    //#endregion


    // Second Search Row -----------------------------------------------------------------------------------   

    //#region second States
    // States for location section 

    const [secondLocationResultsVisible, setSecondLocationResultsVisible] = useState(false);
    const [secondArrivalLocationResultsVisible, setSecondArrivalLocationResultsVisible] = useState(false);
    const [secondDepLocationSuggestionsVisible, setSecondDepLocationSuggestionsVisible] = useState(false);
    const [secondArrivalLocationSuggestionsVisible, setSecondArrivalLocationSuggestionsVisible] = useState(false);
    const [secondDepartureLocation, setSecondDepartureLocation] = useState('');
    const [secondArrivalLocation, setSecondArrivalLocation] = useState('');

    // Form data states 
    const [secondDepartureDate, setSecondDepartureDate] = useState(new Date(moment(departureDate).add(1, 'days')));

    // States for location filter 
    const [secondDepartureAirportsFilterResult, setSecondDepartureAirportsFilterResult] = useState([]);
    const [secondArrivalAirportsFilterResult, setSecondArrivalAirportsFilterResult] = useState([]);
    // create hook for Departure Input
    const secondOriginDepartureInput = useRef();
    const secondOriginArrivalInput = useRef();
    const secondOriginDepartureDateInput = useRef();
    const secondOriginArrivalDateInput = useRef();

    const [secondOriginDepartureInputVal, setSecondOriginDepartureInputVal] = useState();
    const [secondOriginArrivalInputVal, setSecondOriginArrivalInputVal] = useState();
    const [secondOriginDepartureDateInputVal, setSecondOriginDepartureDateInputVal] = useState(moment(secondDepartureDate).format('yyyy-MM-DD'));

    // Location error states
    const [secondDepartureError, setSecondDepartureError] = useState(false);
    const [secondArrivalError, setSecondArrivalError] = useState(false);

    //#endregion

    //#region second function 

    function showSecondDepLocationSuggestions() {
        // Show the card
        setSecondDepLocationSuggestionsVisible(true);
    }

    function hideSecondDepLocationSuggestions() {

        // If we're on mobile...
        if (onMobile) {
            // Exit the function
            return;
        }

        // If we are not hovered on the location suggestion card...
        if (!depLocationSuggestionsIsHovered) {
            // Hide the card
            setSecondDepLocationSuggestionsVisible(false);
        }
    }

    function showSecondArrivalSuggestions() {
        setSecondArrivalLocationSuggestionsVisible(true);
    }

    function hideSecondArrivalSuggestions() {

        // If we're on mobile...
        if (onMobile) {
            // Exit the function
            return;
        }

        // If we are not hovered on the location suggestion card...
        if (!arrivalLocationSuggestionsIsHovered) {
            // Hide the card
            setSecondArrivalLocationSuggestionsVisible(false);
        }
    }

    // Update arrival date
    function autoSetSecondArrivalDate() {
        setSecondDepartureDate(new Date(moment(departureDate).add(1, 'days')));
    }

    //#endregion

    //#region second useeffect

    // Useeffect for arrival location filter 
    useEffect(() => {
        // console.log(secondArrivalLocation);
        // If arrival location length is 3, show results 
        if (secondArrivalLocation.length == 3 || secondArrivalLocation > 3) {
            setSecondArrivalLocationResultsVisible(true);
            // If arrival location length is less than 3, hide results, but show suggestions
        }
        else if (secondArrivalLocation.length < 1 && secondArrivalLocation.length > 0) {
            setSecondArrivalLocationResultsVisible(false);
            setSecondArrivalLocationSuggestionsVisible(true);
        }

        // Cleanup 
        return () => {
            // close the dropdown when component unmounts
            setSecondLocationResultsVisible(false);
        };
    }, [secondArrivalLocation]);

    // Useeffect for departure location filter 
    useEffect(() => {
        // console.log(secondDepartureLocation);
        // If departure location length is 3, show results 
        if (secondDepartureLocation.length == 3 || secondDepartureLocation > 3) {
            secondLocationResultsVisible(true);
            // If departure location length is less than 3, hide results, but show suggestions
        }
        else if (secondDepartureLocation.length < 1 && secondDepartureLocation.length > 0) {
            secondLocationResultsVisible(false);
            setSecondDepLocationSuggestionsVisible(true);
            // If departure location length is less than 2, hide suggestions
        }

        // Cleanup 
        return () => {
            // close the dropdown when component unmounts
            setSecondLocationResultsVisible(false);
        };
    }, [secondDepartureLocation]);

    // useEffect to focus on arrival input ref when origin departure input value has a value 
    useEffect(() => {
        if (secondOriginDepartureInputVal) {
            // Update the flight search credentials
            setFlightSearchCredentials(flightSearchCredentials);
            // Set focus on the next field
            secondOriginArrivalInput.current.focus();
        }
    }, [secondOriginDepartureInputVal]);
    // useEffect to focus on departure date input ref when arrival input value has a value 
    useEffect(() => {
        if (secondOriginArrivalInputVal) {
            // Update the flight search credentials
            setFlightSearchCredentials(flightSearchCredentials);
            // Set focus on the next field
            secondOriginDepartureDateInput.current.setFocus(true);
        }
    }, [secondOriginArrivalInputVal]);

    // Run function that updates arrival date automatically when departureDate changes
    useEffect(() => {
        autoSetSecondArrivalDate();
    }, [departureDate]);

    //#endregion


    // Third Search Row -----------------------------------------------------------------------------------   

    //#region third States

    // States for location section 
    const [thirdLocationResultsVisible, setThirdLocationResultsVisible] = useState(false);
    const [thirdArrivalLocationResultsVisible, setThirdArrivalLocationResultsVisible] = useState(false);
    const [thirdDepLocationSuggestionsVisible, setThirdDepLocationSuggestionsVisible] = useState(false);
    const [thirdArrivalLocationSuggestionsVisible, setThirdArrivalLocationSuggestionsVisible] = useState(false);
    const [thirdDepartureLocation, setThirdDepartureLocation] = useState('');
    const [thirdArrivalLocation, setThirdArrivalLocation] = useState('');

    // Form data states 
    const [thirdDepartureDate, setThirdDepartureDate] = useState(new Date(moment(departureDate).add(1, 'days')));

    // States for location filter 
    const [thirdDepartureAirportsFilterResult, setThirdDepartureAirportsFilterResult] = useState([]);
    const [thirdArrivalAirportsFilterResult, setThirdArrivalAirportsFilterResult] = useState([]);
    // create hook for Departure Input
    const thirdOriginDepartureInput = useRef();
    const thirdOriginArrivalInput = useRef();
    const thirdOriginDepartureDateInput = useRef();
    const thirdOriginArrivalDateInput = useRef();

    const [thirdOriginDepartureInputVal, setThirdOriginDepartureInputVal] = useState();
    const [thirdOriginArrivalInputVal, setThirdOriginArrivalInputVal] = useState();
    const [thirdOriginDepartureDateInputVal, setThirdOriginDepartureDateInputVal] = useState(moment(thirdDepartureDate).format('yyyy-MM-DD'));

    // Location error states
    const [thirdDepartureError, setThirdDepartureError] = useState(false);
    const [thirdArrivalError, setThirdArrivalError] = useState(false);

    //#endregion

    //#region third function 

    function showThirdDepLocationSuggestions() {
        setThirdDepLocationSuggestionsVisible(true);
    }

    function hideThirdDepLocationSuggestions() {

        // If we're on mobile...
        if (onMobile) {
            // Exit the function
            return;
        }

        // If we are not hovered on the location suggestion card...
        if (!depLocationSuggestionsIsHovered) {
            // Hide the card
            setThirdDepLocationSuggestionsVisible(false);
        }
    }

    function showThirdArrivalSuggestions() {
        setThirdArrivalLocationSuggestionsVisible(true);
    }

    function hideThirdArrivalSuggestions() {

        // If we're on mobile...
        if (onMobile) {
            // Exit the function
            return;
        }

        // If we are not hovered on the location suggestion card...
        if (!arrivalLocationSuggestionsIsHovered) {
            // Hide the card
            setThirdArrivalLocationSuggestionsVisible(false);
        }
    }

    // Update arrival date
    function autoSetThirdArrivalDate() {
        setThirdDepartureDate(new Date(moment(secondDepartureDate).add(1, 'days')))
    }

    //#endregion

    //#region third useeffect

    // Useeffect for arrival location filter 
    useEffect(() => {
        // console.log(thirdArrivalLocation);
        // If arrival location length is 3, show results 
        if (thirdArrivalLocation.length == 3 || thirdArrivalLocation > 3) {
            setThirdArrivalLocationResultsVisible(true);
            // If arrival location length is less than 3, hide results, but show suggestions
        }
        else if (thirdArrivalLocation.length < 1 && thirdArrivalLocation.length > 0) {
            setThirdArrivalLocationResultsVisible(false);
            setThirdArrivalLocationSuggestionsVisible(true);
        }

        // Cleanup 
        return () => {
            // close the dropdown when component unmounts
            setThirdLocationResultsVisible(false);
        };
    }, [thirdArrivalLocation]);

    // Useeffect for departure location filter 
    useEffect(() => {
        // console.log(thirdDepartureLocation);
        // If departure location length is 3, show results 
        if (thirdDepartureLocation.length == 3 || thirdDepartureLocation > 3) {
            thirdLocationResultsVisible(true);
            // If departure location length is less than 3, hide results, but show suggestions
        }
        else if (thirdDepartureLocation.length < 1 && thirdDepartureLocation.length > 0) {
            thirdLocationResultsVisible(false);
            setThirdDepLocationSuggestionsVisible(true);
            // If departure location length is less than 2, hide suggestions
        }

        // Cleanup 
        return () => {
            // close the dropdown when component unmounts
            setThirdLocationResultsVisible(false);
        };
    }, [thirdDepartureLocation]);

    // useEffect to focus on arrival input ref when origin departure input value has a value 
    useEffect(() => {
        if (thirdOriginDepartureInputVal) {
            // Update the flight search credentials
            setFlightSearchCredentials(flightSearchCredentials);
            // Set focus on the next field
            thirdOriginArrivalInput.current.focus();
        }
    }, [thirdOriginDepartureInputVal]);

    // useEffect to focus on departure date input ref when arrival input value has a value 
    useEffect(() => {
        if (thirdOriginArrivalInputVal) {
            // Update the flight search credentials
            setFlightSearchCredentials(flightSearchCredentials);
            // Set focus on the next field
            thirdOriginDepartureDateInput.current.setFocus(true);
        }
    }, [thirdOriginArrivalInputVal]);

    // Run function that updates arrival date automatically when departureDate changes
    useEffect(() => {
        autoSetThirdArrivalDate();
    }, [secondDepartureDate]);

    //#endregion


    // Fourth Search Row -----------------------------------------------------------------------------------   

    //#region fourth States

    // States for location section 
    const [fourthLocationResultsVisible, setFourthLocationResultsVisible] = useState(false);
    const [fourthArrivalLocationResultsVisible, setFourthArrivalLocationResultsVisible] = useState(false);
    const [fourthDepLocationSuggestionsVisible, setFourthDepLocationSuggestionsVisible] = useState(false);
    const [fourthArrivalLocationSuggestionsVisible, setFourthArrivalLocationSuggestionsVisible] = useState(false);
    const [fourthDepartureLocation, setFourthDepartureLocation] = useState('');
    const [fourthArrivalLocation, setFourthArrivalLocation] = useState('');

    // Form data states 
    const [fourthDepartureDate, setFourthDepartureDate] = useState(new Date(moment(departureDate).add(1, 'days')));

    // States for location filter 
    const [fourthDepartureAirportsFilterResult, setFourthDepartureAirportsFilterResult] = useState([]);
    const [fourthArrivalAirportsFilterResult, setFourthArrivalAirportsFilterResult] = useState([]);
    // create hook for Departure Input
    const fourthOriginDepartureInput = useRef();
    const fourthOriginArrivalInput = useRef();
    const fourthOriginDepartureDateInput = useRef();
    const fourthOriginArrivalDateInput = useRef();

    const [fourthOriginDepartureInputVal, setFourthOriginDepartureInputVal] = useState();
    const [fourthOriginArrivalInputVal, setFourthOriginArrivalInputVal] = useState();
    const [fourthOriginDepartureDateInputVal, setFourthOriginDepartureDateInputVal] = useState(moment(fourthDepartureDate).format('yyyy-MM-DD'));


    // Location error states
    const [fourthDepartureError, setFourthDepartureError] = useState(false);
    const [fourthArrivalError, setFourthArrivalError] = useState(false);
    //#endregion

    //#region fourth function 

    function showFourthDepLocationSuggestions() {
        setFourthDepLocationSuggestionsVisible(true);
    }

    function hideFourthDepLocationSuggestions() {

        // If we're on mobile...
        if (onMobile) {
            // Exit the function
            return;
        }

        // If we are not hovered on the location suggestion card...
        if (!depLocationSuggestionsIsHovered) {
            // Hide the card
            setFourthDepLocationSuggestionsVisible(false);
        }
    }

    function showFourthArrivalSuggestions() {
        setFourthArrivalLocationSuggestionsVisible(true);
    }

    function hideFourthArrivalSuggestions() {

        // If we're on mobile...
        if (onMobile) {
            // Exit the function
            return;
        }

        // If we are not hovered on the location suggestion card...
        if (!arrivalLocationSuggestionsIsHovered) {
            // Hide the card
            setFourthArrivalLocationSuggestionsVisible(false);
        }
    }

    // Update arrival date
    function autoSetFourthArrivalDate() {
        setFourthDepartureDate(new Date(moment(thirdDepartureDate).add(1, 'days')))
    }

    //#endregion

    //#region fourth useeffect

    // Useeffect for arrival location filter 
    useEffect(() => {
        // console.log(fourthArrivalLocation);
        // If arrival location length is 3, show results 
        if (fourthArrivalLocation.length == 3 || fourthArrivalLocation > 3) {
            setFourthArrivalLocationResultsVisible(true);
            // If arrival location length is less than 3, hide results, but show suggestions
        }
        else if (fourthArrivalLocation.length < 1 && fourthArrivalLocation.length > 0) {
            setFourthArrivalLocationResultsVisible(false);
            setFourthArrivalLocationSuggestionsVisible(true);
        }

        // Cleanup 
        return () => {
            // close the dropdown when component unmounts
            setFourthLocationResultsVisible(false);
        };
    }, [fourthArrivalLocation]);

    // Useeffect for departure location filter 
    useEffect(() => {
        // console.log(fourthDepartureLocation);
        // If departure location length is 3, show results 
        if (fourthDepartureLocation.length == 3 || fourthDepartureLocation > 3) {
            fourthLocationResultsVisible(true);
            // If departure location length is less than 3, hide results, but show suggestions
        }
        else if (fourthDepartureLocation.length < 1 && fourthDepartureLocation.length > 0) {
            fourthLocationResultsVisible(false);
            setFourthDepLocationSuggestionsVisible(true);
            // If departure location length is less than 2, hide suggestions
        }

        // Cleanup 
        return () => {
            // close the dropdown when component unmounts
            setFourthLocationResultsVisible(false);
        };
    }, [fourthDepartureLocation]);

    // useEffect to focus on arrival input ref when origin departure input value has a value 
    useEffect(() => {
        if (fourthOriginDepartureInputVal) {
            // Update the flight search credentials
            setFlightSearchCredentials(flightSearchCredentials);
            // Set focus on the next field
            fourthOriginArrivalInput.current.focus();
        }
    }, [fourthOriginDepartureInputVal]);

    // useEffect to focus on departure date input ref when arrival input value has a value 
    useEffect(() => {
        if (fourthOriginArrivalInputVal) {
            // Update the flight search credentials
            setFlightSearchCredentials(flightSearchCredentials);
            // Set focus on the next field
            fourthOriginDepartureDateInput.current.setFocus(true);
        }
    }, [fourthOriginArrivalInputVal]);

    // Run function that updates arrival date automatically when departureDate changes
    useEffect(() => {
        autoSetFourthArrivalDate();
    }, [thirdDepartureDate]);

    //#endregion


    // Fifth Search Row -----------------------------------------------------------------------------------   

    //#region fifth States

    // States for location section 
    const [fifthLocationResultsVisible, setFifthLocationResultsVisible] = useState(false);
    const [fifthArrivalLocationResultsVisible, setFifthArrivalLocationResultsVisible] = useState(false);
    const [fifthDepLocationSuggestionsVisible, setFifthDepLocationSuggestionsVisible] = useState(false);
    const [fifthArrivalLocationSuggestionsVisible, setFifthArrivalLocationSuggestionsVisible] = useState(false);
    const [fifthDepartureLocation, setFifthDepartureLocation] = useState('');
    const [fifthArrivalLocation, setFifthArrivalLocation] = useState('');

    // Form data states 
    const [fifthDepartureDate, setFifthDepartureDate] = useState(new Date(moment(departureDate).add(1, 'days')));

    // States for location filter 
    const [fifthDepartureAirportsFilterResult, setFifthDepartureAirportsFilterResult] = useState([]);
    const [fifthArrivalAirportsFilterResult, setFifthArrivalAirportsFilterResult] = useState([]);
    // create hook for Departure Input
    const fifthOriginDepartureInput = useRef();
    const fifthOriginArrivalInput = useRef();
    const fifthOriginDepartureDateInput = useRef();
    const fifthOriginArrivalDateInput = useRef();

    const [fifthOriginDepartureInputVal, setFifthOriginDepartureInputVal] = useState();
    const [fifthOriginArrivalInputVal, setFifthOriginArrivalInputVal] = useState();
    const [fifthOriginDepartureDateInputVal, setFifthOriginDepartureDateInputVal] = useState(moment(fifthDepartureDate).format('yyyy-MM-DD'));

    // Location error states
    const [fifthDepartureError, setFifthDepartureError] = useState(false);
    const [fifthArrivalError, setFifthArrivalError] = useState(false);
    //#endregion

    //#region fifth function

    function showFifthDepLocationSuggestions() {
        setFifthDepLocationSuggestionsVisible(true);
    }

    function hideFifthDepLocationSuggestions() {

        // If we're on mobile...
        if (onMobile) {
            // Exit the function
            return;
        }

        // If we are not hovered on the location suggestion card...
        if (!depLocationSuggestionsIsHovered) {
            // Hide the card
            setFifthDepLocationSuggestionsVisible(false);
        }
    }

    function showFifthArrivalSuggestions() {
        setFifthArrivalLocationSuggestionsVisible(true);
    }

    function hideFifthArrivalSuggestions() {

        // If we're on mobile...
        if (onMobile) {
            // Exit the function
            return;
        }

        // If we are not hovered on the location suggestion card...
        if (!arrivalLocationSuggestionsIsHovered) {
            // Hide the card
            setFifthArrivalLocationSuggestionsVisible(false);
        }
    }

    // Update arrival date
    function autoSetFifthArrivalDate() {
        setFifthDepartureDate(new Date(moment(fourthDepartureDate).add(1, 'days')))
    }

    //#endregion

    //#region fifth useeffect

    // useEffect to focus on arrival input ref when origin departure input value has a value 
    useEffect(() => {
        if (fifthOriginDepartureInputVal) {
            flightSearchCredentials.originLocationCityCode5 = fifthOriginDepartureInputVal;
            // Update the flight search credentials
            setFlightSearchCredentials(flightSearchCredentials);
            // Set focus on the next field
            fifthOriginArrivalInput.current.focus();
        }
    }, [fifthOriginDepartureInputVal]);
    // useEffect to focus on departure date input ref when arrival input value has a value 
    useEffect(() => {
        if (fifthOriginArrivalInputVal) {
            flightSearchCredentials.originDestinationCityCode5 = fifthOriginArrivalInputVal;
            // Update the flight search credentials
            setFlightSearchCredentials(flightSearchCredentials);
            // Set focus on the next field
            fifthOriginDepartureDateInput.current.setFocus(true);
        }
    }, [fifthOriginArrivalInputVal]);

    // Run function that updates arrival date automatically when departureDate changes
    useEffect(() => {
        autoSetFifthArrivalDate();
    }, [fourthDepartureDate]);

    //#endregion

    // Fifth Search Row -----------------------------------------------------------------------------------   

    //#region general function & hook

    // #region Hooks updating multi departure fields with previous arrival sequencially

    // Use effect to set departure locations on row expand

    useEffect(() => {

        // Run only if trip value is equal to MultiCity, and second search row is active
        if (routeModel == RouteModel.MultiCity && searchRows[0].active && !secondOriginDepartureInputVal) {

            // Update the state that holds the iata code
            setSecondOriginDepartureInputVal(originArrivalInputVal);

            // Modify the corresponding multi city field
            flightSearchCredentials.originLocationCityCode2 = originArrivalInputVal;
            flightSearchCredentials.departureDate2 = moment(secondDepartureDate).format('yyyy-MM-DD');

            // Update the corresponding multi city field
            setFlightSearchCredentials(flightSearchCredentials);

            // Used the ref objects by targeting their values
            secondOriginDepartureInput.current.value = originArrivalInput.current.value;
        }

        // Update third row's departure field
        if (routeModel == RouteModel.MultiCity && searchRows[1].active && !thirdOriginDepartureInputVal) {

            // Update the state that holds the iata code
            setThirdOriginDepartureInputVal(secondOriginArrivalInputVal);

            // Modify the corresponding multi city field
            flightSearchCredentials.originLocationCityCode3 = secondOriginArrivalInputVal;
            flightSearchCredentials.departureDate3 = moment(thirdDepartureDate).format('yyyy-MM-DD');

            // Update the corresponding multi city field
            setFlightSearchCredentials(flightSearchCredentials);

            // Used the ref objects by targeting their values
            thirdOriginDepartureInput.current.value = secondOriginArrivalInput.current.value;
        }

        // Update fourth row's departure field
        if (routeModel == RouteModel.MultiCity && searchRows[2].active && !fourthOriginDepartureInputVal) {

            // Update the state that holds the iata code
            setFourthOriginDepartureInputVal(thirdOriginArrivalInputVal);

            // Modify the corresponding multi city field
            flightSearchCredentials.originLocationCityCode4 = thirdOriginArrivalInputVal;
            flightSearchCredentials.departureDate4 = moment(fourthDepartureDate).format('yyyy-MM-DD');

            // Update the corresponding multi city field
            setFlightSearchCredentials(flightSearchCredentials);

            // Used the ref objects by targeting their values
            fourthOriginDepartureInput.current.value = thirdOriginArrivalInput.current.value;
        }

        // Update fifth row's departure field
        if (routeModel == RouteModel.MultiCity && searchRows[3].active && !fifthOriginDepartureInputVal) {

            // Update the state that holds the iata code
            setFifthOriginDepartureInputVal(fourthOriginArrivalInputVal);

            // Modify the corresponding multi city field
            flightSearchCredentials.originLocationCityCode5 = fourthOriginArrivalInputVal;
            flightSearchCredentials.departureDate5 = moment(fifthDepartureDate).format('yyyy-MM-DD');

            // Update the corresponding multi city field
            setFlightSearchCredentials(flightSearchCredentials);

            // Used the ref objects by targeting their values
            fifthOriginDepartureInput.current.value = fourthOriginArrivalInput.current.value;
        }

        // Run everytime first form's arrival input value changes
    }, [displaySearchRow]);

    // #endregion

    // MultiCity fields
    const [flightSearchCredentials, setFlightSearchCredentials] = useState({
        originLocationCityCode1: null,
        originDestinationCityCode1: null,
        departureDate1: null,
        arrivalDate1: null,
        originLocationCityCode2: null,
        originDestinationCityCode2: null,
        departureDate2: null,
        originLocationCityCode3: null,
        originDestinationCityCode3: null,
        departureDate3: null,
        originLocationCityCode4: null,
        originDestinationCityCode4: null,
        departureDate4: null,
        originLocationCityCode5: null,
        originDestinationCityCode5: null,
        departureDate5: null
    });

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

    // Antd Modal state 
    // Flight search processing modal visibility state
    const [flightSearchProcessingModalVisibility, setFlightSearchProcessingModalVisibility] = useState(false);

    // Validate form fields 
    async function validateForms() {

        return await new Promise((resolve, reject) => {

            // Add validation for same departure and arrival location

            if (routeModel == RouteModel.RoundTrip) {
                if (originDepartureInput.current.value && originArrivalInput.current.value && selectedDepartureDateVal && selectedArrivalDateVal) {
                    resolve({
                        dateWindow: dateWindow,
                        directFlightOnly: directFlightOnly,
                        flightClass: flightClass,
                        numberOfAdults: adultCount,
                        numberOfChildren: childrenCount,
                        numberOfInfants: infantCount,
                        originLocationCityCode: originDepartureInputVal,
                        originDestinationCityCode: originArrivalInputVal,
                        departureDate: selectedDepartureDateVal,
                        returningDate: selectedArrivalDateVal
                    });
                }
                else {
                    // If departure input is unavailable
                    if (!originDepartureInput.current.value) {
                        // Display error message
                        setDepartureError(true);
                    } else {
                        setDepartureError(false);
                    }
                    // If arrival input is unavailable
                    if (!originArrivalInput.current.value) {
                        // Display error message
                        setArrivalError(true);
                    } else {
                        setArrivalError(false);
                    }
                    reject(new Error('Form validation failed!'));
                }
            }

            if (routeModel == RouteModel.OneWay) {
                // Removed selectedArrivalDateVal since the inout field isn't needed
                if (originDepartureInput.current.value && originArrivalInput.current.value && selectedDepartureDateVal) {
                    resolve({
                        directFlightOnly: directFlightOnly,
                        flightClass: flightClass,
                        numberOfAdults: adultCount,
                        numberOfChildren: childrenCount,
                        numberOfInfants: infantCount,
                        originLocationCityCode: originDepartureInputVal,
                        originDestinationCityCode: originArrivalInputVal,
                        departureDate: selectedDepartureDateVal
                    });
                }
                else {
                    reject(new Error('Form validation failed!'));
                }
            }

            let secondRowValidated = searchRows[0].active ? secondOriginDepartureInput.current.value && secondOriginArrivalInput.current.value && secondDepartureDate : true;
            let thirdRowValidated = searchRows[1].active ? thirdOriginDepartureInput.current.value && thirdOriginArrivalInput.current.value && thirdDepartureDate : true;
            let fourthRowValidated = searchRows[2].active ? fourthOriginDepartureInput.current.value && fourthOriginArrivalInput.current.value && fourthDepartureDate : true;
            let fifthRowValidated = searchRows[3].active ? fifthOriginDepartureInput.current.value && fifthOriginArrivalInput.current.value && fifthDepartureDate : true;

            if (routeModel == RouteModel.MultiCity) {
                if (originDepartureInput.current.value && originArrivalInput.current.value && selectedDepartureDateVal
                    && secondRowValidated && thirdRowValidated && fourthRowValidated && fifthRowValidated) {
                    resolve({
                        dateWindow: dateWindow,
                        directFlightOnly: directFlightOnly,
                        flightClass: flightClass,
                        numberOfAdults: adultCount,
                        numberOfChildren: childrenCount,
                        numberOfInfants: infantCount,
                        originLocationCityCode1: flightSearchCredentials.originLocationCityCode1,
                        originDestinationCityCode1: flightSearchCredentials.originDestinationCityCode1,
                        departureDate1: flightSearchCredentials.departureDate1,
                        originLocationCityCode2: flightSearchCredentials.originLocationCityCode2,
                        originDestinationCityCode2: flightSearchCredentials.originDestinationCityCode2,
                        departureDate2: flightSearchCredentials.departureDate2,
                        originLocationCityCode3: flightSearchCredentials.originLocationCityCode3,
                        originDestinationCityCode3: flightSearchCredentials.originDestinationCityCode3,
                        departureDate3: flightSearchCredentials.departureDate3,
                        originLocationCityCode4: flightSearchCredentials.originLocationCityCode4,
                        originDestinationCityCode4: flightSearchCredentials.originDestinationCityCode4,
                        departureDate4: flightSearchCredentials.departureDate4,
                        originLocationCityCode5: flightSearchCredentials.originLocationCityCode5,
                        originDestinationCityCode5: flightSearchCredentials.originDestinationCityCode5,
                        departureDate5: flightSearchCredentials.departureDate5
                    });
                }
                else {
                    if (!originDepartureInput.current.value) {
                        setDepartureError(true);
                    } else {
                        setDepartureError(false);
                    }
                    if (!originArrivalInput.current.value) {
                        setArrivalError(true);
                    } else {
                        setArrivalError(false);
                    }

                    // If departure input is unavailable
                    if (!secondOriginDepartureInput.current.value) {
                        // Display error message
                        setSecondDepartureError(true);
                    } else {
                        setSecondDepartureError(false);
                    }
                    // If arrival input is unavailable
                    if (!secondOriginArrivalInput.current.value) {
                        // Display error message
                        setSecondArrivalError(true);
                    } else {
                        setSecondArrivalError(false);
                    }

                    // If departure input is unavailable
                    if (!thirdOriginDepartureInput.current.value) {
                        // Display error message
                        setThirdDepartureError(true);
                    } else {
                        setThirdDepartureError(false);
                    }
                    // If arrival input is unavailable
                    if (!thirdOriginArrivalInput.current.value) {
                        // Display error message
                        setThirdArrivalError(true);
                    } else {
                        setThirdArrivalError(false);
                    }

                    // If departure input is unavailable
                    if (!fourthOriginDepartureInput.current.value) {
                        // Display error message
                        setFourthDepartureError(true);
                    } else {
                        setFourthDepartureError(false);
                    }
                    // If arrival input is unavailable
                    if (!fourthOriginArrivalInput.current.value) {
                        // Display error message
                        setFourthArrivalError(true);
                    } else {
                        setFourthArrivalError(false);
                    }

                    // If departure input is unavailable
                    if (!fifthOriginDepartureInput.current.value) {
                        // Display error message
                        setFifthDepartureError(true);
                    } else {
                        setFifthDepartureError(false);
                    }
                    // If arrival input is unavailable
                    if (!fifthOriginArrivalInput.current.value) {
                        // Display error message
                        setFifthArrivalError(true);
                    } else {
                        setFifthArrivalError(false);
                    }

                    reject(new Error('Form validation failed!'));
                }
            }
        });
    }

    async function onFlightSearch(e) {
        e.preventDefault();

        await validateForms()
            .then(async (fields) => {

                // Pop up the loading modal  -  Display flight search processing modal
                console.log('Fields:', fields);

                setFlightSearchProcessingModalVisibility(true);

                if (routeModel == RouteModel.RoundTrip) {
                    await fetchFlightResults(fields)
                        .then((result) => {
                            // Release the loading modal

                            // If succeeded...
                            if (result.data.successful) {
                                // Navigate to flight match page
                                router.push(`flight-match/?flightRequestId=${result.data.response.requestId}`);
                            }
                            else {
                                // Display error modal

                                // Log the error
                                console.error('Flight Search Error:', result.data.errorMessage);
                            }
                        })
                        .catch((error) => {
                            // Log the error
                            console.error('Flight Search Error:', error);
                        });
                }

                if (routeModel == RouteModel.OneWay) {
                    await fetchFlightResultsOneWay(fields)
                        .then((result) => {
                            // Release the loading modal

                            // If succeeded...
                            if (result.data.successful) {
                                // Navigate to flight match page
                                router.push(`flight-match/?flightRequestId=${result.data.response.requestId}`);
                            }
                            else {
                                // Display error modal

                                // Log the error
                                console.error('Flight Search Error:', result.data.errorMessage);
                            }
                        })
                        .catch((error) => {
                            // Log the error
                            console.error('Flight Search Error:', error);
                        });
                }

                if (routeModel == RouteModel.MultiCity) {

                    let data = flightSearchCredentials;
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

                    await fetchFlightResultsMultiCity(fields, originDestinations, JSON.stringify(searchRows))
                        .then((result) => {
                            // Release the loading modal

                            // If succeeded...
                            if (result.data.successful) {
                                // Navigate to flight match page
                                router.push(`flight-match/?flightRequestId=${result.data.response.requestId}`);
                            }
                            else {
                                // Display error modal

                                // Log the error
                                console.error('Flight Search Error:', result.data.errorMessage);
                            }
                        })
                        .catch((error) => {
                            // Log the error
                            console.error('Flight Search Error:', error);
                        });
                }
            })
            .catch((error) => {
                console.error(error);
            });
        return;
    }

    return (
        <>
            {!onMobile && (
                <>
                    {/* <div className='christmasFill'> */}
                    {/* <Image className="bannerImg" src={BannerImg} layout="fill" objectFit='cover' alt='christmas-banner-img' /> */}
                    <div className='container'>
                        <form className='searchPanelContainer' onSubmit={async (e) => await onFlightSearch(e)}>
                            <h3>Search and Book Flights</h3>
                            <div className='spCategories'>
                                <div className='spCategories__trip'>
                                    <div className='spTripSelectedItem'>
                                        <div className='spSelected' onClick={toggleTripsOptions}>
                                            <p>{tripValue}</p>
                                            {optionVisible ? <BsChevronUp /> : <BsChevronDown />}
                                        </div>
                                        {
                                            optionVisible &&
                                            (<div ref={tripsDropDownRef} className='spDropdown'>
                                                {/* Dont show item an selected item value === dropdown item */}
                                                {
                                                    routeModel == RouteModel.RoundTrip ?
                                                        (<></>)
                                                        :
                                                        (<div className='spTripEachItem'>
                                                            <input type='radio' name='trip' value={RouteModel.RoundTrip} onClick={(e) => updateTripOptions(e)} />
                                                            <p>Round Trip</p>
                                                        </div>)
                                                }
                                                {
                                                    routeModel == RouteModel.OneWay ?
                                                        (<></>)
                                                        :
                                                        (
                                                            <div className='spTripEachItem'>
                                                                <input type='radio' name='trip' value={RouteModel.OneWay} onClick={(e) => updateTripOptions(e)} />
                                                                <p>One-Way</p>
                                                            </div>
                                                        )
                                                }
                                                {
                                                    routeModel == RouteModel.MultiCity ?
                                                        (<></>)
                                                        :
                                                        (
                                                            <div className='spTripEachItem'>
                                                                <input type='radio' name='trip' value={RouteModel.MultiCity} onClick={(e) => updateTripOptions(e)} />
                                                                <p>Multi-City</p>
                                                            </div>
                                                        )
                                                }
                                            </div>)
                                        }
                                    </div>
                                </div>
                                <div className='spCategories__passengers'>
                                    <div className='spPassengersSelectedItem'>
                                        <div className='spSelected' onClick={togglePassengerOptions}>
                                            <p>{passengers} {passengers <= 1 ? 'Passenger' : 'Passengers'}</p>
                                            {passengersVisible ? <BsChevronUp /> : <BsChevronDown />}
                                        </div>
                                        {passengersVisible &&
                                            (
                                                <div className='spDropdown'>
                                                    <div className='spPassengersEachItem'>
                                                        <div className='spPassengerType'>
                                                            <p>Adult</p>
                                                            <span>12+ Years</span>
                                                        </div>
                                                        <div className='spPassengerCounter' ref={addAdultBtnRef}>
                                                            <div className='spPassengerCounter__minus' ref={minusBtnRef} onClick={decrementAdultCount}>-</div>
                                                            <div className='spPassengerCounter__currentCount'> {adultCount} </div>
                                                            <div className='spPassengerCounter__plus' onClick={incrementAdultCount}>+</div>
                                                            <Tooltip content={'Number of total passengers must be between 1 and 9'} />
                                                            {/* <div className='spTooltip' style={{ display: 'none' }}>Number of total passengers must be between 1 and 9</div> */}
                                                        </div>
                                                    </div>
                                                    <div className='spPassengersEachItem'>
                                                        <div className='spPassengerType'>
                                                            <p>Children</p>
                                                            <span>2-11 Years</span>
                                                        </div>
                                                        <div className='spPassengerCounter' ref={addChildrenBtnRef}>
                                                            <div className='spPassengerCounter__minus' onClick={decrementChildrenCount}>-</div>
                                                            <div className='spPassengerCounter__currentCount'>{childrenCount}</div>
                                                            <div className='spPassengerCounter__plus' onClick={incrementChildrenCount}>+</div>
                                                            <Tooltip content={'Number of total passengers must be between 1 and 9'} />
                                                        </div>
                                                    </div>
                                                    <div className='spPassengersEachItem'>
                                                        <div className='spPassengerType'>
                                                            <p>Infant</p>
                                                            <span>Under 2years</span>
                                                        </div>
                                                        <div className='spPassengerCounter' ref={addInfantBtnRef}>
                                                            <div className='spPassengerCounter__minus' onClick={decrementInfantCount}>-</div>
                                                            <div className='spPassengerCounter__currentCount'>{infantCount}</div>
                                                            <div className='spPassengerCounter__plus' onClick={incrementInfantCount}>+</div>
                                                            <Tooltip content={'Number of total passengers must be between 1 and 9'} />
                                                            <Tooltip content={'Each adult can only accompany a max of 1 infant'} />
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        }
                                    </div>
                                </div>
                                <div className='spCategories__economy'>
                                    <div className='spEconomySelectedItem'>
                                        <div className='spSelected' onClick={toggleClassOptions}>
                                            <p>{classValue}</p>
                                            {classOptionsVisible ? <BsChevronUp /> : <BsChevronDown />}
                                        </div>
                                        {
                                            classOptionsVisible && (
                                                <div className='spDropdown'>
                                                    {/* Dont show item if selected item value === dropdown item */}
                                                    {
                                                        classValue === 'Economy' ?
                                                            (<></>)
                                                            :
                                                            <div className='spEconomyEachItem'>
                                                                <input type='radio' name='economy' value='Economy' onClick={(e) => updateClassOptions(e)} />
                                                                <p>Economy</p>
                                                            </div>
                                                    }
                                                    {
                                                        classValue === 'Premium Economy' ?
                                                            (<></>)
                                                            :
                                                            <div className='spEconomyEachItem'>
                                                                <input type='radio' name='economy' value='Premium Economy' onClick={(e) => updateClassOptions(e)} />
                                                                <p>Premium Economy</p>
                                                            </div>
                                                    }
                                                    {
                                                        classValue === 'Business' ?
                                                            (<></>)
                                                            :
                                                            <div className='spEconomyEachItem'>
                                                                <input type='radio' name='economy' value='Business' onClick={(e) => updateClassOptions(e)} />
                                                                <p>Business</p>
                                                            </div>
                                                    }
                                                    {
                                                        classValue === 'First Class' ?
                                                            (<></>)
                                                            :
                                                            <div className='spEconomyEachItem'>
                                                                <input type='radio' name='economy' value='First Class' onClick={(e) => updateClassOptions(e)} />
                                                                <p>First Class</p>
                                                            </div>
                                                    }
                                                </div>
                                            )
                                        }
                                    </div>
                                </div>
                            </div>

                            {/* First Search Row */}
                            <div className='spEntryContainer'>

                                {/* Location */}
                                <div className='spEntryContainer__location'>

                                    {/* Departure location */}
                                    <div className='locationContainer'>
                                        <input
                                            type='text'
                                            placeholder='From'
                                            className='departureLocation'
                                            ref={originDepartureInput}
                                            // value={departureLocation}
                                            // onChange={(e) => { filterDepLocation(e) }} 
                                            onChange={async (e) => {
                                                let value = e.currentTarget.value;
                                                // If the field has no value...
                                                if (!value || value.length < 3) {
                                                    // Set empty search result
                                                    setDepartureAirportsFilterResult([]);
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
                                                    setDepartureAirportsFilterResult(
                                                        filteredAirports
                                                    );
                                                } else {
                                                    // console.log("Airport Result:", filteredAirports);
                                                    setLocationResultsVisible(true);
                                                    setDepartureAirportsFilterResult(
                                                        filteredAirports
                                                    );
                                                    setDepLocationSuggestionsVisible(false);
                                                }
                                            }}
                                            onFocus={showDepLocationSuggestions}
                                            onBlur={hideDepLocationSuggestions}
                                        />
                                        {/* Show flight suggestions when input is clicked */}
                                        {
                                            depLocationSuggestionsVisible && (
                                                <FlightDepartureSuggestion
                                                    flightSearchCredentialKey='1'
                                                    originDepartureInput={originDepartureInput}
                                                    flightSearchCredentials={flightSearchCredentials}
                                                    setFlightSearchCredentials={setFlightSearchCredentials}
                                                    setOriginDepartureInputVal={setOriginDepartureInputVal}
                                                    setDepLocationSuggestionsVisible={setDepLocationSuggestionsVisible}
                                                    setDepLocationSuggestionsIsHovered={setDepLocationSuggestionsIsHovered}
                                                />
                                            )
                                        }

                                        {/* Show results onChange of search field */}
                                        {
                                            locationResultsVisible && departureAirportsFilterResult.length !== 0 ?
                                                (
                                                    <>
                                                        {/* {console.log('Departure airports: ', departureAirportsFilterResult)} */}
                                                        <div className='locationContainer__results'>
                                                            {
                                                                departureAirportsFilterResult.map((eachFilterResult, key) => {
                                                                    return (
                                                                        <div className='eachLoactionResult' key={key}
                                                                            onClick={() => {
                                                                                // let airport = item;
                                                                                originDepartureInput.current.value = `${eachFilterResult.name} (${eachFilterResult.iataCode})`;
                                                                                setOriginDepartureInputVal(eachFilterResult.iataCode);

                                                                                // Update flight search credentials
                                                                                flightSearchCredentials.originLocationCityCode1 = eachFilterResult.iataCode;
                                                                                setFlightSearchCredentials(flightSearchCredentials);

                                                                                setLocationResultsVisible(false);
                                                                            }}>
                                                                            <div className='eachLoactionResult__content'>
                                                                                <p>{eachFilterResult.city}, {eachFilterResult.country}</p>
                                                                                <span>{eachFilterResult.name}</span>
                                                                            </div>
                                                                            <div className='eachLoactionResult__tag'>
                                                                                {eachFilterResult.iataCode}
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                })
                                                            }
                                                        </div>
                                                    </>
                                                ) : (<></>)
                                        }
                                        {
                                            departureError && (
                                                <span className='errorLabel'>
                                                    <AiOutlineInfoCircle />
                                                    Departing City or Airport required
                                                </span>
                                            )
                                        }
                                    </div>
                                    <div className='locationIcon'>
                                        <AeroplaneIcon />
                                    </div>

                                    {/* Arrival location */}
                                    <div className='locationContainer'>
                                        <input
                                            type='text'
                                            placeholder='To'
                                            className='destinationLocation'
                                            ref={originArrivalInput}
                                            onChange={async (e) => {
                                                let value = e.currentTarget.value;
                                                // If the field has no value...
                                                if (!value || value.length < 3) {
                                                    // Set empty search result
                                                    setArrivalAirportsFilterResult([]);
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
                                                    setArrivalAirportsFilterResult(
                                                        filteredAirports
                                                    );
                                                } else {
                                                    // console.log("Airport Result:", filteredAirports);
                                                    setArrivalLocationResultsVisible(true);
                                                    setArrivalAirportsFilterResult(
                                                        filteredAirports
                                                    );
                                                    setArrivalLocationSuggestionsVisible(false);
                                                }
                                            }}
                                            onFocus={showArrivalSuggestions}
                                            onBlur={hideArrivalSuggestions}
                                        />
                                        {/* Show flight suggestions when input is clicked */}
                                        {
                                            arrivalLocationSuggestionsVisible && (
                                                <FlightArrivalSuggestion
                                                    flightSearchCredentialKey='1'
                                                    originArrivalInput={originArrivalInput}
                                                    flightSearchCredentials={flightSearchCredentials}
                                                    setFlightSearchCredentials={setFlightSearchCredentials}
                                                    setOriginArrivalInputVal={setOriginArrivalInputVal}
                                                    setArrivalLocationSuggestionsVisible={setArrivalLocationSuggestionsVisible}
                                                    setArrivalLocationSuggestionsIsHovered={setArrivalLocationSuggestionsIsHovered}
                                                />
                                            )
                                        }

                                        {/* Show results onChange of search field */}
                                        {
                                            arrivalLocationResultsVisible && arrivalAirportsFilterResult.length !== 0 ?
                                                (
                                                    <>
                                                        {console.log('Departure airports: ', arrivalAirportsFilterResult)}
                                                        <div className='locationContainer__results'>
                                                            {
                                                                arrivalAirportsFilterResult.map((eachFilterResult, key) => {
                                                                    return (
                                                                        <div className='eachLoactionResult' key={key}
                                                                            onClick={() => {
                                                                                // let airport = item;
                                                                                originArrivalInput.current.value = `${eachFilterResult.name} (${eachFilterResult.iataCode})`;
                                                                                setOriginArrivalInputVal(eachFilterResult.iataCode);

                                                                                // Update flight search credentials
                                                                                flightSearchCredentials.originDestinationCityCode1 = eachFilterResult.iataCode;
                                                                                setFlightSearchCredentials(flightSearchCredentials);

                                                                                setArrivalLocationResultsVisible(false);
                                                                            }}>
                                                                            <div className='eachLoactionResult__content'>
                                                                                <p>{eachFilterResult.city}, {eachFilterResult.country}</p>
                                                                                <span>{eachFilterResult.name}</span>
                                                                            </div>
                                                                            <div className='eachLoactionResult__tag'>
                                                                                {eachFilterResult.iataCode}
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                })
                                                            }
                                                        </div>
                                                    </>
                                                ) : (<></>)
                                        }
                                        {
                                            arrivalError && (
                                                <span className='errorLabel'>
                                                    <AiOutlineInfoCircle />
                                                    Arrival City or Airport required
                                                </span>
                                            )
                                        }
                                    </div>
                                </div>

                                {/* Date */}
                                <div className='spEntryContainer__date'>

                                    {/* Departure Date */}
                                    <DatePicker
                                        dateFormat="MMM, dd yyyy"
                                        closeOnScroll={false}
                                        selected={departureDate}
                                        onChange={(date) => {

                                            // Set the formatted date
                                            let formattedDate = moment(date).format('yyyy-MM-DD');
                                            
                                            // Set the raw date object
                                            setDepartureDate(date);

                                            // Set the formatted date in state
                                            setOriginDepartureDateInputVal(formattedDate);

                                            // Set corresponding date in flight search credentials
                                            flightSearchCredentials.departureDate1 = formattedDate;

                                            // Update the corresponding multi city field
                                            setFlightSearchCredentials(flightSearchCredentials);
                                        }}
                                        calendarContainer={MyContainer}
                                        minDate={new Date()}
                                        ref={originDepartureDateInput}
                                    />

                                    {/* Arrival Date */}
                                    {routeModel == RouteModel.RoundTrip &&
                                        (
                                            <DatePicker
                                                dateFormat="MMM, dd yyyy"
                                                closeOnScroll={false}
                                                selected={arrivalDate}
                                                onChange={(date) => setArrivalDate(date)}
                                                calendarContainer={MyContainer}
                                                // No date applies if departure date isnt selected yet 
                                                // Returning date cannot be same day or earlier 
                                                minDate={new Date(moment(departureDate).add(1, 'days'))}
                                                ref={originArrivalDateInput}
                                            />
                                        )
                                    }
                                </div>
                            </div>

                            {
                                routeModel == RouteModel.MultiCity && (
                                    <>
                                        {/* Second Search Row */}
                                        {searchRows[0].active && (
                                            <div className='spEntryContainer'>
                                                {/* Location */}
                                                <div className='spEntryContainer__location'>
                                                    {/* Departure location */}
                                                    <div className='locationContainer'>
                                                        <input
                                                            type='text'
                                                            placeholder='From'
                                                            className='departureLocation'
                                                            ref={secondOriginDepartureInput}
                                                            // value={secondDepartureLocation}
                                                            // onChange={(e) => { filterDepLocation(e) }} 
                                                            onChange={async (e) => {
                                                                let value = e.currentTarget.value;
                                                                // If the field has no value...
                                                                if (!value || value.length < 3) {
                                                                    // Set empty search result
                                                                    setSecondDepartureAirportsFilterResult([]);
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
                                                                    setSecondDepartureAirportsFilterResult(
                                                                        filteredAirports
                                                                    );
                                                                } else {
                                                                    // console.log("Airport Result:", filteredAirports);
                                                                    setSecondLocationResultsVisible(true);
                                                                    setSecondDepartureAirportsFilterResult(
                                                                        filteredAirports
                                                                    );
                                                                    setSecondDepLocationSuggestionsVisible(false);
                                                                }
                                                            }}
                                                            onFocus={showSecondDepLocationSuggestions}
                                                            onBlur={hideSecondDepLocationSuggestions}
                                                        />

                                                        {/* Show flight suggestions when input is clicked */}
                                                        {
                                                            secondDepLocationSuggestionsVisible && (
                                                                <FlightDepartureSuggestion
                                                                    flightSearchCredentialKey='2'
                                                                    originDepartureInput={secondOriginDepartureInput}
                                                                    flightSearchCredentials={flightSearchCredentials}
                                                                    setFlightSearchCredentials={setFlightSearchCredentials}
                                                                    setOriginDepartureInputVal={setSecondOriginDepartureInputVal}
                                                                    setDepLocationSuggestionsVisible={setSecondDepLocationSuggestionsVisible}
                                                                    setDepLocationSuggestionsIsHovered={setDepLocationSuggestionsIsHovered}
                                                                />
                                                            )
                                                        }

                                                        {/* Show results onChange of search field */}
                                                        {
                                                            secondLocationResultsVisible && secondDepartureAirportsFilterResult.length !== 0 ?
                                                                (
                                                                    <>
                                                                        {/* {console.log('Departure airports: ', secondDepartureAirportsFilterResult)} */}
                                                                        <div className='locationContainer__results'>
                                                                            {
                                                                                secondDepartureAirportsFilterResult.map((eachFilterResult, key) => {
                                                                                    return (
                                                                                        <div className='eachLoactionResult' key={key}
                                                                                            onClick={() => {
                                                                                                // let airport = item;
                                                                                                secondOriginDepartureInput.current.value = `${eachFilterResult.name} (${eachFilterResult.iataCode})`;
                                                                                                setSecondOriginDepartureInputVal(eachFilterResult.iataCode);

                                                                                                // Update flight search credentials
                                                                                                flightSearchCredentials.originLocationCityCode2 = eachFilterResult.iataCode;
                                                                                                setFlightSearchCredentials(flightSearchCredentials);

                                                                                                setSecondLocationResultsVisible(false);
                                                                                            }}>
                                                                                            <div className='eachLoactionResult__content'>
                                                                                                <p>{eachFilterResult.city}, {eachFilterResult.country}</p>
                                                                                                <span>{eachFilterResult.name}</span>
                                                                                            </div>
                                                                                            <div className='eachLoactionResult__tag'>
                                                                                                {eachFilterResult.iataCode}
                                                                                            </div>
                                                                                        </div>
                                                                                    );
                                                                                })
                                                                            }
                                                                        </div>
                                                                    </>
                                                                ) : (<></>)
                                                        }
                                                        {
                                                            secondDepartureError && (
                                                                <span className='errorLabel'>
                                                                    <AiOutlineInfoCircle />
                                                                    Departing City or Airport required
                                                                </span>
                                                            )
                                                        }
                                                    </div>

                                                    <div className='locationIcon'>
                                                        <AeroplaneIcon />
                                                    </div>

                                                    {/* Arrival location */}
                                                    <div className='locationContainer'>
                                                        <input
                                                            type='text'
                                                            placeholder='To'
                                                            className='destinationLocation'
                                                            ref={secondOriginArrivalInput}
                                                            onChange={async (e) => {
                                                                let value = e.currentTarget.value;
                                                                // If the field has no value...
                                                                if (!value || value.length < 3) {
                                                                    // Set empty search result
                                                                    setSecondArrivalAirportsFilterResult([]);
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
                                                                    setSecondArrivalAirportsFilterResult(
                                                                        filteredAirports
                                                                    );
                                                                } else {
                                                                    // console.log("Airport Result:", filteredAirports);
                                                                    setSecondArrivalLocationResultsVisible(true);
                                                                    setSecondArrivalAirportsFilterResult(
                                                                        filteredAirports
                                                                    );
                                                                    setSecondArrivalLocationSuggestionsVisible(false);
                                                                }
                                                            }}
                                                            onFocus={showSecondArrivalSuggestions}
                                                            onBlur={hideSecondArrivalSuggestions}
                                                        />

                                                        {/* Show flight suggestions when input is clicked */}
                                                        {
                                                            secondArrivalLocationSuggestionsVisible && (
                                                                <FlightArrivalSuggestion
                                                                    flightSearchCredentialKey='2'
                                                                    originArrivalInput={secondOriginArrivalInput}
                                                                    flightSearchCredentials={flightSearchCredentials}
                                                                    setFlightSearchCredentials={setFlightSearchCredentials}
                                                                    setOriginArrivalInputVal={setSecondOriginArrivalInputVal}
                                                                    setArrivalLocationSuggestionsVisible={setSecondArrivalLocationSuggestionsVisible}
                                                                    setArrivalLocationSuggestionsIsHovered={setArrivalLocationSuggestionsIsHovered}
                                                                />
                                                            )
                                                        }

                                                        {/* Show results onChange of search field */}
                                                        {
                                                            secondArrivalLocationResultsVisible && secondArrivalAirportsFilterResult.length !== 0 ?
                                                                (
                                                                    <>
                                                                        {console.log('Departure airports: ', secondArrivalAirportsFilterResult)}
                                                                        <div className='locationContainer__results'>
                                                                            {
                                                                                secondArrivalAirportsFilterResult.map((eachFilterResult, key) => {
                                                                                    return (
                                                                                        <div className='eachLoactionResult' key={key}
                                                                                            onClick={() => {
                                                                                                // let airport = item;
                                                                                                secondOriginArrivalInput.current.value = `${eachFilterResult.name} (${eachFilterResult.iataCode})`;
                                                                                                setSecondOriginArrivalInputVal(eachFilterResult.iataCode);

                                                                                                // Update flight search credentials
                                                                                                flightSearchCredentials.originDestinationCityCode2 = eachFilterResult.iataCode;
                                                                                                setFlightSearchCredentials(flightSearchCredentials);

                                                                                                setSecondArrivalLocationResultsVisible(false);
                                                                                            }}>
                                                                                            <div className='eachLoactionResult__content'>
                                                                                                <p>{eachFilterResult.city}, {eachFilterResult.country}</p>
                                                                                                <span>{eachFilterResult.name}</span>
                                                                                            </div>
                                                                                            <div className='eachLoactionResult__tag'>
                                                                                                {eachFilterResult.iataCode}
                                                                                            </div>
                                                                                        </div>
                                                                                    );
                                                                                })
                                                                            }
                                                                        </div>
                                                                    </>
                                                                ) : (<></>)
                                                        }
                                                        {
                                                            secondArrivalError && (
                                                                <span className='errorLabel'>
                                                                    <AiOutlineInfoCircle />
                                                                    Arrival City or Airport required
                                                                </span>
                                                            )
                                                        }
                                                    </div>
                                                </div>

                                                {/* Date */}
                                                <div className='spEntryContainer__date'>
                                                    {/* Departure Date */}
                                                    <DatePicker
                                                        dateFormat="MMM, dd yyyy"
                                                        closeOnScroll={false}
                                                        selected={secondDepartureDate}
                                                        onChange={(date) => {

                                                            // Set the formatted date
                                                            let formattedDate = moment(date).format('yyyy-MM-DD');

                                                            // Set the raw date object
                                                            setSecondDepartureDate(date);

                                                            // Set the formatted value in state
                                                            setSecondOriginDepartureDateInputVal(formattedDate);

                                                            // Set corresponding date in flight search credentials
                                                            flightSearchCredentials.departureDate2 = formattedDate;

                                                            // Update the corresponding multi city field
                                                            setFlightSearchCredentials(flightSearchCredentials);
                                                        }}
                                                        calendarContainer={MyContainer}
                                                        minDate={new Date(moment(departureDate).add(1, 'days'))}
                                                        ref={secondOriginDepartureDateInput}
                                                    />
                                                    {/* Arrival Date not needed */}
                                                </div>
                                            </div>
                                        )}

                                        {/* Third Search Row */}
                                        {searchRows[1].active && (
                                            <div className='spEntryContainer'>
                                                {/* Location */}
                                                <div className='spEntryContainer__location'>
                                                    {/* Departure location */}
                                                    <div className='locationContainer'>
                                                        <input
                                                            type='text'
                                                            placeholder='From'
                                                            className='departureLocation'
                                                            ref={thirdOriginDepartureInput}
                                                            // value={thirdDepartureLocation}
                                                            // onChange={(e) => { filterDepLocation(e) }} 
                                                            onChange={async (e) => {
                                                                let value = e.currentTarget.value;
                                                                // If the field has no value...
                                                                if (!value || value.length < 3) {
                                                                    // Set empty search result
                                                                    setThirdDepartureAirportsFilterResult([]);
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
                                                                    setThirdDepartureAirportsFilterResult(
                                                                        filteredAirports
                                                                    );
                                                                } else {
                                                                    // console.log("Airport Result:", filteredAirports);
                                                                    setThirdLocationResultsVisible(true);
                                                                    setThirdDepartureAirportsFilterResult(
                                                                        filteredAirports
                                                                    );
                                                                    setThirdDepLocationSuggestionsVisible(false);
                                                                }
                                                            }}
                                                            onFocus={showThirdDepLocationSuggestions}
                                                            onBlur={hideThirdDepLocationSuggestions}
                                                        />

                                                        {/* Show flight suggestions when input is clicked */}
                                                        {
                                                            thirdDepLocationSuggestionsVisible && (
                                                                <FlightDepartureSuggestion
                                                                    flightSearchCredentialKey='3'
                                                                    flightSearchCredentials={flightSearchCredentials}
                                                                    setFlightSearchCredentials={setFlightSearchCredentials}
                                                                    originDepartureInput={thirdOriginDepartureInput}
                                                                    setOriginDepartureInputVal={setThirdOriginDepartureInputVal}
                                                                    setDepLocationSuggestionsVisible={setThirdDepLocationSuggestionsVisible}
                                                                    setDepLocationSuggestionsIsHovered={setDepLocationSuggestionsIsHovered}
                                                                />
                                                            )
                                                        }

                                                        {/* Show results onChange of search field */}
                                                        {
                                                            thirdLocationResultsVisible && thirdDepartureAirportsFilterResult.length !== 0 ?
                                                                (
                                                                    <>
                                                                        {/* {console.log('Departure airports: ', thirdDepartureAirportsFilterResult)} */}
                                                                        <div className='locationContainer__results'>
                                                                            {
                                                                                thirdDepartureAirportsFilterResult.map((eachFilterResult, key) => {
                                                                                    return (
                                                                                        <div className='eachLoactionResult' key={key}
                                                                                            onClick={() => {
                                                                                                // let airport = item;
                                                                                                thirdOriginDepartureInput.current.value = `${eachFilterResult.name} (${eachFilterResult.iataCode})`;
                                                                                                setThirdOriginDepartureInputVal(eachFilterResult.iataCode);

                                                                                                // Update flight search credentials
                                                                                                flightSearchCredentials.originLocationCityCode3 = eachFilterResult.iataCode;
                                                                                                setFlightSearchCredentials(flightSearchCredentials);

                                                                                                setThirdLocationResultsVisible(false);
                                                                                            }}>
                                                                                            <div className='eachLoactionResult__content'>
                                                                                                <p>{eachFilterResult.city}, {eachFilterResult.country}</p>
                                                                                                <span>{eachFilterResult.name}</span>
                                                                                            </div>
                                                                                            <div className='eachLoactionResult__tag'>
                                                                                                {eachFilterResult.iataCode}
                                                                                            </div>
                                                                                        </div>
                                                                                    );
                                                                                })
                                                                            }
                                                                        </div>
                                                                    </>
                                                                ) : (<></>)
                                                        }
                                                        {
                                                            thirdDepartureError && (
                                                                <span className='errorLabel'>
                                                                    <AiOutlineInfoCircle />
                                                                    Departing City or Airport required
                                                                </span>
                                                            )
                                                        }
                                                    </div>

                                                    <div className='locationIcon'>
                                                        <AeroplaneIcon />
                                                    </div>

                                                    {/* Arrival location */}
                                                    <div className='locationContainer'>
                                                        <input
                                                            type='text'
                                                            placeholder='To'
                                                            className='destinationLocation'
                                                            ref={thirdOriginArrivalInput}
                                                            onChange={async (e) => {
                                                                let value = e.currentTarget.value;
                                                                // If the field has no value...
                                                                if (!value || value.length < 3) {
                                                                    // Set empty search result
                                                                    setThirdArrivalAirportsFilterResult([]);
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
                                                                    setThirdArrivalAirportsFilterResult(
                                                                        filteredAirports
                                                                    );
                                                                } else {
                                                                    // console.log("Airport Result:", filteredAirports);
                                                                    setThirdArrivalLocationResultsVisible(true);
                                                                    setThirdArrivalAirportsFilterResult(
                                                                        filteredAirports
                                                                    );
                                                                    setThirdArrivalLocationSuggestionsVisible(false);
                                                                }
                                                            }}
                                                            onFocus={showThirdArrivalSuggestions}
                                                            onBlur={hideThirdArrivalSuggestions}
                                                        />

                                                        {/* Show flight suggestions when input is clicked */}
                                                        {
                                                            thirdArrivalLocationSuggestionsVisible && (
                                                                <FlightArrivalSuggestion
                                                                    flightSearchCredentialKey='3'
                                                                    flightSearchCredentials={flightSearchCredentials}
                                                                    setFlightSearchCredentials={setFlightSearchCredentials}
                                                                    originArrivalInput={thirdOriginArrivalInput}
                                                                    setOriginArrivalInputVal={setThirdOriginArrivalInputVal}
                                                                    setArrivalLocationSuggestionsVisible={setThirdArrivalLocationSuggestionsVisible}
                                                                    setArrivalLocationSuggestionsIsHovered={setArrivalLocationSuggestionsIsHovered}
                                                                />
                                                            )
                                                        }

                                                        {/* Show results onChange of search field */}
                                                        {
                                                            thirdArrivalLocationResultsVisible && thirdArrivalAirportsFilterResult.length !== 0 ?
                                                                (
                                                                    <>
                                                                        {console.log('Departure airports: ', thirdArrivalAirportsFilterResult)}
                                                                        <div className='locationContainer__results'>
                                                                            {
                                                                                thirdArrivalAirportsFilterResult.map((eachFilterResult, key) => {
                                                                                    return (
                                                                                        <div className='eachLoactionResult' key={key}
                                                                                            onClick={() => {
                                                                                                // let airport = item;
                                                                                                thirdOriginArrivalInput.current.value = `${eachFilterResult.name} (${eachFilterResult.iataCode})`;
                                                                                                setThirdOriginArrivalInputVal(eachFilterResult.iataCode);

                                                                                                // Update flight search credentials
                                                                                                flightSearchCredentials.originDestinationCityCode3 = eachFilterResult.iataCode;
                                                                                                setFlightSearchCredentials(flightSearchCredentials);

                                                                                                setThirdArrivalLocationResultsVisible(false);
                                                                                            }}>
                                                                                            <div className='eachLoactionResult__content'>
                                                                                                <p>{eachFilterResult.city}, {eachFilterResult.country}</p>
                                                                                                <span>{eachFilterResult.name}</span>
                                                                                            </div>
                                                                                            <div className='eachLoactionResult__tag'>
                                                                                                {eachFilterResult.iataCode}
                                                                                            </div>
                                                                                        </div>
                                                                                    );
                                                                                })
                                                                            }
                                                                        </div>
                                                                    </>
                                                                ) : (<></>)
                                                        }
                                                        {
                                                            thirdArrivalError && (
                                                                <span className='errorLabel'>
                                                                    <AiOutlineInfoCircle />
                                                                    Arrival City or Airport required
                                                                </span>
                                                            )
                                                        }
                                                    </div>
                                                </div>
                                                {/* Date */}
                                                <div className='spEntryContainer__date'>
                                                    {/* Departure Date */}
                                                    <DatePicker
                                                        dateFormat="MMM, dd yyyy"
                                                        closeOnScroll={false}
                                                        selected={thirdDepartureDate}
                                                        onChange={(date) => {

                                                            // Set the formatted date
                                                            let formattedDate = moment(date).format('yyyy-MM-DD');

                                                            // Set the raw date object
                                                            setThirdDepartureDate(date);

                                                            // Set the formatted value in state
                                                            setThirdOriginDepartureDateInputVal(formattedDate);

                                                            // Set corresponding date in flight search credentials
                                                            flightSearchCredentials.departureDate3 = formattedDate;

                                                            // Update the corresponding multi city field
                                                            setFlightSearchCredentials(flightSearchCredentials);
                                                        }}
                                                        calendarContainer={MyContainer}
                                                        minDate={new Date(moment(secondDepartureDate).add(1, 'days'))}
                                                        ref={thirdOriginDepartureDateInput}
                                                    />
                                                    {/* Arrival Date not needed */}
                                                </div>
                                            </div>
                                        )}

                                        {/* Fourth Search Row */}
                                        {
                                            searchRows[2].active && (
                                                <div className='spEntryContainer'>
                                                    {/* Location */}
                                                    <div className='spEntryContainer__location'>
                                                        {/* Departure location */}
                                                        <div className='locationContainer'>
                                                            <input
                                                                type='text'
                                                                placeholder='From'
                                                                className='departureLocation'
                                                                ref={fourthOriginDepartureInput}
                                                                // value={fourthDepartureLocation}
                                                                // onChange={(e) => { filterDepLocation(e) }} 
                                                                onChange={async (e) => {
                                                                    let value = e.currentTarget.value;
                                                                    // If the field has no value...
                                                                    if (!value || value.length < 3) {
                                                                        // Set empty search result
                                                                        setFourthDepartureAirportsFilterResult([]);
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
                                                                        setFourthDepartureAirportsFilterResult(
                                                                            filteredAirports
                                                                        );
                                                                    } else {
                                                                        // console.log("Airport Result:", filteredAirports);
                                                                        setFourthLocationResultsVisible(true);
                                                                        setFourthDepartureAirportsFilterResult(
                                                                            filteredAirports
                                                                        );
                                                                        setFourthDepLocationSuggestionsVisible(false);
                                                                    }
                                                                }}
                                                                onFocus={showFourthDepLocationSuggestions}
                                                                onBlur={hideFourthDepLocationSuggestions}
                                                            />
                                                            {/* Show flight suggestions when input is clicked */}
                                                            {
                                                                fourthDepLocationSuggestionsVisible && (
                                                                    <FlightDepartureSuggestion
                                                                        flightSearchCredentialKey='4'
                                                                        flightSearchCredentials={flightSearchCredentials}
                                                                        setFlightSearchCredentials={setFlightSearchCredentials}
                                                                        originDepartureInput={fourthOriginDepartureInput}
                                                                        setOriginDepartureInputVal={setFourthOriginDepartureInputVal}
                                                                        setDepLocationSuggestionsVisible={setFourthDepLocationSuggestionsVisible}
                                                                        setDepLocationSuggestionsIsHovered={setDepLocationSuggestionsIsHovered}
                                                                    />
                                                                )
                                                            }

                                                            {/* Show results onChange of search field */}
                                                            {
                                                                fourthLocationResultsVisible && fourthDepartureAirportsFilterResult.length !== 0 ?
                                                                    (
                                                                        <>
                                                                            {/* {console.log('Departure airports: ', fourthDepartureAirportsFilterResult)} */}
                                                                            <div className='locationContainer__results'>
                                                                                {
                                                                                    fourthDepartureAirportsFilterResult.map((eachFilterResult, key) => {
                                                                                        return (
                                                                                            <div className='eachLoactionResult' key={key}
                                                                                                onClick={() => {
                                                                                                    // let airport = item;
                                                                                                    fourthOriginDepartureInput.current.value = `${eachFilterResult.name} (${eachFilterResult.iataCode})`;
                                                                                                    setFourthOriginDepartureInputVal(eachFilterResult.iataCode);

                                                                                                    // Update flight search credentials
                                                                                                    flightSearchCredentials.originLocationCityCode4 = eachFilterResult.iataCode;
                                                                                                    setFlightSearchCredentials(flightSearchCredentials);

                                                                                                    setFourthLocationResultsVisible(false);
                                                                                                }}>
                                                                                                <div className='eachLoactionResult__content'>
                                                                                                    <p>{eachFilterResult.city}, {eachFilterResult.country}</p>
                                                                                                    <span>{eachFilterResult.name}</span>
                                                                                                </div>
                                                                                                <div className='eachLoactionResult__tag'>
                                                                                                    {eachFilterResult.iataCode}
                                                                                                </div>
                                                                                            </div>
                                                                                        );
                                                                                    })
                                                                                }
                                                                            </div>
                                                                        </>
                                                                    ) : (<></>)
                                                            }
                                                            {
                                                                fourthDepartureError && (
                                                                    <span className='errorLabel'>
                                                                        <AiOutlineInfoCircle />
                                                                        Departing City or Airport required
                                                                    </span>
                                                                )
                                                            }
                                                        </div>

                                                        <div className='locationIcon'>
                                                            <AeroplaneIcon />
                                                        </div>

                                                        {/* Arrival location */}
                                                        <div className='locationContainer'>
                                                            <input
                                                                type='text'
                                                                placeholder='To'
                                                                className='destinationLocation'
                                                                ref={fourthOriginArrivalInput}
                                                                onChange={async (e) => {
                                                                    let value = e.currentTarget.value;
                                                                    // If the field has no value...
                                                                    if (!value || value.length < 3) {
                                                                        // Set empty search result
                                                                        setFourthArrivalAirportsFilterResult([]);
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
                                                                        setFourthArrivalAirportsFilterResult(
                                                                            filteredAirports
                                                                        );
                                                                    } else {
                                                                        // console.log("Airport Result:", filteredAirports);
                                                                        setFourthArrivalLocationResultsVisible(true);
                                                                        setFourthArrivalAirportsFilterResult(
                                                                            filteredAirports
                                                                        );
                                                                        setFourthArrivalLocationSuggestionsVisible(false);
                                                                    }
                                                                }}
                                                                onFocus={showFourthArrivalSuggestions}
                                                                onBlur={hideFourthArrivalSuggestions}
                                                            />

                                                            {/* Show flight suggestions when input is clicked */}
                                                            {
                                                                fourthArrivalLocationSuggestionsVisible && (
                                                                    <FlightArrivalSuggestion
                                                                        flightSearchCredentialKey='4'
                                                                        flightSearchCredentials={flightSearchCredentials}
                                                                        setFlightSearchCredentials={setFlightSearchCredentials}
                                                                        originArrivalInput={fourthOriginArrivalInput}
                                                                        setOriginArrivalInputVal={setFourthOriginArrivalInputVal}
                                                                        setArrivalLocationSuggestionsVisible={setFourthArrivalLocationSuggestionsVisible}
                                                                        setArrivalLocationSuggestionsIsHovered={setArrivalLocationSuggestionsIsHovered}
                                                                    />
                                                                )
                                                            }

                                                            {/* Show results onChange of search field */}
                                                            {
                                                                fourthArrivalLocationResultsVisible && fourthArrivalAirportsFilterResult.length !== 0 ?
                                                                    (
                                                                        <>
                                                                            {console.log('Departure airports: ', fourthArrivalAirportsFilterResult)}
                                                                            <div className='locationContainer__results'>
                                                                                {
                                                                                    fourthArrivalAirportsFilterResult.map((eachFilterResult, key) => {
                                                                                        return (
                                                                                            <div className='eachLoactionResult' key={key}
                                                                                                onClick={() => {
                                                                                                    // let airport = item;
                                                                                                    fourthOriginArrivalInput.current.value = `${eachFilterResult.name} (${eachFilterResult.iataCode})`;
                                                                                                    setFourthOriginArrivalInputVal(eachFilterResult.iataCode);

                                                                                                    // Update flight search credentials
                                                                                                    flightSearchCredentials.originDestinationCityCode4 = eachFilterResult.iataCode;
                                                                                                    setFlightSearchCredentials(flightSearchCredentials);

                                                                                                    setFourthArrivalLocationResultsVisible(false);
                                                                                                }}>
                                                                                                <div className='eachLoactionResult__content'>
                                                                                                    <p>{eachFilterResult.city}, {eachFilterResult.country}</p>
                                                                                                    <span>{eachFilterResult.name}</span>
                                                                                                </div>
                                                                                                <div className='eachLoactionResult__tag'>
                                                                                                    {eachFilterResult.iataCode}
                                                                                                </div>
                                                                                            </div>
                                                                                        );
                                                                                    })
                                                                                }
                                                                            </div>
                                                                        </>
                                                                    ) : (<></>)
                                                            }
                                                            {
                                                                fourthArrivalError && (
                                                                    <span className='errorLabel'>
                                                                        <AiOutlineInfoCircle />
                                                                        Arrival City or Airport required
                                                                    </span>
                                                                )
                                                            }
                                                        </div>
                                                    </div>
                                                    {/* Date */}
                                                    <div className='spEntryContainer__date'>
                                                        {/* Departure Date */}
                                                        <DatePicker
                                                            dateFormat="MMM, dd yyyy"
                                                            closeOnScroll={false}
                                                            selected={fourthDepartureDate}
                                                            onChange={(date) => {

                                                                // Set the formatted date
                                                                let formattedDate = moment(date).format('yyyy-MM-DD');
                                                                
                                                                // Set the raw date object
                                                                setFourthDepartureDate(date);
        
                                                                // Set the formatted date in state
                                                                setFourthOriginDepartureDateInputVal(formattedDate);
        
                                                                // Set corresponding date in flight search credentials
                                                                flightSearchCredentials.departureDate4 = formattedDate;
        
                                                                // Update the corresponding multi city field
                                                                setFlightSearchCredentials(flightSearchCredentials);
                                                            }}
                                                            calendarContainer={MyContainer}
                                                            minDate={new Date(moment(thirdDepartureDate).add(1, 'days'))}
                                                            ref={fourthOriginDepartureDateInput}
                                                        />
                                                        {/* Arrival Date not needed */}
                                                    </div>
                                                </div>
                                            )}

                                        {/* Fifth Search Row */}
                                        {
                                            searchRows[3].active && (
                                                <div className='spEntryContainer'>
                                                    {/* Location */}
                                                    <div className='spEntryContainer__location'>
                                                        {/* Departure location */}
                                                        <div className='locationContainer'>
                                                            <input
                                                                type='text'
                                                                placeholder='From'
                                                                className='departureLocation'
                                                                ref={fifthOriginDepartureInput}
                                                                onChange={async (e) => {
                                                                    let value = e.currentTarget.value;
                                                                    // If the field has no value...
                                                                    if (!value || value.length < 3) {
                                                                        // Set empty search result
                                                                        setFifthDepartureAirportsFilterResult([]);
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
                                                                        setFifthDepartureAirportsFilterResult(
                                                                            filteredAirports
                                                                        );
                                                                    } else {
                                                                        // console.log("Airport Result:", filteredAirports);
                                                                        setFifthLocationResultsVisible(true);
                                                                        setFifthDepartureAirportsFilterResult(
                                                                            filteredAirports
                                                                        );
                                                                        setFifthDepLocationSuggestionsVisible(false);
                                                                    }
                                                                }}
                                                                onFocus={showFifthDepLocationSuggestions}
                                                                onBlur={hideFifthDepLocationSuggestions}
                                                            />
                                                            {/* Show flight suggestions when input is clicked */}
                                                            {
                                                                fifthDepLocationSuggestionsVisible && (
                                                                    <FlightDepartureSuggestion
                                                                        flightSearchCredentialKey='5'
                                                                        flightSearchCredentials={flightSearchCredentials}
                                                                        setFlightSearchCredentials={setFlightSearchCredentials}
                                                                        originDepartureInput={fifthOriginDepartureInput}
                                                                        setOriginDepartureInputVal={setFifthOriginDepartureInputVal}
                                                                        setDepLocationSuggestionsVisible={setFifthDepLocationSuggestionsVisible}
                                                                        setDepLocationSuggestionsIsHovered={setDepLocationSuggestionsIsHovered}
                                                                    />
                                                                )
                                                            }

                                                            {/* Show results onChange of search field */}
                                                            {
                                                                fifthLocationResultsVisible && fifthDepartureAirportsFilterResult.length !== 0 ?
                                                                    (
                                                                        <>
                                                                            {/* {console.log('Departure airports: ', fifthDepartureAirportsFilterResult)} */}
                                                                            <div className='locationContainer__results'>
                                                                                {
                                                                                    fifthDepartureAirportsFilterResult.map((eachFilterResult, key) => {
                                                                                        return (
                                                                                            <div className='eachLoactionResult' key={key}
                                                                                                onClick={() => {
                                                                                                    // let airport = item;
                                                                                                    fifthOriginDepartureInput.current.value = `${eachFilterResult.name} (${eachFilterResult.iataCode})`;
                                                                                                    setFifthOriginDepartureInputVal(eachFilterResult.iataCode);

                                                                                                    // Update flight search credentials
                                                                                                    flightSearchCredentials.originLocationCityCode5 = eachFilterResult.iataCode;
                                                                                                    setFlightSearchCredentials(flightSearchCredentials);

                                                                                                    setFifthLocationResultsVisible(false);
                                                                                                }}>
                                                                                                <div className='eachLoactionResult__content'>
                                                                                                    <p>{eachFilterResult.city}, {eachFilterResult.country}</p>
                                                                                                    <span>{eachFilterResult.name}</span>
                                                                                                </div>
                                                                                                <div className='eachLoactionResult__tag'>
                                                                                                    {eachFilterResult.iataCode}
                                                                                                </div>
                                                                                            </div>
                                                                                        );
                                                                                    })
                                                                                }
                                                                            </div>
                                                                        </>
                                                                    ) : (<></>)
                                                            }
                                                            {
                                                                fifthDepartureError && (
                                                                    <span className='errorLabel'>
                                                                        <AiOutlineInfoCircle />
                                                                        Departing City or Airport required
                                                                    </span>
                                                                )
                                                            }
                                                        </div>

                                                        <div className='locationIcon'>
                                                            <AeroplaneIcon />
                                                        </div>

                                                        {/* Arrival location */}
                                                        <div className='locationContainer'>
                                                            <input
                                                                type='text'
                                                                placeholder='To'
                                                                className='destinationLocation'
                                                                ref={fifthOriginArrivalInput}
                                                                onChange={async (e) => {
                                                                    let value = e.currentTarget.value;
                                                                    // If the field has no value...
                                                                    if (!value || value.length < 3) {
                                                                        // Set empty search result
                                                                        setFifthArrivalAirportsFilterResult([]);
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
                                                                        setFifthArrivalAirportsFilterResult(
                                                                            filteredAirports
                                                                        );
                                                                    } else {
                                                                        // console.log("Airport Result:", filteredAirports);
                                                                        setFifthArrivalLocationResultsVisible(true);
                                                                        setFifthArrivalAirportsFilterResult(
                                                                            filteredAirports
                                                                        );
                                                                        setFifthArrivalLocationSuggestionsVisible(false);
                                                                    }
                                                                }}
                                                                onFocus={showFifthArrivalSuggestions}
                                                                onBlur={hideFifthArrivalSuggestions}
                                                            />

                                                            {/* Show flight suggestions when input is clicked */}
                                                            {
                                                                fifthArrivalLocationSuggestionsVisible && (
                                                                    <FlightArrivalSuggestion
                                                                        flightSearchCredentialKey='5'
                                                                        flightSearchCredentials={flightSearchCredentials}
                                                                        setFlightSearchCredentials={setFlightSearchCredentials}
                                                                        originArrivalInput={fifthOriginArrivalInput}
                                                                        setOriginArrivalInputVal={setFifthOriginArrivalInputVal}
                                                                        setArrivalLocationSuggestionsVisible={setFifthArrivalLocationSuggestionsVisible}
                                                                        setArrivalLocationSuggestionsIsHovered={setArrivalLocationSuggestionsIsHovered}
                                                                    />
                                                                )
                                                            }

                                                            {/* Show results onChange of search field */}
                                                            {
                                                                fifthArrivalLocationResultsVisible && fifthArrivalAirportsFilterResult.length !== 0 ?
                                                                    (
                                                                        <>
                                                                            {console.log('Departure airports: ', fifthArrivalAirportsFilterResult)}
                                                                            <div className='locationContainer__results'>
                                                                                {
                                                                                    fifthArrivalAirportsFilterResult.map((eachFilterResult, key) => {
                                                                                        return (
                                                                                            <div className='eachLoactionResult' key={key}
                                                                                                onClick={() => {
                                                                                                    // let airport = item;
                                                                                                    fifthOriginArrivalInput.current.value = `${eachFilterResult.name} (${eachFilterResult.iataCode})`;
                                                                                                    setFifthOriginArrivalInputVal(eachFilterResult.iataCode);

                                                                                                    // Update flight search credentials
                                                                                                    flightSearchCredentials.originDestinationCityCode5 = eachFilterResult.iataCode;
                                                                                                    setFlightSearchCredentials(flightSearchCredentials);

                                                                                                    setFifthArrivalLocationResultsVisible(false);
                                                                                                }}>
                                                                                                <div className='eachLoactionResult__content'>
                                                                                                    <p>{eachFilterResult.city}, {eachFilterResult.country}</p>
                                                                                                    <span>{eachFilterResult.name}</span>
                                                                                                </div>
                                                                                                <div className='eachLoactionResult__tag'>
                                                                                                    {eachFilterResult.iataCode}
                                                                                                </div>
                                                                                            </div>
                                                                                        );
                                                                                    })
                                                                                }
                                                                            </div>
                                                                        </>
                                                                    ) : (<></>)
                                                            }
                                                            {
                                                                fifthArrivalError && (
                                                                    <span className='errorLabel'>
                                                                        <AiOutlineInfoCircle />
                                                                        Arrival City or Airport required
                                                                    </span>
                                                                )
                                                            }
                                                        </div>
                                                    </div>
                                                    {/* Date */}
                                                    <div className='spEntryContainer__date'>
                                                        {/* Departure Date */}
                                                        <DatePicker
                                                            dateFormat="MMM, dd yyyy"
                                                            closeOnScroll={false}
                                                            selected={fifthDepartureDate}
                                                            onChange={(date) => {

                                                                // Set the formatted date
                                                                let formattedDate = moment(date).format('yyyy-MM-DD');
                                                                
                                                                // Set the raw date object
                                                                setFifthDepartureDate(date);
        
                                                                // Set the formatted date in state
                                                                setFifthOriginDepartureDateInputVal(formattedDate);
        
                                                                // Set corresponding date in flight search credentials
                                                                flightSearchCredentials.departureDate5 = formattedDate;
        
                                                                // Update the corresponding multi city field
                                                                setFlightSearchCredentials(flightSearchCredentials);
                                                            }}
                                                            calendarContainer={MyContainer}
                                                            minDate={new Date(moment(fourthDepartureDate).add(1, 'days'))}
                                                            ref={fifthOriginDepartureDateInput}
                                                        />
                                                        {/* Arrival Date not needed */}
                                                    </div>
                                                </div>
                                            )
                                        }
                                    </>
                                )
                            }

                            <div className='spOptionsContainer'>
                                <div className='left'>
                                    {/* Show button below only when Multicity is selected from flight categories dropdown */}
                                    {
                                        routeModel == RouteModel.MultiCity && (
                                            <div className='btn' onClick={displaySearchRow}>Add Flight</div>
                                        )
                                    }
                                    {/* Show button below only when Multicity is selected from flight categories dropdown,
                                    and a minimum of 2 search forms is visible */}
                                    {
                                        routeModel == RouteModel.MultiCity && searchRows[0].active && (
                                            <div className='btn' onClick={removeSearchRow}>Remove Flight</div>
                                        )
                                    }
                                    <div className='spOptionsContainerOption'>
                                        <input type='checkbox' name='flight' value='Direct flight' onChange={(e) => setDirectFlightOnly(e.currentTarget.checked)} />
                                        <div className='spOptionsContainerOption__checker'>
                                            <BsCheck />
                                        </div>
                                        <p>Direct Flight Only</p>
                                    </div>
                                    {
                                        routeModel == RouteModel.MultiCity || routeModel == RouteModel.OneWay ? (
                                            <></>
                                        ) : (
                                            <div className='spOptionsContainerOption'>
                                                <input type='checkbox' name='days' value='' onChange={(e) => setDateWindow(e.currentTarget.checked)} />
                                                <div className='spOptionsContainerOption__checker'>
                                                    <BsCheck />
                                                </div>
                                                <p>+/-3 Days</p>
                                            </div>
                                        )
                                    }
                                </div>
                                <div className='right'>
                                    <button type='submit' className='btn'>Search</button>
                                </div>
                            </div>
                        </form >
                    </div>
                    {/* </div> */}

                    <FlightSearchProcessing
                        flightSearchProcessingModalVisibility={flightSearchProcessingModalVisibility}
                        originLocation={originDepartureInputVal}
                        originDestination={originArrivalInputVal}
                        departureDate={selectedDepartureDateVal}
                        arrivalDate={selectedArrivalDateVal}
                        flightClass={classValue}
                        totalPassengers={passengers}
                    />
                </>
            )}
            {
                onMobile && (
                    <>
                        {/* <div className='christmasFill'> */}
                        {/* <Image className="bannerImg" src={mobileBannerImg} layout="fill" objectFit='cover' alt='christmas-banner-img' /> */}
                        <div className='mobileContainer'>
                            <div className='container'>
                                <div className='container__topBar'>
                                    <h2>Search and Book Flights</h2>
                                </div>
                                <form className='mSearchPanelContainer' onSubmit={async (e) => await onFlightSearch(e)}>
                                    <div className='mSearchPanelContainer__mSetSpData'>
                                        <div className='mSetSpCategories'>
                                            <p onClick={() => { setRouteModel(RouteModel.RoundTrip) }}>Round Trip</p>
                                            <p onClick={() => { setRouteModel(RouteModel.OneWay) }}>One Way</p>
                                            <p onClick={() => { setRouteModel(RouteModel.MultiCity) }}>Multi City</p>
                                            <span
                                                className='mSetSpCategories__indicator'
                                                style={
                                                    { left: `${functionIndicator()}` }
                                                }
                                            // style={routeModel === RouteModel.RoundTrip && { left: '0%' }
                                            //         : routeModel === RouteModel.RoundTrip && { left: '33.5%' }
                                            //             : routeModel === RouteModel.MultiCity && { left: '66.5%' }}
                                            ></span>
                                        </div>

                                        <div className='mSetSpSelection'>
                                            <div className='mSetSpSelection__passenger'>
                                                <div className='mSpPassengersSelectedItem' onClick={togglePassengerOptions}>
                                                    <p>{passengers} {passengers <= 1 ? 'Passenger' : 'Passengers'}</p>
                                                    {passengersVisible ? <AiFillCaretUp /> : <AiFillCaretDown />}
                                                </div>
                                                {
                                                    passengersVisible && (
                                                        <div className='spDropdown'>
                                                            <div className='spPassengersEachItem'>
                                                                <div className='spPassengerType'>
                                                                    <p>Adult</p>
                                                                    <span>12+ Years</span>
                                                                </div>
                                                                <div className='spPassengerCounter' ref={addAdultBtnRef}>
                                                                    <div className='spPassengerCounter__minus' ref={minusBtnRef} onClick={decrementAdultCount}>-</div>
                                                                    <div className='spPassengerCounter__currentCount'> {adultCount} </div>
                                                                    <div className='spPassengerCounter__plus' onClick={incrementAdultCount}>+</div>
                                                                    <Tooltip content={'Number of total passengers must be between 1 and 9'} />
                                                                    {/* <div className='spTooltip' style={{ display: 'none' }}>Number of total passengers must be between 1 and 9</div> */}
                                                                </div>
                                                            </div>
                                                            <div className='spPassengersEachItem'>
                                                                <div className='spPassengerType'>
                                                                    <p>Children</p>
                                                                    <span>2-11 Years</span>
                                                                </div>
                                                                <div className='spPassengerCounter' ref={addChildrenBtnRef}>
                                                                    <div className='spPassengerCounter__minus' onClick={decrementChildrenCount}>-</div>
                                                                    <div className='spPassengerCounter__currentCount'>{childrenCount}</div>
                                                                    <div className='spPassengerCounter__plus' onClick={incrementChildrenCount}>+</div>
                                                                    <Tooltip content={'Number of total passengers must be between 1 and 9'} />
                                                                </div>
                                                            </div>
                                                            <div className='spPassengersEachItem'>
                                                                <div className='spPassengerType'>
                                                                    <p>Infant</p>
                                                                    <span>Under 2years</span>
                                                                </div>
                                                                <div className='spPassengerCounter' ref={addInfantBtnRef}>
                                                                    <div className='spPassengerCounter__minus' onClick={decrementInfantCount}>-</div>
                                                                    <div className='spPassengerCounter__currentCount'>{infantCount}</div>
                                                                    <div className='spPassengerCounter__plus' onClick={incrementInfantCount}>+</div>
                                                                    <Tooltip content={'Number of total passengers must be between 1 and 9'} />
                                                                    <Tooltip content={'Each adult can only accompany a max of 1 infant'} />
                                                                </div>
                                                            </div>
                                                            <div className='btn' onClick={togglePassengerOptions}>Save</div>
                                                        </div>
                                                    )
                                                }
                                            </div>
                                            <div className='mSetSpSelection__class'>
                                                <div className='mSpPassengersSelectedItem' onClick={toggleClassOptions}>
                                                    <p>{classValue}</p>
                                                    {classOptionsVisible ? <AiFillCaretUp /> : <AiFillCaretDown />}
                                                </div>
                                                {
                                                    classOptionsVisible && (
                                                        <div className='spDropdown'>
                                                            {/* Dont show item if selected item value === dropdown item */}
                                                            {
                                                                classValue === 'Economy' ?
                                                                    (<></>)
                                                                    :
                                                                    <div className='spEconomyEachItem'>
                                                                        <input type='radio' name='economy' value='Economy' onClick={(e) => updateClassOptions(e)} />
                                                                        <p>Economy</p>
                                                                    </div>
                                                            }
                                                            {
                                                                classValue === 'Premium Economy' ?
                                                                    (<></>)
                                                                    :
                                                                    <div className='spEconomyEachItem'>
                                                                        <input type='radio' name='economy' value='Premium Economy' onClick={(e) => updateClassOptions(e)} />
                                                                        <p>Premium Economy</p>
                                                                    </div>
                                                            }
                                                            {
                                                                classValue === 'Business' ?
                                                                    (<></>)
                                                                    :
                                                                    <div className='spEconomyEachItem'>
                                                                        <input type='radio' name='economy' value='Business' onClick={(e) => updateClassOptions(e)} />
                                                                        <p>Business</p>
                                                                    </div>
                                                            }
                                                            {
                                                                classValue === 'First Class' ?
                                                                    (<></>)
                                                                    :
                                                                    <div className='spEconomyEachItem'>
                                                                        <input type='radio' name='economy' value='First Class' onClick={(e) => updateClassOptions(e)} />
                                                                        <p>First Class</p>
                                                                    </div>
                                                            }
                                                        </div>
                                                    )
                                                }
                                            </div>
                                        </div>
                                    </div>

                                    {/* First search row */}
                                    <div className='mSearchPanelContainer__mSetEntryData'>
                                        <div className='location'>
                                            <div className='location__mLocationContainer'>
                                                <input
                                                    type='text'
                                                    placeholder='From'
                                                    className='mDepartureLocation'
                                                    ref={originDepartureInput}
                                                    onChange={async (e) => {
                                                        let value = e.currentTarget.value;
                                                        // If the field has no value...
                                                        if (!value || value.length < 3) {
                                                            // Set empty search result
                                                            setDepartureAirportsFilterResult([]);
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
                                                            setDepartureAirportsFilterResult(
                                                                filteredAirports
                                                            );
                                                        } else {
                                                            // console.log("Airport Result:", filteredAirports);
                                                            setLocationResultsVisible(true);
                                                            setDepartureAirportsFilterResult(
                                                                filteredAirports
                                                            );
                                                            setDepLocationSuggestionsVisible(false);
                                                        }
                                                    }}
                                                    onFocus={showDepLocationSuggestions}
                                                    onBlur={hideDepLocationSuggestions}
                                                />
                                                {/* Show flight suggestions when input is clicked */}
                                                {
                                                    depLocationSuggestionsVisible && (
                                                        <FlightDepartureSuggestion
                                                            flightSearchCredentialKey='1'
                                                            originDepartureInput={originDepartureInput}
                                                            flightSearchCredentials={flightSearchCredentials}
                                                            setFlightSearchCredentials={setFlightSearchCredentials}
                                                            setOriginDepartureInputVal={setOriginDepartureInputVal}
                                                            showDepLocationSuggestions={showDepLocationSuggestions}
                                                            setDepLocationSuggestionsVisible={setDepLocationSuggestionsVisible}
                                                            setDepLocationSuggestionsIsHovered={setDepLocationSuggestionsIsHovered}
                                                        />
                                                    )
                                                }

                                                {/* Show results onChange of search field */}
                                                {
                                                    locationResultsVisible && departureAirportsFilterResult.length !== 0 ?
                                                        (
                                                            <>
                                                                {/* {console.log('Departure airports: ', departureAirportsFilterResult)} */}
                                                                <div className='locationContainer__results'>
                                                                    {
                                                                        departureAirportsFilterResult.map((eachFilterResult, key) => {
                                                                            return (
                                                                                <div className='eachLoactionResult' key={key}
                                                                                    onClick={() => {
                                                                                        // let airport = item;
                                                                                        originDepartureInput.current.value = `${eachFilterResult.name} (${eachFilterResult.iataCode})`;

                                                                                        // Update the flight search credentials
                                                                                        flightSearchCredentials.originLocationCityCode1 = eachFilterResult.iataCode;
                                                                                        setFlightSearchCredentials(flightSearchCredentials);

                                                                                        setOriginDepartureInputVal(eachFilterResult.iataCode);
                                                                                        setLocationResultsVisible(false);
                                                                                    }}>
                                                                                    <div className='eachLoactionResult__content'>
                                                                                        <p>{eachFilterResult.city}, {eachFilterResult.country}</p>
                                                                                        <span>{eachFilterResult.name}</span>
                                                                                    </div>
                                                                                    <div className='eachLoactionResult__tag'>
                                                                                        {eachFilterResult.iataCode}
                                                                                    </div>
                                                                                </div>
                                                                            );
                                                                        })
                                                                    }
                                                                </div>
                                                            </>
                                                        ) : (<></>)
                                                }
                                            </div>
                                            <div className='location__mLocationIcon'>
                                                <AeroplaneIcon />
                                            </div>
                                            <div className='location__mLocationContainer'>
                                                <input
                                                    type='text'
                                                    placeholder='To'
                                                    className='destinationLocation'
                                                    ref={originArrivalInput}
                                                    onChange={async (e) => {
                                                        let value = e.currentTarget.value;
                                                        // If the field has no value...
                                                        if (!value || value.length < 3) {
                                                            // Set empty search result
                                                            setArrivalAirportsFilterResult([]);
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
                                                            setArrivalAirportsFilterResult(
                                                                filteredAirports
                                                            );
                                                        } else {
                                                            // console.log("Airport Result:", filteredAirports);
                                                            setArrivalLocationResultsVisible(true);
                                                            setArrivalAirportsFilterResult(
                                                                filteredAirports
                                                            );
                                                            setArrivalLocationSuggestionsVisible(false);
                                                        }
                                                    }}
                                                    onFocus={showArrivalSuggestions}
                                                    onBlur={hideArrivalSuggestions}
                                                />
                                                {/* Show flight suggestions when input is clicked */}
                                                {
                                                    arrivalLocationSuggestionsVisible && (
                                                        <FlightArrivalSuggestion
                                                            flightSearchCredentialKey='1'
                                                            originArrivalInput={originArrivalInput}
                                                            flightSearchCredentials={flightSearchCredentials}
                                                            setFlightSearchCredentials={setFlightSearchCredentials}
                                                            setOriginArrivalInputVal={setOriginArrivalInputVal}
                                                            setArrivalLocationSuggestionsVisible={setArrivalLocationSuggestionsVisible}
                                                            setArrivalLocationSuggestionsIsHovered={setArrivalLocationSuggestionsIsHovered}
                                                        />
                                                    )
                                                }
                                                {/* Show results onChange of search field */}
                                                {
                                                    arrivalLocationResultsVisible && arrivalAirportsFilterResult.length !== 0 ?
                                                        (
                                                            <>
                                                                {/* {console.log('Departure airports: ', arrivalAirportsFilterResult)} */}
                                                                <div className='locationContainer__results'>
                                                                    {
                                                                        arrivalAirportsFilterResult.map((eachFilterResult, key) => {
                                                                            return (
                                                                                <div className='eachLoactionResult' key={key}
                                                                                    onClick={() => {
                                                                                        // let airport = item;
                                                                                        originArrivalInput.current.value = `${eachFilterResult.name} (${eachFilterResult.iataCode})`;
                                                                                        setOriginArrivalInputVal(eachFilterResult.iataCode);

                                                                                        // Update flight search credentials
                                                                                        flightSearchCredentials.originDestinationCityCode2 = eachFilterResult.iataCode;
                                                                                        setFlightSearchCredentials(flightSearchCredentials);

                                                                                        setArrivalLocationResultsVisible(false);
                                                                                    }}>
                                                                                    <div className='eachLoactionResult__content'>
                                                                                        <p>{eachFilterResult.city}, {eachFilterResult.country}</p>
                                                                                        <span>{eachFilterResult.name}</span>
                                                                                    </div>
                                                                                    <div className='eachLoactionResult__tag'>
                                                                                        {eachFilterResult.iataCode}
                                                                                    </div>
                                                                                </div>
                                                                            );
                                                                        })
                                                                    }
                                                                </div>
                                                            </>
                                                        ) : (<></>)
                                                }
                                            </div>
                                        </div>

                                        <div className='date'>

                                            {/* Departure date */}
                                            <DatePicker
                                                className='mDepartureDate'
                                                dateFormat="MMM, dd yyyy"
                                                closeOnScroll={false}
                                                selected={departureDate}
                                                onChange={(date) => {

                                                    // Set the formatted date
                                                    let formattedDate = moment(date).format('yyyy-MM-DD');

                                                    // Set the raw date object
                                                    setDepartureDate(date);

                                                    // Set the formatted date in state
                                                    setOriginDepartureDateInputVal(formattedDate);

                                                    // Set corresponding date in flight search credentials
                                                    flightSearchCredentials.departureDate1 = formattedDate;

                                                    // Update the corresponding multi city field
                                                    setFlightSearchCredentials(flightSearchCredentials);
                                                }}
                                                calendarContainer={MyContainer}
                                                minDate={new Date()}
                                                ref={originDepartureDateInput}
                                            />

                                            {/* Arrival date */}
                                            {
                                                // If route modal is round trip...
                                                routeModel === RouteModel.RoundTrip &&
                                                (
                                                    <DatePicker
                                                        className='mArrivaleDate'
                                                        dateFormat="MMM, dd yyyy"
                                                        closeOnScroll={false}
                                                        selected={arrivalDate}
                                                        onChange={(date) => setArrivalDate(date)}
                                                        calendarContainer={MyContainerArrival}
                                                        // No date applies if departure date isnt selected yet 
                                                        // Returning date cannot be same day or earlier 
                                                        minDate={new Date(moment(departureDate).add(1, 'days'))}
                                                        ref={originArrivalDateInput}
                                                    />
                                                )
                                            }
                                        </div>
                                    </div>
                                    {
                                        routeModel == RouteModel.MultiCity && (
                                            <>
                                                {/* Second Search Row */}
                                                {searchRows[0].active && (
                                                    <div className='mSearchPanelContainer__mSetEntryData'>
                                                        {/* Location */}
                                                        <div className='location'>
                                                            <div className='location__mLocationContainer'>
                                                                <input
                                                                    type='text'
                                                                    placeholder='From'
                                                                    className='mDepartureLocation'
                                                                    ref={secondOriginDepartureInput}
                                                                    onChange={async (e) => {
                                                                        let value = e.currentTarget.value;
                                                                        // If the field has no value...
                                                                        if (!value || value.length < 3) {
                                                                            // Set empty search result
                                                                            setSecondDepartureAirportsFilterResult([]);
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
                                                                            setSecondDepartureAirportsFilterResult(
                                                                                filteredAirports
                                                                            );
                                                                        } else {
                                                                            // console.log("Airport Result:", filteredAirports);
                                                                            setSecondLocationResultsVisible(true);
                                                                            setSecondDepartureAirportsFilterResult(
                                                                                filteredAirports
                                                                            );
                                                                            setSecondDepLocationSuggestionsVisible(false);
                                                                        }
                                                                    }}
                                                                    onFocus={showSecondDepLocationSuggestions}
                                                                    onBlur={hideSecondDepLocationSuggestions}
                                                                />
                                                                {/* Show flight suggestions when input is clicked */}
                                                                {
                                                                    secondDepLocationSuggestionsVisible && (
                                                                        <FlightDepartureSuggestion
                                                                            flightSearchCredentialKey='2'
                                                                            originDepartureInput={secondOriginDepartureInput}
                                                                            flightSearchCredentials={flightSearchCredentials}
                                                                            setFlightSearchCredentials={setFlightSearchCredentials}
                                                                            setOriginDepartureInputVal={setSecondOriginDepartureInputVal}
                                                                            setDepLocationSuggestionsVisible={setSecondDepLocationSuggestionsVisible}
                                                                            setDepLocationSuggestionsIsHovered={setDepLocationSuggestionsIsHovered}
                                                                        />
                                                                    )
                                                                }

                                                                {/* Show results onChange of search field */}
                                                                {
                                                                    secondLocationResultsVisible && secondDepartureAirportsFilterResult.length !== 0 ?
                                                                        (
                                                                            <>
                                                                                {/* {console.log('Departure airports: ', secondDepartureAirportsFilterResult)} */}
                                                                                <div className='locationContainer__results'>
                                                                                    {
                                                                                        secondDepartureAirportsFilterResult.map((eachFilterResult, key) => {
                                                                                            return (
                                                                                                <div className='eachLoactionResult' key={key}
                                                                                                    onClick={() => {
                                                                                                        // let airport = item;
                                                                                                        secondOriginDepartureInput.current.value = `${eachFilterResult.name} (${eachFilterResult.iataCode})`;
                                                                                                        setSecondOriginDepartureInputVal(eachFilterResult.iataCode);

                                                                                                        // Update flight search credentials
                                                                                                        flightSearchCredentials.originLocationCityCode2 = eachFilterResult.iataCode;
                                                                                                        setFlightSearchCredentials(flightSearchCredentials);

                                                                                                        setSecondLocationResultsVisible(false);
                                                                                                    }}>
                                                                                                    <div className='eachLoactionResult__content'>
                                                                                                        <p>{eachFilterResult.city}, {eachFilterResult.country}</p>
                                                                                                        <span>{eachFilterResult.name}</span>
                                                                                                    </div>
                                                                                                    <div className='eachLoactionResult__tag'>
                                                                                                        {eachFilterResult.iataCode}
                                                                                                    </div>
                                                                                                </div>
                                                                                            );
                                                                                        })
                                                                                    }
                                                                                </div>
                                                                            </>
                                                                        ) : (<></>)
                                                                }
                                                            </div>
                                                            <div className='location__mLocationIcon'>
                                                                <AeroplaneIcon />
                                                            </div>
                                                            <div className='location__mLocationContainer'>
                                                                <input
                                                                    type='text'
                                                                    placeholder='To'
                                                                    className='destinationLocation'
                                                                    ref={secondOriginArrivalInput}
                                                                    onChange={async (e) => {
                                                                        let value = e.currentTarget.value;
                                                                        // If the field has no value...
                                                                        if (!value || value.length < 3) {
                                                                            // Set empty search result
                                                                            setSecondArrivalAirportsFilterResult([]);
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
                                                                            setSecondArrivalAirportsFilterResult(
                                                                                filteredAirports
                                                                            );
                                                                        } else {
                                                                            // console.log("Airport Result:", filteredAirports);
                                                                            setSecondArrivalLocationResultsVisible(true);
                                                                            setSecondArrivalAirportsFilterResult(
                                                                                filteredAirports
                                                                            );
                                                                            setSecondArrivalLocationSuggestionsVisible(false);
                                                                        }
                                                                    }}
                                                                    onFocus={showSecondArrivalSuggestions}
                                                                    onBlur={hideSecondArrivalSuggestions}
                                                                />
                                                                {/* Show flight suggestions when input is clicked */}
                                                                {
                                                                    secondArrivalLocationSuggestionsVisible && (
                                                                        <FlightArrivalSuggestion
                                                                            flightSearchCredentialKey='2'
                                                                            originArrivalInput={secondOriginArrivalInput}
                                                                            flightSearchCredentials={flightSearchCredentials}
                                                                            setFlightSearchCredentials={setFlightSearchCredentials}
                                                                            setOriginArrivalInputVal={setSecondOriginArrivalInputVal}
                                                                            setArrivalLocationSuggestionsVisible={setSecondArrivalLocationSuggestionsVisible}
                                                                            setArrivalLocationSuggestionsIsHovered={setArrivalLocationSuggestionsIsHovered}
                                                                        />
                                                                    )
                                                                }
                                                                {/* Show results onChange of search field */}
                                                                {
                                                                    secondArrivalLocationResultsVisible && secondArrivalAirportsFilterResult.length !== 0 ?
                                                                        (
                                                                            <>
                                                                                {/* {console.log('Departure airports: ', arrivalAirportsFilterResult)} */}
                                                                                <div className='locationContainer__results'>
                                                                                    {
                                                                                        secondArrivalAirportsFilterResult.map((eachFilterResult, key) => {
                                                                                            return (
                                                                                                <div className='eachLoactionResult' key={key}
                                                                                                    onClick={() => {
                                                                                                        // let airport = item;
                                                                                                        secondOriginArrivalInput.current.value = `${eachFilterResult.name} (${eachFilterResult.iataCode})`;
                                                                                                        setSecondOriginArrivalInputVal(eachFilterResult.iataCode);

                                                                                                        // Update flight search credentials
                                                                                                        flightSearchCredentials.originDestinationCityCode2 = eachFilterResult.iataCode;
                                                                                                        setFlightSearchCredentials(flightSearchCredentials);

                                                                                                        setSecondArrivalLocationResultsVisible(false);
                                                                                                    }}>
                                                                                                    <div className='eachLoactionResult__content'>
                                                                                                        <p>{eachFilterResult.city}, {eachFilterResult.country}</p>
                                                                                                        <span>{eachFilterResult.name}</span>
                                                                                                    </div>
                                                                                                    <div className='eachLoactionResult__tag'>
                                                                                                        {eachFilterResult.iataCode}
                                                                                                    </div>
                                                                                                </div>
                                                                                            );
                                                                                        })
                                                                                    }
                                                                                </div>
                                                                            </>
                                                                        ) : (<></>)
                                                                }
                                                            </div>
                                                        </div>

                                                        {/* Date */}
                                                        <div className='date'>

                                                            {/* Departure date */}
                                                            <DatePicker
                                                                className='mDepartureDate'
                                                                dateFormat="MMM, dd yyyy"
                                                                closeOnScroll={false}
                                                                selected={secondDepartureDate}
                                                                onChange={(date) => {

                                                                    // Set the formatted date
                                                                    let formattedDate = moment(date).format('yyyy-MM-DD');

                                                                    // Set the raw date object
                                                                    setSecondDepartureDate(date);

                                                                    // Set the formatted date in state
                                                                    setSecondOriginDepartureDateInputVal(formattedDate);

                                                                    // Set corresponding date in flight search credentials
                                                                    flightSearchCredentials.departureDate2 = formattedDate;

                                                                    // Update the corresponding multi city field
                                                                    setFlightSearchCredentials(flightSearchCredentials);
                                                                }}
                                                                calendarContainer={MyContainer}
                                                                minDate={new Date()}
                                                                ref={secondOriginDepartureDateInput}
                                                            />
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Third Search Row */}
                                                {searchRows[1].active && (
                                                    <div className='mSearchPanelContainer__mSetEntryData'>
                                                        {/* Location */}
                                                        <div className='location'>
                                                            <div className='location__mLocationContainer'>
                                                                <input
                                                                    type='text'
                                                                    placeholder='From'
                                                                    className='mDepartureLocation'
                                                                    ref={thirdOriginDepartureInput}
                                                                    onChange={async (e) => {
                                                                        let value = e.currentTarget.value;
                                                                        // If the field has no value...
                                                                        if (!value || value.length < 3) {
                                                                            // Set empty search result
                                                                            setThirdDepartureAirportsFilterResult([]);
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
                                                                            setThirdDepartureAirportsFilterResult(
                                                                                filteredAirports
                                                                            );
                                                                        } else {
                                                                            // console.log("Airport Result:", filteredAirports);
                                                                            setThirdLocationResultsVisible(true);
                                                                            setThirdDepartureAirportsFilterResult(
                                                                                filteredAirports
                                                                            );
                                                                            setThirdDepLocationSuggestionsVisible(false);
                                                                        }
                                                                    }}
                                                                    onFocus={showThirdDepLocationSuggestions}
                                                                    onBlur={hideThirdDepLocationSuggestions}
                                                                />
                                                                {/* Show flight suggestions when input is clicked */}
                                                                {
                                                                    thirdDepLocationSuggestionsVisible && (
                                                                        <FlightDepartureSuggestion
                                                                            flightSearchCredentialKey='3'
                                                                            originDepartureInput={thirdOriginDepartureInput}
                                                                            flightSearchCredentials={flightSearchCredentials}
                                                                            setFlightSearchCredentials={setFlightSearchCredentials}
                                                                            setOriginDepartureInputVal={setThirdOriginDepartureInputVal}
                                                                            setDepLocationSuggestionsVisible={setThirdDepLocationSuggestionsVisible}
                                                                            setDepLocationSuggestionsIsHovered={setDepLocationSuggestionsIsHovered}
                                                                        />
                                                                    )
                                                                }

                                                                {/* Show results onChange of search field */}
                                                                {
                                                                    thirdLocationResultsVisible && thirdDepartureAirportsFilterResult.length !== 0 ?
                                                                        (
                                                                            <>
                                                                                {/* {console.log('Departure airports: ', secondDepartureAirportsFilterResult)} */}
                                                                                <div className='locationContainer__results'>
                                                                                    {
                                                                                        thirdDepartureAirportsFilterResult.map((eachFilterResult, key) => {
                                                                                            return (
                                                                                                <div className='eachLoactionResult' key={key}
                                                                                                    onClick={() => {
                                                                                                        // let airport = item;
                                                                                                        thirdOriginDepartureInput.current.value = `${eachFilterResult.name} (${eachFilterResult.iataCode})`;
                                                                                                        setThirdOriginDepartureInputVal(eachFilterResult.iataCode);

                                                                                                        // Update flight search credentials
                                                                                                        flightSearchCredentials.originLocationCityCode3 = eachFilterResult.iataCode;
                                                                                                        setFlightSearchCredentials(flightSearchCredentials);

                                                                                                        setThirdLocationResultsVisible(false);
                                                                                                    }}>
                                                                                                    <div className='eachLoactionResult__content'>
                                                                                                        <p>{eachFilterResult.city}, {eachFilterResult.country}</p>
                                                                                                        <span>{eachFilterResult.name}</span>
                                                                                                    </div>
                                                                                                    <div className='eachLoactionResult__tag'>
                                                                                                        {eachFilterResult.iataCode}
                                                                                                    </div>
                                                                                                </div>
                                                                                            );
                                                                                        })
                                                                                    }
                                                                                </div>
                                                                            </>
                                                                        ) : (<></>)
                                                                }
                                                            </div>
                                                            <div className='location__mLocationIcon'>
                                                                <AeroplaneIcon />
                                                            </div>
                                                            <div className='location__mLocationContainer'>
                                                                <input
                                                                    type='text'
                                                                    placeholder='To'
                                                                    className='destinationLocation'
                                                                    ref={thirdOriginArrivalInput}
                                                                    onChange={async (e) => {
                                                                        let value = e.currentTarget.value;
                                                                        // If the field has no value...
                                                                        if (!value || value.length < 3) {
                                                                            // Set empty search result
                                                                            setThirdArrivalAirportsFilterResult([]);
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
                                                                            setThirdArrivalAirportsFilterResult(
                                                                                filteredAirports
                                                                            );
                                                                        } else {
                                                                            // console.log("Airport Result:", filteredAirports);
                                                                            setThirdArrivalLocationResultsVisible(true);
                                                                            setThirdArrivalAirportsFilterResult(
                                                                                filteredAirports
                                                                            );
                                                                            setThirdArrivalLocationSuggestionsVisible(false);
                                                                        }
                                                                    }}
                                                                    onFocus={showThirdArrivalSuggestions}
                                                                    onBlur={hideThirdArrivalSuggestions}
                                                                />
                                                                {/* Show flight suggestions when input is clicked */}
                                                                {
                                                                    thirdArrivalLocationSuggestionsVisible && (
                                                                        <FlightArrivalSuggestion
                                                                            flightSearchCredentialKey='3'
                                                                            originArrivalInput={thirdOriginArrivalInput}
                                                                            flightSearchCredentials={flightSearchCredentials}
                                                                            setFlightSearchCredentials={setFlightSearchCredentials}
                                                                            setOriginArrivalInputVal={setThirdOriginArrivalInputVal}
                                                                            setArrivalLocationSuggestionsVisible={setThirdArrivalLocationSuggestionsVisible}
                                                                            setArrivalLocationSuggestionsIsHovered={setArrivalLocationSuggestionsIsHovered}
                                                                        />
                                                                    )
                                                                }
                                                                {/* Show results onChange of search field */}
                                                                {
                                                                    thirdArrivalLocationResultsVisible && thirdArrivalAirportsFilterResult.length !== 0 ?
                                                                        (
                                                                            <>
                                                                                {/* {console.log('Departure airports: ', arrivalAirportsFilterResult)} */}
                                                                                <div className='locationContainer__results'>
                                                                                    {
                                                                                        thirdArrivalAirportsFilterResult.map((eachFilterResult, key) => {
                                                                                            return (
                                                                                                <div className='eachLoactionResult' key={key}
                                                                                                    onClick={() => {
                                                                                                        // let airport = item;
                                                                                                        thirdOriginArrivalInput.current.value = `${eachFilterResult.name} (${eachFilterResult.iataCode})`;
                                                                                                        setThirdOriginArrivalInputVal(eachFilterResult.iataCode);

                                                                                                        // Update flight search credentials
                                                                                                        flightSearchCredentials.originDestinationCityCode3 = eachFilterResult.iataCode;
                                                                                                        setFlightSearchCredentials(flightSearchCredentials);

                                                                                                        setThirdArrivalLocationResultsVisible(false);
                                                                                                    }}>
                                                                                                    <div className='eachLoactionResult__content'>
                                                                                                        <p>{eachFilterResult.city}, {eachFilterResult.country}</p>
                                                                                                        <span>{eachFilterResult.name}</span>
                                                                                                    </div>
                                                                                                    <div className='eachLoactionResult__tag'>
                                                                                                        {eachFilterResult.iataCode}
                                                                                                    </div>
                                                                                                </div>
                                                                                            );
                                                                                        })
                                                                                    }
                                                                                </div>
                                                                            </>
                                                                        ) : (<></>)
                                                                }
                                                            </div>
                                                        </div>

                                                        {/* Date */}
                                                        <div className='date'>

                                                            {/* Departure date */}
                                                            <DatePicker
                                                                className='mDepartureDate'
                                                                dateFormat="MMM, dd yyyy"
                                                                closeOnScroll={false}
                                                                selected={thirdDepartureDate}
                                                                onChange={(date) => {

                                                                    // Set the formatted date
                                                                    let formattedDate = moment(date).format('yyyy-MM-DD');

                                                                    // Set the raw date object
                                                                    setThirdDepartureDate(date);

                                                                    // Set the formatted date in state
                                                                    setThirdOriginDepartureDateInputVal(formattedDate);

                                                                    // Set corresponding date in flight search credentials
                                                                    flightSearchCredentials.departureDate3 = formattedDate;

                                                                    // Update the corresponding multi city field
                                                                    setFlightSearchCredentials(flightSearchCredentials);
                                                                }}
                                                                calendarContainer={MyContainer}
                                                                minDate={new Date()}
                                                                ref={thirdOriginDepartureDateInput}
                                                            />
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Fourth Search Row */}
                                                {searchRows[2].active && (
                                                    <div className='mSearchPanelContainer__mSetEntryData'>
                                                        {/* Location */}
                                                        <div className='location'>
                                                            <div className='location__mLocationContainer'>
                                                                <input
                                                                    type='text'
                                                                    placeholder='From'
                                                                    className='mDepartureLocation'
                                                                    ref={fourthOriginDepartureInput}
                                                                    onChange={async (e) => {
                                                                        let value = e.currentTarget.value;
                                                                        // If the field has no value...
                                                                        if (!value || value.length < 3) {
                                                                            // Set empty search result
                                                                            setFourthDepartureAirportsFilterResult([]);
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
                                                                            setFourthDepartureAirportsFilterResult(
                                                                                filteredAirports
                                                                            );
                                                                        } else {
                                                                            // console.log("Airport Result:", filteredAirports);
                                                                            setFourthLocationResultsVisible(true);
                                                                            setFourthDepartureAirportsFilterResult(
                                                                                filteredAirports
                                                                            );
                                                                            setFourthDepLocationSuggestionsVisible(false);
                                                                        }
                                                                    }}
                                                                    onFocus={showFourthDepLocationSuggestions}
                                                                    onBlur={hideFourthDepLocationSuggestions}
                                                                />
                                                                {/* Show flight suggestions when input is clicked */}
                                                                {
                                                                    fourthDepLocationSuggestionsVisible && (
                                                                        <FlightDepartureSuggestion
                                                                            flightSearchCredentialKey='4'
                                                                            originDepartureInput={fourthOriginDepartureInput}
                                                                            flightSearchCredentials={flightSearchCredentials}
                                                                            setFlightSearchCredentials={setFlightSearchCredentials}
                                                                            setOriginDepartureInputVal={setFourthOriginDepartureInputVal}
                                                                            setDepLocationSuggestionsVisible={setFourthDepLocationSuggestionsVisible}
                                                                            setDepLocationSuggestionsIsHovered={setDepLocationSuggestionsIsHovered}
                                                                        />
                                                                    )
                                                                }

                                                                {/* Show results onChange of search field */}
                                                                {
                                                                    fourthLocationResultsVisible && fourthDepartureAirportsFilterResult.length !== 0 ?
                                                                        (
                                                                            <>
                                                                                {/* {console.log('Departure airports: ', secondDepartureAirportsFilterResult)} */}
                                                                                <div className='locationContainer__results'>
                                                                                    {
                                                                                        fourthDepartureAirportsFilterResult.map((eachFilterResult, key) => {
                                                                                            return (
                                                                                                <div className='eachLoactionResult' key={key}
                                                                                                    onClick={() => {
                                                                                                        // let airport = item;
                                                                                                        fourthOriginDepartureInput.current.value = `${eachFilterResult.name} (${eachFilterResult.iataCode})`;
                                                                                                        setFourthOriginDepartureInputVal(eachFilterResult.iataCode);

                                                                                                        // Update flight search credentials
                                                                                                        flightSearchCredentials.originLocationCityCode4 = eachFilterResult.iataCode;
                                                                                                        setFlightSearchCredentials(flightSearchCredentials);

                                                                                                        setFourthLocationResultsVisible(false);
                                                                                                    }}>
                                                                                                    <div className='eachLoactionResult__content'>
                                                                                                        <p>{eachFilterResult.city}, {eachFilterResult.country}</p>
                                                                                                        <span>{eachFilterResult.name}</span>
                                                                                                    </div>
                                                                                                    <div className='eachLoactionResult__tag'>
                                                                                                        {eachFilterResult.iataCode}
                                                                                                    </div>
                                                                                                </div>
                                                                                            );
                                                                                        })
                                                                                    }
                                                                                </div>
                                                                            </>
                                                                        ) : (<></>)
                                                                }
                                                            </div>

                                                            <div className='location__mLocationIcon'>
                                                                <AeroplaneIcon />
                                                            </div>

                                                            <div className='location__mLocationContainer'>
                                                                <input
                                                                    type='text'
                                                                    placeholder='To'
                                                                    className='destinationLocation'
                                                                    ref={fourthOriginArrivalInput}
                                                                    onChange={async (e) => {
                                                                        let value = e.currentTarget.value;
                                                                        // If the field has no value...
                                                                        if (!value || value.length < 3) {
                                                                            // Set empty search result
                                                                            setFourthArrivalAirportsFilterResult([]);
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
                                                                            setFourthArrivalAirportsFilterResult(
                                                                                filteredAirports
                                                                            );
                                                                        } else {
                                                                            // console.log("Airport Result:", filteredAirports);
                                                                            setFourthArrivalLocationResultsVisible(true);
                                                                            setFourthArrivalAirportsFilterResult(
                                                                                filteredAirports
                                                                            );
                                                                            setFourthArrivalLocationSuggestionsVisible(false);
                                                                        }
                                                                    }}
                                                                    onFocus={showFourthArrivalSuggestions}
                                                                    onBlur={hideFourthArrivalSuggestions}
                                                                />
                                                                {/* Show flight suggestions when input is clicked */}
                                                                {
                                                                    fourthArrivalLocationSuggestionsVisible && (
                                                                        <FlightArrivalSuggestion
                                                                            flightSearchCredentialKey='4'
                                                                            originArrivalInput={fourthOriginArrivalInput}
                                                                            flightSearchCredentials={flightSearchCredentials}
                                                                            setFlightSearchCredentials={setFlightSearchCredentials}
                                                                            setOriginArrivalInputVal={setFourthOriginArrivalInputVal}
                                                                            setArrivalLocationSuggestionsVisible={setFourthArrivalLocationSuggestionsVisible}
                                                                            setArrivalLocationSuggestionsIsHovered={setArrivalLocationSuggestionsIsHovered}
                                                                        />
                                                                    )
                                                                }
                                                                {/* Show results onChange of search field */}
                                                                {
                                                                    fourthArrivalLocationResultsVisible && fourthArrivalAirportsFilterResult.length !== 0 ?
                                                                        (
                                                                            <>
                                                                                {/* {console.log('Departure airports: ', arrivalAirportsFilterResult)} */}
                                                                                <div className='locationContainer__results'>
                                                                                    {
                                                                                        fourthArrivalAirportsFilterResult.map((eachFilterResult, key) => {
                                                                                            return (
                                                                                                <div className='eachLoactionResult' key={key}
                                                                                                    onClick={() => {
                                                                                                        // let airport = item;
                                                                                                        fourthOriginArrivalInput.current.value = `${eachFilterResult.name} (${eachFilterResult.iataCode})`;
                                                                                                        setFourthOriginArrivalInputVal(eachFilterResult.iataCode);

                                                                                                        // Update flight search credentials
                                                                                                        flightSearchCredentials.originDestinationCityCode4 = eachFilterResult.iataCode;
                                                                                                        setFlightSearchCredentials(flightSearchCredentials);

                                                                                                        setFourthArrivalLocationResultsVisible(false);
                                                                                                    }}>
                                                                                                    <div className='eachLoactionResult__content'>
                                                                                                        <p>{eachFilterResult.city}, {eachFilterResult.country}</p>
                                                                                                        <span>{eachFilterResult.name}</span>
                                                                                                    </div>
                                                                                                    <div className='eachLoactionResult__tag'>
                                                                                                        {eachFilterResult.iataCode}
                                                                                                    </div>
                                                                                                </div>
                                                                                            );
                                                                                        })
                                                                                    }
                                                                                </div>
                                                                            </>
                                                                        ) : (<></>)
                                                                }
                                                            </div>
                                                        </div>

                                                        {/* Date */}
                                                        <div className='date'>

                                                            {/* Departure date */}
                                                            <DatePicker
                                                                className='mDepartureDate'
                                                                dateFormat="MMM, dd yyyy"
                                                                closeOnScroll={false}
                                                                selected={fourthDepartureDate}
                                                                onChange={(date) => {

                                                                    // Set the formatted date
                                                                    let formattedDate = moment(date).format('yyyy-MM-DD');

                                                                    // Set the raw date object
                                                                    setFourthDepartureDate(date);

                                                                    // Set the formatted date in state
                                                                    setFourthOriginDepartureDateInputVal(formattedDate);

                                                                    // Set corresponding date in flight search credentials
                                                                    flightSearchCredentials.departureDate4 = formattedDate;

                                                                    // Update the corresponding multi city field
                                                                    setFlightSearchCredentials(flightSearchCredentials);
                                                                }}
                                                                calendarContainer={MyContainer}
                                                                minDate={new Date()}
                                                                ref={fourthOriginDepartureDateInput}
                                                            />
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Fifth Search Row */}
                                                {searchRows[3].active && (
                                                    <div className='mSearchPanelContainer__mSetEntryData'>
                                                        {/* Location */}
                                                        <div className='location'>
                                                            <div className='location__mLocationContainer'>
                                                                <input
                                                                    type='text'
                                                                    placeholder='From'
                                                                    className='mDepartureLocation'
                                                                    ref={fifthOriginDepartureInput}
                                                                    onChange={async (e) => {
                                                                        let value = e.currentTarget.value;
                                                                        // If the field has no value...
                                                                        if (!value || value.length < 3) {
                                                                            // Set empty search result
                                                                            setFifthDepartureAirportsFilterResult([]);
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
                                                                            setFifthDepartureAirportsFilterResult(
                                                                                filteredAirports
                                                                            );
                                                                        } else {
                                                                            // console.log("Airport Result:", filteredAirports);
                                                                            setFifthLocationResultsVisible(true);
                                                                            setFifthDepartureAirportsFilterResult(
                                                                                filteredAirports
                                                                            );
                                                                            setFifthDepLocationSuggestionsVisible(false);
                                                                        }
                                                                    }}
                                                                    onFocus={showFifthDepLocationSuggestions}
                                                                    onBlur={hideFifthDepLocationSuggestions}
                                                                />
                                                                {/* Show flight suggestions when input is clicked */}
                                                                {
                                                                    fifthDepLocationSuggestionsVisible && (
                                                                        <FlightDepartureSuggestion
                                                                            flightSearchCredentialKey='5'
                                                                            originDepartureInput={fifthOriginDepartureInput}
                                                                            flightSearchCredentials={flightSearchCredentials}
                                                                            setFlightSearchCredentials={setFlightSearchCredentials}
                                                                            setOriginDepartureInputVal={setFifthOriginDepartureInputVal}
                                                                            setDepLocationSuggestionsVisible={setFifthDepLocationSuggestionsVisible}
                                                                            setDepLocationSuggestionsIsHovered={setDepLocationSuggestionsIsHovered}
                                                                        />
                                                                    )
                                                                }

                                                                {/* Show results onChange of search field */}
                                                                {
                                                                    fifthLocationResultsVisible && fifthDepartureAirportsFilterResult.length !== 0 ?
                                                                        (
                                                                            <>
                                                                                {/* {console.log('Departure airports: ', secondDepartureAirportsFilterResult)} */}
                                                                                <div className='locationContainer__results'>
                                                                                    {
                                                                                        fifthDepartureAirportsFilterResult.map((eachFilterResult, key) => {
                                                                                            return (
                                                                                                <div className='eachLoactionResult' key={key}
                                                                                                    onClick={() => {
                                                                                                        // let airport = item;
                                                                                                        fifthOriginDepartureInput.current.value = `${eachFilterResult.name} (${eachFilterResult.iataCode})`;
                                                                                                        setFifthOriginDepartureInputVal(eachFilterResult.iataCode);

                                                                                                        // Update flight search credentials
                                                                                                        flightSearchCredentials.originLocationCityCode5 = eachFilterResult.iataCode;
                                                                                                        setFlightSearchCredentials(flightSearchCredentials);

                                                                                                        setFifthLocationResultsVisible(false);
                                                                                                    }}>
                                                                                                    <div className='eachLoactionResult__content'>
                                                                                                        <p>{eachFilterResult.city}, {eachFilterResult.country}</p>
                                                                                                        <span>{eachFilterResult.name}</span>
                                                                                                    </div>
                                                                                                    <div className='eachLoactionResult__tag'>
                                                                                                        {eachFilterResult.iataCode}
                                                                                                    </div>
                                                                                                </div>
                                                                                            );
                                                                                        })
                                                                                    }
                                                                                </div>
                                                                            </>
                                                                        ) : (<></>)
                                                                }
                                                            </div>

                                                            <div className='location__mLocationIcon'>
                                                                <AeroplaneIcon />
                                                            </div>

                                                            <div className='location__mLocationContainer'>
                                                                <input
                                                                    type='text'
                                                                    placeholder='To'
                                                                    className='destinationLocation'
                                                                    ref={fifthOriginArrivalInput}
                                                                    onChange={async (e) => {
                                                                        let value = e.currentTarget.value;
                                                                        // If the field has no value...
                                                                        if (!value || value.length < 3) {
                                                                            // Set empty search result
                                                                            setFifthArrivalAirportsFilterResult([]);
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
                                                                            setFifthArrivalAirportsFilterResult(
                                                                                filteredAirports
                                                                            );
                                                                        } else {
                                                                            // console.log("Airport Result:", filteredAirports);
                                                                            setFifthArrivalLocationResultsVisible(true);
                                                                            setFifthArrivalAirportsFilterResult(
                                                                                filteredAirports
                                                                            );
                                                                            setFifthArrivalLocationSuggestionsVisible(false);
                                                                        }
                                                                    }}
                                                                    onFocus={showFifthArrivalSuggestions}
                                                                    onBlur={hideFifthArrivalSuggestions}
                                                                />

                                                                {/* Show flight suggestions when input is clicked */}
                                                                {
                                                                    fifthArrivalLocationSuggestionsVisible && (
                                                                        <FlightArrivalSuggestion
                                                                            flightSearchCredentialKey='5'
                                                                            originArrivalInput={fifthOriginArrivalInput}
                                                                            flightSearchCredentials={flightSearchCredentials}
                                                                            setFlightSearchCredentials={setFlightSearchCredentials}
                                                                            setOriginArrivalInputVal={setFifthOriginArrivalInputVal}
                                                                            setArrivalLocationSuggestionsVisible={setFifthArrivalLocationSuggestionsVisible}
                                                                            setArrivalLocationSuggestionsIsHovered={setArrivalLocationSuggestionsIsHovered}
                                                                        />
                                                                    )
                                                                }

                                                                {/* Show results onChange of search field */}
                                                                {
                                                                    fifthArrivalLocationResultsVisible && fifthArrivalAirportsFilterResult.length !== 0 ?
                                                                        (
                                                                            <>
                                                                                {/* {console.log('Departure airports: ', arrivalAirportsFilterResult)} */}
                                                                                <div className='locationContainer__results'>
                                                                                    {
                                                                                        fifthArrivalAirportsFilterResult.map((eachFilterResult, key) => {
                                                                                            return (
                                                                                                <div className='eachLoactionResult' key={key}
                                                                                                    onClick={() => {
                                                                                                        // let airport = item;
                                                                                                        fifthOriginArrivalInput.current.value = `${eachFilterResult.name} (${eachFilterResult.iataCode})`;
                                                                                                        setFifthOriginArrivalInputVal(eachFilterResult.iataCode);

                                                                                                        // Update flight search credentials
                                                                                                        flightSearchCredentials.originDestinationCityCode5 = eachFilterResult.iataCode;
                                                                                                        setFlightSearchCredentials(flightSearchCredentials);

                                                                                                        setFifthArrivalLocationResultsVisible(false);
                                                                                                    }}>
                                                                                                    <div className='eachLoactionResult__content'>
                                                                                                        <p>{eachFilterResult.city}, {eachFilterResult.country}</p>
                                                                                                        <span>{eachFilterResult.name}</span>
                                                                                                    </div>
                                                                                                    <div className='eachLoactionResult__tag'>
                                                                                                        {eachFilterResult.iataCode}
                                                                                                    </div>
                                                                                                </div>
                                                                                            );
                                                                                        })
                                                                                    }
                                                                                </div>
                                                                            </>
                                                                        ) : (<></>)
                                                                }
                                                            </div>
                                                        </div>

                                                        {/* Date */}
                                                        <div className='date'>

                                                            {/* Departure date */}
                                                            <DatePicker
                                                                className='mDepartureDate'
                                                                dateFormat="MMM, dd yyyy"
                                                                closeOnScroll={false}
                                                                selected={fifthDepartureDate}
                                                                onChange={(date) => {

                                                                    // Set the formatted date
                                                                    let formattedDate = moment(date).format('yyyy-MM-DD');

                                                                    // Set the raw date in state
                                                                    setFifthDepartureDate(date);

                                                                    // Set the formatted date in state
                                                                    setFifthOriginDepartureDateInputVal(formattedDate);

                                                                    // Set corresponding date in flight search credentials
                                                                    flightSearchCredentials.departureDate5 = formattedDate;

                                                                    // Update the corresponding multi city field
                                                                    setFlightSearchCredentials(flightSearchCredentials);
                                                                }}
                                                                calendarContainer={MyContainer}
                                                                minDate={new Date()}
                                                                ref={fifthOriginDepartureDateInput}
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </>
                                        )
                                    }

                                    <div className='mSearchPanelContainer__mSpOptionsContainer spOptionsContainer'>
                                        {
                                            routeModel === RouteModel.MultiCity &&
                                            (
                                                <div className='left'>
                                                    {/* Show button below only when Multicity is selected from flight categories dropdown */}
                                                    {
                                                        routeModel == RouteModel.MultiCity && (
                                                            <div onClick={displaySearchRow}> <AiOutlinePlus /><p>Add Flight</p> </div>
                                                        )
                                                    }
                                                    {/* Show button below only when Multicity is selected from flight categories dropdown,
                                                        and a minimum of 2 search forms is visible */}
                                                    {
                                                        routeModel == RouteModel.MultiCity && searchRows[0].active && (
                                                            <div onClick={removeSearchRow}> <AiOutlineMinus /><p>Remove Flight</p> </div>
                                                        )
                                                    }
                                                </div>
                                            )
                                        }
                                        <div className='right'>
                                            <div className='spOptionsContainerOption'>
                                                <input type='checkbox' name='flight' value='Direct flight' onChange={(e) => setDirectFlightOnly(e.currentTarget.checked)} />
                                                <div className='spOptionsContainerOption__checker'>
                                                    <BsCheck />
                                                </div>
                                                <p>Direct Flight Only</p>
                                            </div>
                                            {
                                                routeModel === RouteModel.RoundTrip && (
                                                    <div className='spOptionsContainerOption'>
                                                        <input type='checkbox' name='days' value='' onChange={(e) => setDateWindow(e.currentTarget.checked)} />
                                                        <div className='spOptionsContainerOption__checker'>
                                                            <BsCheck />
                                                        </div>
                                                        <p>+/-3 Days</p>
                                                    </div>
                                                )
                                            }
                                        </div>
                                    </div>
                                    <button className='btn'>Search</button>
                                </form>
                            </div>


                            <FlightSearchProcessing
                                flightSearchProcessingModalVisibility={flightSearchProcessingModalVisibility}
                                originLocation={originDepartureInputVal}
                                originDestination={originArrivalInputVal}
                                departureDate={selectedDepartureDateVal}
                                arrivalDate={selectedArrivalDateVal}
                                flightClass={classValue}
                                totalPassengers={passengers}
                            />
                        </div>
                        {/* </div> */}
                    </>
                )
            }
        </>
    )
}

export default SearchPanel;

export function pluralizeAndStringify(value, word, suffix = "s") {
    if (value == 1) {
        return value + " " + "Passenger";
    } else {
        return value + " " + "Passenger" + suffix;
    }
}