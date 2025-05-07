import React, { useEffect, useState, Suspense } from "react";
import { Form, Button, Input } from 'antd';
import { FaBeer, FaChevronDown } from 'react-icons/fa';
import { MdAccessTime } from 'react-icons/md';
import { GiAirplaneDeparture } from 'react-icons/gi';
import { BsFillHandbagFill, BsHandbag } from 'react-icons/bs';
import { RiFileInfoLine } from 'react-icons/ri';
import { ClockIcon } from './CustomSVGIcon'
import moment from "moment-timezone";
import Image from "next/dist/client/image";
import { useShareFlightResults } from '../pages/api/apiClient';
// import FareRules from "./FareRules";
const FareRules = React.lazy(() => import("./FareRules.js"));

const FlightItem = ({ flightOffer, confirmPrice, openResultPanel, enableFurtherAction, notifyShareItineraryFeedback }) => {

    // Initialize iterated travelers
    let iteratedTravelers = [];

    // Share itinerary form instance
    const [shareItinerary] = Form.useForm();

    const shareFlightResults = useShareFlightResults();

    // Initialize and set the media query for mobile
    const [onMobile, setOnMobile] = useState(window.matchMedia("(max-width: 768px)").matches);

    // State for flight details tab
    const [detailsVisibility, setDetailsVisibility] = useState(false);
    // State for flight rules tab
    const [FareRulesVisible, setFareRulesVisible] = useState(false);
    // State for baggage Info tab
    const [baggageInfoVisibility, setBaggageInfoVisibility] = useState(false);


    // State that handles button 
    const [shareItinenaryIsRunning, setShareItinenaryIsRunning] = useState(false);


    useEffect(() => {
        // Set the media query for mobile
        window.matchMedia("(max-width: 768px)").addEventListener('change', e => {
            setOnMobile(e.matches);
        });
    }, [onMobile]);

    function toggleDetails() {
        setDetailsVisibility(!detailsVisibility);
        // Close flight rules tab if open 
        setFareRulesVisible(false);
        // Close baggage info tab if open 
        setBaggageInfoVisibility(false);
    }
    function toggleFareRules() {
        setFareRulesVisible(!FareRulesVisible);
        // Close flight details tab if open 
        setDetailsVisibility(false);
        // Close baggage info tab if open 
        setBaggageInfoVisibility(false);
    }
    function toggleBaggageInfo() {
        setBaggageInfoVisibility(!baggageInfoVisibility);
        // Close flight details tab if open 
        setDetailsVisibility(false);
        // Close flight rules tab if open 
        setFareRulesVisible(false)
    }


    // Formats traveler type
    function formatTravelerType(travelerType) {
        switch (travelerType) {
            case 'ADULT':
                return 'Adult';
            case 'CHILD':
                return 'Child';
            case 'HELD_INFANT':
                return 'Infant';
            case 'HELD_INFANT':
                return 'Infant';

            default:
                return '';
        }
    }

    async function handleShareFlight() {
        shareItinerary.validateFields()
            .then(async (data) => {
                setShareItinenaryIsRunning(true);
                await shareFlightResults({
                    email: data?.recipentEmail,
                    offerInfo: flightOffer
                })
                    .then((result) => {
                        setShareItinenaryIsRunning(false);
                        shareItinerary?.resetFields();
                        if (result?.data?.successful) {
                            notifyShareItineraryFeedback();
                        }
                    })
                    .catch((error) => {
                        shareItinerary?.resetFields();
                        setShareItinenaryIsRunning(false);
                        console.log('Share Itinerary error: ', error);
                    });
            })
            .catch((error) => {
                console.log('Form Error:', error);
            });
    }

    const travellerPricing = flightOffer?.travelerPricings;
    const quantity = travellerPricing[0]?.fareDetailsBySegment[0]?.includedCheckedBags?.quantity

    // console.log('Flight offer: ', flightOffer);

    return (
        <div className="flightDescriptionContainer">
            {/* Don't show if window size is not mobile -> Code below shows only on desktop  */}
            {!onMobile && (<div className="container">

                <div className="details">
                    {/* Flight itinarary  */}
                    <div className="flightDetails">
                        {/* This contains the header area */}
                        <div className="header">
                            <div className="item">Airline</div>
                            <div className="item">Departure</div>
                            <div className="item">Duration</div>
                            <div className="item">Arrival</div>
                            <div className="item">Flight Class</div>
                        </div>

                        {/* Loop through itinararies */}
                        {flightOffer?.itineraries?.map((itinerary, index) => {
                            // Set the departure segment
                            let departureSegment = itinerary?.segments[0];
                            // Set the arrival segment
                            let arrivalSegment = itinerary?.segments[itinerary.segments.length - 1];
                            // Set the number of stops
                            let numberOfStops = itinerary?.segments.length - 1;
                            // Set the cabin
                            let cabin = flightOffer?.travelerPricings[0]?.fareDetailsBySegment[0]?.cabin;
                            return (
                                <div className="BodyContent" key={index}>
                                    {/* Map here  */}
                                    <div className="BodyContentItem">
                                        {/* Airline information - image & name */}
                                        <div className="item airline">
                                            <Image src={`${process.env.NEXT_WAKANOW_PUBLIC_URL}/Images/flight-logos/${departureSegment?.carrier?.iataCode}.gif`} alt={departureSegment?.carrier?.iataCode} width={50} height={50} />
                                            <p>{departureSegment?.carrier?.name}</p>
                                        </div>
                                        {/* Departure time, date, and iatacode */}
                                        <div className="item doubleCell">
                                            <h5>{moment(departureSegment?.segmentDeparture?.at).utcOffset('+0100').format('HH:mm')}</h5>
                                            <p className="item__date">{moment(departureSegment?.segmentDeparture?.at).utcOffset('+0100').format('MMM D, YYYY')}</p>
                                            <p>{departureSegment?.segmentDeparture?.airport?.iataCode}</p>
                                        </div>
                                        {/* Itinery duration, and stop */}
                                        <div className="item doubleCell">
                                            <div className="time">
                                                <span> <MdAccessTime /> </span>
                                                <p>{itinerary?.duration}</p>
                                            </div>
                                            <div className="line"></div>
                                            <p>{numberOfStops} {numberOfStops < 2 ? 'Stop' : 'Stops'}</p>
                                        </div>
                                        {/* Arrival time, date, and iatacode */}
                                        <div className="item doubleCell">
                                            <h5>{moment(arrivalSegment?.segmentArrival?.at).utcOffset('+0100').format('HH:mm')}</h5>
                                            <p className="item__date">{moment(arrivalSegment?.segmentArrival?.at).utcOffset('+0100').format('MMM D, YYYY')}</p>
                                            <p>{arrivalSegment.segmentArrival?.airport?.iataCode}</p>
                                        </div>
                                        {/* Cabin information */}
                                        <div className="item">
                                            <p>{cabin}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    {/* Flight price */}
                    <div className="flightPrice">
                        <div className="priceHeader">Price</div>
                        <div className="flightPrice__content">
                            <div className="amount">
                                {parseFloat(flightOffer?.priceBreakdown?.total).toLocaleString("en-NG", { style: "currency", currency: "NGN", })}
                            </div>
                            {enableFurtherAction && <button className="book" onClick={async () => await confirmPrice(flightOffer)}>Book</button>}                        </div>
                    </div>
                </div>

                {/* Bottom layer */}
                <div className="bottom">
                    <div className={`item ${detailsVisibility ? 'active' : ''}`} onClick={toggleDetails}>
                        <span> <GiAirplaneDeparture /> </span>
                        <div className="detail">
                            <p>Flight Details</p>
                            <span className={`chevDown ${detailsVisibility ? 'svgRotate' : ''}`}> <FaChevronDown /> </span>
                        </div>
                    </div>
                    <div className={`item ${baggageInfoVisibility ? 'active' : ''}`} onClick={toggleBaggageInfo}>
                        <span> <BsHandbag /> </span>
                        <div className="detail">
                            <p>Baggage Info</p>
                            <span className="chevDown"> <FaChevronDown /> </span>
                        </div>
                    </div>
                    <div className={`item ${FareRulesVisible ? 'active' : ''}`} onClick={toggleFareRules}>
                        <span> <RiFileInfoLine /> </span>
                        <div className="detail">
                            <p>Fare Rules</p>
                            <span className={`chevDown ${FareRulesVisible ? 'svgRotate' : ''}`}> <FaChevronDown /> </span>
                        </div>
                    </div>
                </div>

                {/* Flight Details plus fare breakdown */}
                <div className="bottomContainers">
                    {detailsVisibility ?
                        (<div className='bottomContainer'>
                            {/* Flight itinerary and itinerary segments */}
                            <div className="InfoContainer" >
                                {flightOffer?.itineraries?.map((itinerary, index) => {
                                    // Set segments
                                    let segments = itinerary?.segments;

                                    // Set the last segment
                                    let lastSegment = segments[segments.length - 1];

                                    return (
                                        <div className="flightInfo" key={index}>
                                            <div className="flightDestination">{itinerary?.itinerarySummary}</div>
                                            <div className="flightItinery">
                                                {/* Map flight segment here  */}
                                                {segments.map((segment, index) => {

                                                    // Set a flag that denotes the last segment
                                                    let isLastSegment = segment?.id === lastSegment?.id;

                                                    // Set the cabin
                                                    let fareDetails = flightOffer?.travelerPricings[0]?.fareDetailsBySegment?.find(s => s?.segmentId === segment?.id);

                                                    return (
                                                        <div className="flightSegment" key={index}>
                                                            <div className="fullDetails">
                                                                <div className="logo">
                                                                    <Image src={`${process.env.NEXT_WAKANOW_PUBLIC_URL}/Images/flight-logos/${segment?.carrier?.iataCode}.gif`} alt={segment?.carrier?.iataCode} width={50} height={50} />
                                                                    <div>
                                                                        <p>{segment?.carrier?.name}</p>
                                                                        <p className="logo__class">({fareDetails?.cabin} ({fareDetails?.class}))</p>
                                                                    </div>
                                                                </div>
                                                                <div className="content">
                                                                    <div className="fromContent">
                                                                        <div className="fromDestination"> <p>{segment?.segmentDeparture?.airport?.iataCode}</p>
                                                                            <p className="time">{moment(segment?.segmentDeparture?.at).utcOffset('+0100').format('HH:mm')}</p>
                                                                        </div>
                                                                        {/* <div className="terminal"> <p>Terminal 1</p> </div>Feb 1, 2022  */}
                                                                        <div className="date"> <p>{moment(segment?.segmentDeparture?.at).utcOffset('+0100').format('MMM D, yyyy')}</p> </div>
                                                                        <div className="location"> <p>{segment?.segmentDeparture?.airport?.city}</p> </div>
                                                                    </div>
                                                                    <div className="timeDuration">
                                                                        <div className="time">
                                                                            <span> <MdAccessTime /> </span>
                                                                            <p>{segment?.duration}</p>
                                                                        </div>
                                                                        <div className="line"></div>
                                                                    </div>
                                                                    <div className="toContent">
                                                                        <div className="toDestination">
                                                                            <p>{segment?.segmentArrival?.airport?.iataCode}</p>
                                                                            <p className="time">{moment(segment?.segmentArrival?.at).utcOffset('+0100').format('HH:mm')}</p>
                                                                        </div>
                                                                        {/* <div className="terminal"> <p>Terminal 1</p> </div>  */}
                                                                        <div className="date"> <p>{moment(segment?.segmentArrival?.at).utcOffset('+0100').format('MMM D, yyyy')}</p> </div>
                                                                        <div className="location"> <p>{segment?.segmentArrival?.airport?.city}</p> </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* If the current index is not the last index...  */}
                                                            {/* Then render the lay over information  */}
                                                            {/* {segments.length - 1 != index ? ( */}
                                                            {isLastSegment ? (<></>) : (
                                                                <div className="bottomDetails">
                                                                    <div className="content">
                                                                        <p>Changing plane at <span>{segment?.segmentArrival?.airport?.city}</span> &nbsp; &nbsp; &nbsp;  </p>
                                                                        <div className="waiting">
                                                                            <span> <MdAccessTime /> </span>
                                                                            <p className="waitingTime">Waiting time:</p> &nbsp;&nbsp;
                                                                            <p>{segment?.layOverDuration}</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Fare breakdown */}
                            <div className="fareInfoParent">
                                <div className="fareInfo">
                                    <div className="title">Fare Breakdown</div>
                                    <div className="content">
                                        {flightOffer?.travelerPricings.map((traveler, index) => {
                                            // Set the travelers
                                            let travelers = flightOffer?.travelerPricings;
                                            // Add the traveler of the current iteration
                                            iteratedTravelers?.push(traveler);
                                            // Filter the iterated travelers
                                            let addedTravelers = iteratedTravelers?.filter(iteratedTraveler => iteratedTraveler?.travelerType === traveler?.travelerType);

                                            // If this iteration is an existing traveler type...
                                            if (addedTravelers?.length > 1) {
                                                // Exit this iteration
                                                return;
                                            }

                                            // Initialize traveler pricing total
                                            let travelerPriceTotal = 0;

                                            // Set the traveler type of the current iteration
                                            let travelerType = traveler?.travelerType;

                                            // Compute the sum of traveler type
                                            travelers.filter(t => t?.travelerType === travelerType).forEach((t) => {
                                                let value = t?.priceBreakdown?.total;
                                                travelerPriceTotal += value;
                                            });

                                            // Return traveler pricing for this iteration
                                            return (
                                                <div className="contentItem" key={index}>
                                                    <p>{formatTravelerType(travelerType)} x {travelers?.filter(t => t.travelerType === travelerType).length}:</p> <p className="price">{parseFloat(travelerPriceTotal).toLocaleString("en-NG", { style: "currency", currency: "NGN", })}</p>
                                                </div>
                                            );
                                        })}

                                        <div className="contentItem"> <p>Base fare:</p> <p className="price">{parseFloat(flightOffer?.priceBreakdown?.base).toLocaleString("en-NG", { style: "currency", currency: "NGN", })}</p> </div>
                                        <div className="contentItem"> <p>Tax &amp; fees:</p> <p className="price">{parseFloat(flightOffer?.priceBreakdown?.taxesAndFees).toLocaleString("en-NG", { style: "currency", currency: "NGN", })}</p> </div>
                                    </div>
                                    <div className="totalAmount">
                                        Total:<p>{parseFloat(flightOffer?.priceBreakdown?.total).toLocaleString("en-NG", { style: "currency", currency: "NGN", })}</p>
                                    </div>
                                </div>
                                <div className="itinenaryShare">
                                    <label htmlFor="shareItinenary">Share this itinarary</label>
                                    <div className="itinenaryShare__input">
                                        <Form form={shareItinerary} className="itinenaryShareform"
                                            onSubmitCapture={async () => await handleShareFlight()}>
                                            <Form.Item name='recipentEmail'
                                                rules={
                                                    [
                                                        {
                                                            type: 'email',
                                                            message: 'Please enter a valid email address'
                                                        },
                                                        {
                                                            required: true,
                                                            message: 'Please specify recipient email'
                                                        }
                                                    ]
                                                }>
                                                <Input type="email" name="recipentEmail" />
                                            </Form.Item>
                                            <Button loading={shareItinenaryIsRunning} className="sendBtn" onClick={async () => handleShareFlight()}>Send</Button>
                                        </Form>
                                    </div>
                                </div>
                            </div>
                        </div>) : (<></>)}

                    {/* Flight Rules */}
                    {
                        FareRulesVisible ?
                            // (<div className="bottomContainer">
                            //     Rules
                            //     <div className="InfoContainer rules">
                            //         <ol>
                            //             <li className="eachRule">
                            //                 Application and other conditions rule - 001/ry02 unless otherwise specified qatar airways regular fares. application area these fares apply between area 1 and area 2/area 3. class of service these fares apply for economy class service. types of transportation fares governed by this rule can be used to create one-way/round-trip/circle-trip/open-jaw journeys. capacity limitations the carrier shall limit the number of passengers carried on any one flight at fares governed by this rule and such fares will not necessarily be available on all flights.
                            //             </li>
                            //             <li className="eachRule">
                            //                 Application and other conditions rule - 001/ry02 unless otherwise specified qatar airways regular fares. application area these fares apply between area 1 and area 2/area 3. class of service these fares apply for economy class service. types of transportation fares governed by this rule can be used to create one-way/round-trip/circle-trip/open-jaw journeys. 
                            //             </li>
                            //             <li className="eachRule">
                            //                 Application and other conditions rule - 001/ry02 unless otherwise specified qatar airways regular fares. 
                            //             </li>
                            //             <li className="eachRule">
                            //                 Application and other conditions rule - 001/ry02 unless otherwise specified qatar airways regular fares. application area these fares apply between area 1 and area 2/area 3. class of service these fares apply for economy class service. types of transportation fares governed by this rule can be used to create one-way/round-trip/circle-trip/open-jaw journeys. capacity limitations the carrier shall limit the number of passengers carried on any one flight at fares governed by this rule and such fares will not necessarily be available on all flights.
                            //             </li>
                            //             <li className="eachRule">
                            //                 Application and other conditions rule - 001/ry02 unless otherwise specified qatar airways regular fares. application area these fares apply between area 1 and area 2/area 3. class of service these fares apply for economy class service. 
                            //             </li>
                            //             <li className="eachRule">
                            //                 Application and other conditions rule - 001/ry02 unless otherwise specified qatar airways regular fares. application area these fares apply between area 1 and area 2/area 3. class of service these fares apply for economy class service. types of transportation fares governed by this rule can be used to create one-way/round-trip/circle-trip/open-jaw journeys. capacity limitations the carrier shall limit the number of passengers carried on any one flight at fares governed by this rule and such fares will not necessarily be available on all flights.
                            //             </li>
                            //         </ol>
                            //     </div>
                            //     Fare breakdown
                            //     <div className="fareInfoParent">

                            //     </div>
                            // </div>) : (<></>)
                            (
                                <Suspense fallback={<p>Loading...</p>}>
                                    <FareRules offerId={flightOffer.id} />
                                </Suspense>
                                // <></>
                            ) : <></>
                    }


                    {/* Baggage Info */}
                    {
                        baggageInfoVisibility ?
                            <div className="baggageInfoContainer">
                                <span><BsFillHandbagFill /> <p>{quantity}{quantity <= 1 ? 'PC' : 'PCS'}</p></span>
                            </div> : <></>
                    }
                </div>

            </div>)}

            {/* Code below shows only on mobile & tab view */}
            {onMobile && (<div className="mFlightItineries">
                {flightOffer?.itineraries.map((itinerary, index) => {
                    // Set the departure segment
                    let departureSegment = itinerary?.segments[0];
                    // Set the arrival segment
                    let arrivalSegment = itinerary?.segments[itinerary?.segments?.length - 1];
                    // Set the number of stops
                    let numberOfStops = itinerary?.segments?.length - 1;
                    // Set the cabin
                    let cabin = flightOffer.travelerPricings[0].fareDetailsBySegment[0].cabin;

                    // Itinery loop
                    return (<div className="mFlightItineries__itinerary" onClick={() => openResultPanel(flightOffer)} key={index}>
                        {/* Upper part of itinery that shows flight type and date  */}
                        <div className="mFlightType">
                            <p className="mFlightType__flight">{itinerary?.itineraryTitle} Flight</p>
                            <span className="mLine"></span>
                            <p className="mFlightType__date">{moment(departureSegment?.segmentDeparture?.at).utcOffset('+0100').format('MMM D, YYYY')}</p>
                        </div>
                        {/* Full info for each itinarary */}
                        <div className="mFlightDetails">
                            {/* Airline information */}
                            <div className="mFlightDetails__airline">
                                <div className="image">
                                    <Image src={`${process.env.NEXT_WAKANOW_PUBLIC_URL}/Images/flight-logos/${departureSegment?.carrier?.iataCode}.gif`} alt={departureSegment?.carrier?.iataCode} width={50} height={50} />
                                </div>
                                {departureSegment?.carrier?.name}
                            </div>
                            {/* Flight information */}
                            <div className="mFlightDetails__distanceDetails">
                                {/* Departure time and iatacode */}
                                <div className="iataArea">
                                    <div className="iataArea__time">{moment(departureSegment?.segmentDeparture?.at).utcOffset('+0100').format('HH:mm')}</div>
                                    {departureSegment?.segmentDeparture?.airport?.iataCode}
                                </div>
                                {/* Duration and stop */}
                                <div className="durationDetails">
                                    <div className="durationDetails__time">
                                        <ClockIcon />
                                        {itinerary?.duration}
                                    </div>
                                    <div className="line"></div>
                                    {numberOfStops} {numberOfStops < 2 ? 'Stop' : 'Stops'}
                                </div>
                                {/* Arrival time and iatacode */}
                                <div className="iataArea">
                                    <div className="iataArea__time">{moment(arrivalSegment?.segmentArrival?.at).utcOffset('+0100').format('HH:mm')}</div>
                                    {arrivalSegment?.segmentArrival?.airport?.iataCode}
                                </div>
                            </div>
                        </div>
                    </div>)
                })}
                {/* Total amount */}
                <div className="mFlightItineries__totalAmount" onClick={() => openResultPanel(flightOffer)}>
                    {parseFloat(flightOffer?.priceBreakdown?.total).toLocaleString("en-NG", { style: "currency", currency: "NGN", })}
                </div>
            </div>)}
        </div>
    )
}

export default FlightItem;