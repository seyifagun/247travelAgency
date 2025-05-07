import React, { useState, useEffect } from "react";
import styles from "../styles/Home.module.css";
import Image from "next/image";
import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";
import {
	Menu,
	Dropdown,
	message,
	Tabs,
	Tooltip,
	Modal,
	Spin,
	List,
	Card,
	Row,
	Col,
	Drawer,
	Space,
	Button as ButtonAnt,
	Slider as SliderAnt,
} from "antd";
import Slider from "react-slick";
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import AirlineList from "../components/airline-price-list.js";
import AirlineTracker from "../components/airline-tracker.js";
import FlightNavBar from "../components/flightnav-bar.js";
import styled from "styled-components";
import { StopsDiv } from "../components/PlusMinusButton/BtnElements";
import { DownOutlined } from "@ant-design/icons";
import { BsFillCaretDownFill, BsFillCaretUpFill } from 'react-icons/bs'
import BookedFlightTable from "../components/bookedFlightTable.js";
import cheapestFlight from "../public/icons/cheapest-flight.webp";
import resetIcon from "../public/icons/refresh.webp";
import flightTo from "../public/icons/take-off.png";
// import baggageImg from "../public/icons/baggage.png";
import flightRules from "../public/icons/Flight-rules.png";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedFlightOffer } from "../redux/actions/flightActions";
import FlightDetails from "../components/FlightDetails";
import FilterComponents from "../components/FilterComponent";
import Calender from "../components/Calender";
import { useConfirmPrice, useSavedSearch, useFetchFlightResults } from "./api/apiClient";
import FlightItem from "../components/FlightItem";
import FlightMatchNav from "../components/FlightMatchNav";
// import { FlightMatchButtomNav } from "../components/FlightMatchButtomNav";
import FlightMatchButtomNav from "../components/FlightMatchButtomNav";
import FlightDetailsMobile from "../components/FlightDetailsMobile";
import { NotificationToastCard } from "../components/toast-cards/ToastCard";
import FlightSearchProcessing from "../components/FlightSearchProcessing";
import moment from "moment";

const { TabPane } = Tabs;

const FlightResults = ({ airports }) => {
	const onClick = ({ key }) => {
		if (key == "1") {
			// call cheapest function for all flights
			filterCheapest();
		}

		if (key == "2") {
			// call fastest function for all flights
			filterFastest();
		}
	};

	const router = useRouter();

	const dispatch = useDispatch();

	const confirmPrice = useConfirmPrice();

	const savedSearch = useSavedSearch();

	const [priceVerificationModal, setPriceVerificationModal] = useState(false);

	const menu = (
		<Menu onClick={onClick}>
			<Menu.Item key="1">Cheapest</Menu.Item>
			<Menu.Divider />
			<Menu.Item key="2">Fastest</Menu.Item>
			{/* <Menu.Divider />
      <Menu.Item key="2">Fastest</Menu.Item>
      <Menu.Divider />
      <Menu.Item key="3">Latest Departure</Menu.Item>
      <Menu.Divider />
      <Menu.Item key="4">Earliest Departure</Menu.Item> */}
		</Menu>
	);

	const filterSort = {
		cheapest: 0,
		fastest: 1
	}
	const [sortSelection, setSortSelection] = useState(filterSort.cheapest);

	const mark = {
		0: { label: <strong className="arithmeticsign">-</strong> },
		100: { label: <strong className="arithmeticsign">+</strong> },
	};

	const state = { disabled: false };

	let flightResults = useSelector((state) => state.store.flightResults);

	let fetchAirlines = useSelector((state) => state.store.airlines);

	let airlineName = Object.values(flightResults.dictionaries.carriers);

	//#region Flight Search Processing Modal States

	// Selected cell properties
	const [selectedCellProperties, setSelectedCellProperties] = useState({
		arrivalDate: null,
		departureDate: null
	});

	// Flag to control modal state
	const [flightSearchProcessingModalVisibility, setFlightSearchProcessingModalVisibility] = useState(false);

	//#endregion

	/**
	 * Selected flight meta
	 */
	const selectedFlightMeta = useSelector(
		(state) => state.store.flightRequestMeta
	);

	/**
	 * Set the flight request data
	 */
	const _flightRequest = JSON.parse(selectedFlightMeta.flightRequest);

	const carriers = flightResults.dictionaries.carriers;

	const [iataAirlines] = useState([]);

	const findAirlineName = (array, iataCode) => {
		const airlineName = array.find((value) => value.iataCode === iataCode);
		return airlineName.name;
	};

	// let iataAirlines = [];
	for (let i = 0; i < flightResults.offerInfos.length; i++) {
		let offerInfo = flightResults.offerInfos[i];
		let carrier = offerInfo?.itineraries[0]?.segments[0]?.carrier;
		// console.log(carrier);
		if (iataAirlines.indexOf(carrier.iataCode) === -1) {
			iataAirlines.push(carrier.iataCode);
		}
	}

	let airlineNameAndCode = [];
	airlineNameAndCode.push(flightResults.dictionaries.carriers);
	// console.log(airlineNameAndCode);

	// Function to return minimum price for each airline per segment
	const returnMinforEachAirlineWithoutSegment = (response, airline) => {
		if (response && response.offerInfos.length > 0) {
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
					flightPrices.push(response.offerInfos[i].priceBreakdown?.total);
					// console.log(response.offerInfos[i].priceBreakdown.total);
					// if (response.offerInfos[i].priceBreakdown.total < flightPrices[i]) {
					//   console.log("Flight Price from array: " + flight[i]);
					//   minforEachAirline = response.offerInfos[i].priceBreakdown.total;+

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
					response?.offerInfos[i]?.itineraries[0]?.segments.length == segmentLen
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

	let formattedZeroStopPriceForAllAirlines;
	const zeroStopPriceForAllAirlines = returnMinforAllAirlines(flightResults, 1);
	if (zeroStopPriceForAllAirlines) {
		formattedZeroStopPriceForAllAirlines = parseFloat(
			zeroStopPriceForAllAirlines
		).toLocaleString("en-NG", {
			style: "currency",
			currency: "NGN",
		});
	}

	let formattedOneStopPriceForAllAirlines;
	const oneStopPriceForAllAirlines = returnMinforAllAirlines(flightResults, 2);
	if (oneStopPriceForAllAirlines) {
		formattedOneStopPriceForAllAirlines = parseFloat(
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

	let formattedOnePlusStopPriceForAllAirlines;
	if (onePlusStopPriceForAllAirlines) {
		formattedOnePlusStopPriceForAllAirlines = parseFloat(
			onePlusStopPriceForAllAirlines
		).toLocaleString("en-NG", {
			style: "currency",
			currency: "NGN",
		});
	}

	/**
	 * Fetch flight results api hook
	 */
	const fetchFlightResults = useFetchFlightResults();

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

	const filterAirlineCheapest = (iataCode) => {
		//filter by airline the sort the result by price
		let filteredFlightResults = filterByAirline(iataCode);

		// sort by durationInMinutes
		const sortedFilteredFlightResults = filteredFlightResults.sort(function (a, b) {
			return a.durationInMinutes - b.durationInMinutes;
		});

		// update state
		setFlightResultsLoadMore(sortedFilteredFlightResults.slice(0, 15));
	}

	const filterFastest = () => {
		// sort by durationInMinutes
		const sortedFilteredFlightResults = flightResults.offerInfos.sort(function (a, b) {
			return a.durationInMinutes - b.durationInMinutes;
		});

		// update state
		setFlightResultsLoadMore(sortedFilteredFlightResults.slice(0, 15));
	}

	const filterCheapest = () => {
		// sort by price
		const sortedByCheapestFlightResults = flightResults.offerInfos.sort(function (a, b) {
			return a.priceBreakdown.total - b.priceBreakdown.total;
		});

		// update state
		setFlightResultsLoadMore(sortedByCheapestFlightResults.slice(0, 15));
	}

	function filterByAirline(iataCode) {
		const filteredFlightResults = flightResults.offerInfos.filter((offerInfo) => {
			return offerInfo?.itineraries[0]?.segments[0]?.carrier?.iataCode?.includes(iataCode);
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

	async function priceConfirmation(selectedOffer) {

		// make request to the function which further makes request to the endpoint in API Client
		// load modal and/or spinner
		setPriceVerificationModal(true);
		// console.log(priceVerificationModal);
		// return;
		// console.log("working");
		await confirmPrice(selectedOffer)
			.then((response) => {
				// setPriceVerificationModal(true)
				// 1. processing modal
				console.log("Caught Resp:", response);
				// 2. Route to the book page
				router.push("/bookPage");

				// 3. Show a message showing that the price has changed.
				// displayError(
				//   "Error",
				//   response
				// );

				// setSpinner("Send");
				// setFlightSearchProcessingModalVisibility(false);
			})
			.catch((error) => {
				// setSpinner("Send");
				// setFlightSearchProcessingModalVisibility(false);
				console.log("Caught Error 2:", error);
				// TODO: Pop up a dialog
				// setFlightSearchErrorModalVisibility(true);
			});
	}
	// CREATE TOGGLE TO SHOW AND HIDE FLIGHT DETAILS
	function customToggle() {
		var x = document.getElementById("detailsDIV");
		if (x.style.display === "none") {
			x.style.display = "block";
		} else {
			x.style.display = "none";
		}
	}

	function baggageToggle() {
		var y = document.getElementById("baggageDIV");
		if (y.style.display === "none") {
			y.style.display = "block";
		} else {
			y.style.display = "none";
		}
	}

	function rulesToggle() {
		var z = document.getElementById("rulesDIV");
		if (z.style.display === "none") {
			z.style.display = "block";
		} else {
			z.style.display = "none";
		}
	}

	const [divContainer, setDivContainer] = useState(false);

	var HandleChange = () => {
		setDivContainer(true);
	};

	// Function & hooks for updating state of custom tabs
	const [showTab1, setShowTab1] = useState({ opened: "false" });

	const { opened } = showTab1;

	const onToggle1 = (index) => {
		setShowTab1({ opened: { ...opened, [index]: !opened[index] } });
		setToggleState(1);
	};

	const [showTab3, setShowTab3] = useState({ openedFlightRules: "false" });

	const { openedFlightRules } = showTab3;

	const onToggle3 = (index) => {
		setShowTab3({
			openedFlightRules: {
				...openedFlightRules,
				[index]: !openedFlightRules[index],
			},
		});
		setToggleState(3);
	};

	const [toggleState, setToggleState] = useState(1);

	const toggleTab = (index) => {
		setToggleState(index);
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

	useEffect(() => {
		// Get the current url
		let urlString = window.location.href;

		// Get parameter and query strings
		let paramString = urlString.split("?")[1];
		let queryString = new URLSearchParams(paramString);

		// Check if the query parameter is present
		let checkQueryParam = queryString.has("flightRequestId");

		// Get the flightRequestId parameter from the query string
		if (checkQueryParam) {
			let flightRequestId = queryString.get("flightRequestId");
			// Invoke the payment verification request
			async function savedSearchAsync() {
				await savedSearch({ flightRequestId: flightRequestId })
					.then((result) => {
						if (result.data.successful) {
							router.reload();
							console.log("Flight Result:", result);
						}
					})
					.catch((error) => {
						console.error("Flight Error:", error);
					});
			}
			// savedSearchAsync();
		}
	}, [router, savedSearch]);

	const [detailsVisibility, setDetailsVisibility] = useState(false);
	function toggleDetails() {
		setDetailsVisibility(!detailsVisibility);
	}

	// Initialize and set the media query for mobile
	const [onMobile, setOnMobile] = useState(window.matchMedia("(max-width: 768px)").matches);
	useEffect(() => {
		// Set the media query for mobile
		window.matchMedia("(max-width: 768px)").addEventListener("change", (e) => {
			setOnMobile(e.matches);
		});
	}, [onMobile]);

	const [resultPanelVisible, setResultPanelVisible] = useState(false);
	const [itineraryShareable, setItineraryShareable] = useState(false);

	function openResultPanel(flightOffer) {
		let serializedFlightOffer = JSON.stringify(flightOffer);
		window.localStorage.setItem("flightOffer", serializedFlightOffer);
		setResultPanelVisible(true);
	}

	function changeOption() {
		setItineraryShareable(!itineraryShareable);
	}
	function closeResultPanel() {
		setResultPanelVisible(false);
		setItineraryShareable(false);
	}


	// State that handles toast card visibility
	const [notificationCardVisible, setNotificationCardVisible] = useState(false);
	// Function that handles toast card
	function notifyShareItineraryFeedback() {
		setNotificationCardVisible(true);

		setTimeout(() => {
			setNotificationCardVisible(false);
		}, 3000);
	}

	function hideErrorModal() {
		setFlightSearchErrorModalVisibility(false);
	}

	// Flight search error
	const [flightSearchErrorModalMessage, setflightSearchErrorModalMessage] = useState("");

	// Flight search error
	const [flightSearchErrorModalVisibility, setFlightSearchErrorModalVisibility] = useState(false);

	/**
	 * Invoke a fresh flight search request based on selected cell
	 * @param {*} selectedCell The selected cell
	 */
	async function fetchResultsBasedOnSelectedCell(selectedCell) {

		// Set cell properties
		setSelectedCellProperties({
			arrivalDate: selectedCell.info.arrivalDate,
			departureDate: selectedCell.info.departureDate
		});

		// Display the dialog
		setFlightSearchProcessingModalVisibility(true);

		// Call fetch flight results
		await fetchFlightResults({
			originLocationCityCode: _flightRequest.originLocationCityCode,
			originDestinationCityCode: _flightRequest.originDestinationCityCode,
			departureDate: selectedCell.info.departureDate,
			returningDate: selectedCell.info.arrivalDate,
			flightClass: _flightRequest.flightClass,
			numberOfAdults: _flightRequest.numberOfAdults,
			numberOfChildren: _flightRequest.numberOfChildren,
			numberOfInfants: _flightRequest.numberOfInfants,
			dateWindow: false
		})
			.then((result) => {

				router.push(
					"/flight-match?flightRequestId=" + result.data.response.requestId
				)
					.then((result) => {
						// Reload the current uri
						window.location.reload();
					});
			})
			.catch((error) => {
				setFlightSearchProcessingModalVisibility(false);
				console.log("Caught Error 2:", error);
				// TODO: Pop up a dialog
				setflightSearchErrorModalMessage(error);
				setFlightSearchErrorModalVisibility(true);
			});
	}

	// States to hide calender 
	const [calenderVisibility, setCalenderVisibility] = useState(false);

	// *********************************
	return (
		<>
			<Head>
				<title>247Travels | Flight Results</title>
			</Head>

			<div className={styles.containercustom}>
				<div className="container">
					<FlightNavBar
						getCabinClass={() => getCabinClass(cabin)}
						flightResultsSummary={flightResultsLoadMore}
						airports={airports}
					/>

					<div className="row">
						{/* {!onMobile && (
              <div className="drawercustom-mobile">
                <DrawerCustom />
              </div>
            )} */}
						{onMobile && <FlightMatchButtomNav 
						filterFastest={filterFastest} 
						filterCheapest={filterCheapest}
						sortSelection={sortSelection}
						setSortSelection={setSortSelection} />}
						<div className="col-xl-3 col-lg-4 col-12 action-panel-container drawercustom-desktop">
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
									{formattedZeroStopPriceForAllAirlines == null ? (
										<></>
									) : (
										<div className="col-sm-12 col-md-4 col-12">
											<div className="mt-5 stopsDiv">
												<Button
													onClick={() => filterPriceOnClickStops(1)}
													className={styles.stopsDiv}
												>
													0
												</Button>{" "}
												{/* <StopsDiv /> */}
												<small style={{ marginLeft: "1rem" }}>
													{formattedZeroStopPriceForAllAirlines}
												</small>
											</div>
										</div>
									)}
									{formattedOneStopPriceForAllAirlines == null ? (
										<></>
									) : (
										<div className="col-sm-12 col-md-4 col-12">
											<div className="mt-5 stopsDiv">
												<Button
													onClick={() => filterPriceOnClickStops(2)}
													className={styles.stopsDiv}
												>
													1
												</Button>{" "}
												{/* <StopsDiv /> */}
												<small style={{ marginLeft: "1rem" }}>
													{formattedOneStopPriceForAllAirlines}
												</small>
											</div>
										</div>
									)}
									{formattedOnePlusStopPriceForAllAirlines == null ? (
										<></>
									) : (
										<div className="col-sm-12 col-md-4 col-12">
											<div className="mt-5 stopsDiv">
												<Button
													onClick={() => filterPriceOnClickStops(3)}
													className={styles.stopsDiv}
												>
													2
												</Button>{" "}
												{/* <StopsDiv /> */}
												<small style={{ marginLeft: "1rem" }}>
													{formattedOnePlusStopPriceForAllAirlines}
												</small>
											</div>
										</div>
									)}
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

									{iataAirlines.map((iataAirline) => {
										const airlinePrice = returnMinforEachAirlineWithoutSegment(
											flightResults,
											iataAirline
										);
										const formattedAirlineName = findAirlineName(
											fetchAirlines,
											iataAirline
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
												key={iataAirline}
												airline={formattedAirlineName}
												price={formattedairlinePrice}
											/>
										);
									})}
								</div>
							</div>

							{/* Take Off flight and  Return Flight Section*/}
						</div>
						<div className="col-xl-9 col-lg-8 col-12">
							<div className="action-panel-extended">
								<div className="row">
									<div className="col-sm-12 col-md-12 ">
										<div className="sortBy-div">
											{!onMobile && (
												<div className={styles.sortAreaCta}>
													<div className={styles.sortAreaCta__sortSection}>
														<span className={styles.sortSpan}>Sort By:</span>
														<div className={styles.sortOptions}>
															<span
																className={`${styles.sortOptions__option} ${sortSelection == filterSort.cheapest ? styles.active : ''}`}
																onClick={() => {
																	filterCheapest();
																	setSortSelection(filterSort.cheapest);
																}}>Cheapest</span>
															<span
																className={`${styles.sortOptions__option} ${sortSelection == filterSort.fastest ? styles.active : ''}`}
																onClick={() => {
																	filterFastest();
																	setSortSelection(filterSort.fastest);
																}}>Fastest</span>
														</div>
													</div>
													{/* <div className={styles.sort_div_custom}>
														<Dropdown
															classame={styles.anticonCustom}
															overlay={menu}
														>
															<a
																className="ant-dropdown-link sort-div-custom"
																onClick={(e) => e.preventDefault()}
															>
																Sort By: Cheapest <BsFillCaretDownFill />
															</a>
														</Dropdown>
													</div> */}
													{
														_flightRequest.dateWindow && (
															<div className={styles.hideCalendarDesktop} onClick={() => setCalenderVisibility(!calenderVisibility)}>
																{calenderVisibility ? 'Hide Calender' : 'Show Calender'}
																{calenderVisibility ? <BsFillCaretUpFill /> : <BsFillCaretDownFill />}
															</div>
														)
													}
												</div>
											)}
										</div>
									</div>
									{/* <div className="col-sm-12 col-md-4 ">
                    <div className="cheapest-flight">
                      <div className="cheap-flight-wrapper">
                        <div>
                          <Image
                            src={cheapestFlight}
                            alt={"cheapest-flight-icon"}
                          />
                        </div>
                        <div className={styles.cheapflightStyle}>
                          <p className="cheapflightName">Cheapest Flight</p>
                          <small>From N 1,234,000</small>
                        </div>
                      </div>
                    </div>
                  </div> */}

									{/* Show calendar */}
									{/* <div className="col-sm-12 col-md-4 ">
                    <div className="calender-visibility">
                      <div className={styles.sort_div_custom}>
                        <Dropdown
                          classame={styles.anticonCustom}
                          overlay={menu}
                        >
                          <a
                            className="ant-dropdown-link sort-div-custom"
                            onClick={(e) => e.preventDefault()}
                          >
                            Show Calender <DownOutlined />
                          </a>
                        </Dropdown>
                      </div>
                    </div>
                  </div> */}
									{
										!onMobile && (
											<>
												{_flightRequest.dateWindow && <Calender fareCalender={flightResults.fareCalender} fetchResults={fetchResultsBasedOnSelectedCell} setCalenderVisibility={setCalenderVisibility} calenderVisibility={calenderVisibility} />}
											</>
										)
									}
									{
										onMobile && (
											<>
												{_flightRequest.dateWindow && <Calender fareCalender={flightResults.fareCalender} fetchResults={fetchResultsBasedOnSelectedCell} />}
											</>
										)
									}
								</div>
							</div>
							<div className="flight-description">
								<div className="position-relative" style={{ marginTop: "1.5rem", marginBottom: "1.5rem" }}>
									<BookedFlightTable
										filterPriceOnClickAirline={(iata) =>
											filterAirlineCheapest(iata)
										}
										filterPriceOnClickAllAirlines={() =>
											filterPriceOnClickAllAirlines()
										}
										filterPriceOnClickStops={(stops) =>
											filterPriceOnClickStops(stops)
										}
										filterPriceOnClickAirlineWithStops={(iataCode, stops) =>
											filterPriceOnClickAirlineWithStops(iataCode, stops)
										}
									/>
									{/* <Slider slidesToShow={1} slidesToScroll={1}>
                    {Array(1)
                      .fill("")
                      .map(() => (
                        <div>
                        </div>
                      ))}
                  </Slider>
                  <div
                    className="position-absolute d-inline-flex leftArrow-wrapper"
                  >
                    <ArrowLeftOutlined style={{ color: "#fff" }} />
                  </div>
                  <div className="position-absolute d-inline-flex RightArrow-wrapper">
                    <ArrowRightOutlined style={{ color: "#fff" }} />
                  </div> */}
								</div>
							</div>
							<div className="flight-description">
								<NotificationToastCard status='success'
									notificationCardVisible={notificationCardVisible}
									setNotificationCardVisible={setNotificationCardVisible}
									header={'Itinenary sent'}
									text={'You have successfully sent this itinarary'} />
								{flightResultsLoadMore.map((flightOffer, index) => {
									return (<FlightItem flightOffer={flightOffer}
										confirmPrice={priceConfirmation}
										openResultPanel={openResultPanel}
										enableFurtherAction={true} key={index}
										notifyShareItineraryFeedback={notifyShareItineraryFeedback}
										itineraryShareableState={itineraryShareable}
										changeOption={changeOption} />);
								})}
								<FlightDetailsMobile visible={resultPanelVisible}
									closeResultPanel={closeResultPanel}
									confirmPrice={priceConfirmation}
									enableFurtherAction={true}
									notifyShareItineraryFeedback={notifyShareItineraryFeedback}
									changeOption={changeOption}
									itineraryShareable={itineraryShareable}
								/>
							</div>
							<div className={styles.loadMoreButton}>
								{isLoading ? null : (
									<ButtonAnt className={styles.btnAnt} onClick={onLoadMore}>
										Load More
									</ButtonAnt>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
			<Modal
				// onCancel={() => setPriceVerificationModal(false)}
				centered
				open={priceVerificationModal}
				style={{ color: "#fff" }}
				width="auto"
				keyboard={false}
				footer={null}
				className="loadFlightModal"
				bodyStyle={{ backgroundColor: "#0043a4", padding: "3rem" }}
			>
				<p className="flightModalTitle">Verifying price</p>
				<div>
					<center>
						<Spin style={{ color: "rgba(252, 166, 43, 0.8)" }} />
					</center>
				</div>
			</Modal>

			<FlightSearchProcessing
				originLocation={_flightRequest.originLocationCityCode}
				originDestination={_flightRequest.originDestinationCityCode}
				flightClass={getCabinClass(_flightRequest.flightClass)}
				totalPassengers={_flightRequest.numberOfAdults + _flightRequest.numberOfChildren + _flightRequest.numberOfInfants}
				flightSearchProcessingModalVisibility={flightSearchProcessingModalVisibility}
				arrivalDate={moment(selectedCellProperties.arrivalDate).format('MMM D, yyyy')}
				departureDate={moment(selectedCellProperties.departureDate).format('MMM D, yyyy')}
			/>

			<Modal
				closable={true}
				onCancel={hideErrorModal}
				centered
				open={flightSearchErrorModalVisibility}
				style={{ color: "#fff" }}
				width="auto"
				keyboard={false}
				footer={null}
				className="loadFlightModal"
				bodyStyle={{ backgroundColor: "#0043a4", padding: "3rem" }}
			>
				<p className="flightModalTitle">{flightSearchErrorModalMessage}</p>
			</Modal>
		</>
	);
};

function ItineraryTemplate({
	itinerary,
	arrivalSegment,
	departureSegment,
	numberOfStops,
	marginBottom,
	cabin,
}) {
	const lastSegment = itinerary.segments.length - 1;
	let itineraryDepartureDates = new Date(
		itinerary.segments[0]?.segmentDeparture?.at
	);
	let itineraryArrivalDates = new Date(
		itinerary?.segments[lastSegment]?.segmentArrival?.at
	);
	return (
		<>
			<Row style={{ marginBottom: `${marginBottom}` }}>
				<Col
					className="itinerary-border"
					span={5}
					xs={{ span: 24 }}
					sm={{ span: 6 }}
					md={{ span: 5 }}
					lg={{ span: 5 }}
				>
					<div className="itinerary-header-title"> Airline </div>
					<div className="airline-logo-name">
						<Image
							src={`${process.env.NEXT_WAKANOW_PUBLIC_URL}/Images/flight-logos/${departureSegment?.carrier?.iataCode}.gif`}
							alt={departureSegment?.carrier?.iataCode}
						/>{" "}
						&nbsp;
						<span className="departure-flight-name">
							{`${departureSegment?.carrier?.name}`}
						</span>
					</div>
				</Col>

				<Col
					className="itinerary-border"
					span={5}
					xs={{ span: 8 }}
					sm={{ span: 6 }}
					md={{ span: 5 }}
					lg={{ span: 5 }}
				>
					<div className="itinerary-header-title"> Departure</div>
					<Tooltip
						placement="top"
						title={
							`${String(
								new Date(itinerary?.segments[0]?.segmentDeparture?.at)
							)} ` +
							`${itinerary?.segments[0]?.segmentDeparture?.airport?.city}, ` +
							`${itinerary?.segments[0]?.segmentDeparture?.airport?.name}`
						}
					>
						{/* {console.log(itinerary)} */}
						<p className={styles.arrivalTime}>
							{itineraryDepartureDates.getDate()}{" "}
							{itineraryDepartureDates.toLocaleString("default", {
								month: "short",
							})}{" "}
							{itineraryDepartureDates.getUTCFullYear()}{" "}
							{`${String(
								new Date(departureSegment?.segmentDeparture?.at).getHours()
							).padStart(2, "0")}:${String(
								new Date(departureSegment?.segmentDeparture?.at).getMinutes()
							).padStart(2, "0")}`}
						</p>
					</Tooltip>
					<p className={styles.locationCode}>
						{departureSegment?.segmentDeparture?.airport?.iataCode}
					</p>
				</Col>

				<Col
					className="itinerary-border"
					span={5}
					xs={{ span: 8 }}
					sm={{ span: 6 }}
					md={{ span: 5 }}
					lg={{ span: 5 }}
					style={{ textAlign: "center" }}
				>
					<div className="itinerary-header-title"> Duration </div>
					<div style={{ padding: "0 0.5rem" }}>
						{itinerary.duration}
						<div style={{ position: "relative" }}>
							<hr className="stops_hr" style={{ color: "orange" }} />
						</div>
						{numberOfStops > 1
							? `${numberOfStops} Stops`
							: `${numberOfStops} Stop`}
					</div>
				</Col>

				<Col
					className="itinerary-border"
					span={5}
					xs={{ span: 8 }}
					sm={{ span: 6 }}
					md={{ span: 5 }}
					lg={{ span: 5 }}
				>
					<div className="itinerary-header-title"> Arrival </div>
					<Tooltip
						placement="top"
						title={
							`${String(
								new Date(itinerary.segments[lastSegment]?.segmentArrival?.at)
							)} ` +
							`${itinerary?.segments[lastSegment]?.segmentArrival?.airport?.city}, ` +
							`${itinerary?.segments[lastSegment]?.segmentArrival?.airport?.name}`
						}
					>
						<p className={styles.arrivalTime}>
							{itineraryArrivalDates.getDate()}{" "}
							{itineraryArrivalDates.toLocaleString("default", {
								month: "short",
							})}{" "}
							{itineraryArrivalDates.getUTCFullYear()}{" "}
							{`${String(
								new Date(arrivalSegment?.segmentArrival?.at).getHours()
							).padStart(2, "0")}:${String(
								new Date(arrivalSegment?.segmentArrival?.at).getMinutes()
							).padStart(2, "0")}`}
						</p>
					</Tooltip>
					<p className={styles.locationCode}>
						{arrivalSegment?.segmentArrival?.airport?.iataCode}
					</p>
				</Col>
				{/* CABIN */}
				<Col
					style={{ textAlign: "center" }}
					className="flight-cabin-type itinerary-border"
					span={4}
					xs={{ span: 24 }}
					sm={{ span: 6 }}
					md={{ span: 4 }}
					lg={{ span: 4 }}
				>
					<div className="itinerary-header-title"> Cabin </div>
					<div className="mt-2">{cabin}</div>
				</Col>
			</Row>
		</>
	);
}

export default FlightResults;

export function DrawerCustom() {
	// Set the useRouter hook
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
	return (
		<>
			{/* <Space>
        <Button className="filter-Btn" type="primary" onClick={showDrawer}>
          Filter
        </Button>
      </Space>
      <Drawer
        title="Filter"
        placement={placement}
        width={500}
        onClose={onClose}
        open={visible}
      >
        <FilterComponents />
      </Drawer> */}
		</>
	);
}
