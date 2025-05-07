import React, { useState, useEffect, Suspense } from 'react';
import { LikeIcon, ClockIcon } from './CustomSVGIcon';
import { MdOutlineArrowBack } from 'react-icons/md';
import moment from "moment";
import { FlightFilterMobile } from './FlightFilterMobile';
import { AiOutlineShareAlt } from 'react-icons/ai';
import { GrClose } from 'react-icons/gr';
import { Form, Input, Button } from 'antd';
import FareRules from './FareRules';

import { useShareFlightResults } from '../pages/api/apiClient';
import { BsHandbag } from 'react-icons/bs';
import { FaChevronDown } from 'react-icons/fa';

const FlightDetailsMobile = ({ visible, closeResultPanel, confirmPrice, enableFurtherAction, changeOption, itineraryShareable }) => {
    // Initialize iterated travelers
    let iteratedTravelers = [];

    // Formats traveler type
    function formatTravelerType(travelerType) {
        switch (travelerType) {
            case 'ADULT':
                return 'Adult';
            case 'CHILD':
                return 'Child';
            case 'SEATED_INFANT':
                return 'Infant';
            case 'HELD_INFANT':
                return 'Infant';

            default:
                return '';
        }
    }

    const flightOffer = JSON.parse(window.localStorage.getItem('flightOffer'));

    // Initialize and set the media query for mobile
    const [onMobile, setOnMobile] = useState(window.matchMedia("(max-width: 768px)").matches);

    useEffect(() => {
        // Set the media query for mobile
        window.matchMedia("(max-width: 768px)").addEventListener('change', e => {
            setOnMobile(e.matches);
        });
    }, [onMobile]);

    // const [itineraryShareable, setItineraryShareable] = useState(false);

    // function changeOption() {
    //     setItineraryShareable(!itineraryShareable);
    // }

    const [tabVisible, setTabVisible] = useState(true);
    function toggleItinenaryTabVisibility() {
        setTabVisible(true);
    }
    function toggleRulesTabVisibility() {
        setTabVisible(false);
    }

    // console.log('flightOffer: ', flightOffer);
    const quantity = flightOffer?.travelerPricings[0].fareDetailsBySegment[0]?.includedCheckedBags?.quantity;
    // console.log('quantity: ', quantity);
    // const quantity = travellerPricing[0]?.fareDetailsBySegment[0]?.includedCheckedBags?.quantity


    return (
        <>
            {onMobile && (
                <div className={`fDM_Container ${visible ? 'fDM_ContainerActive' : ''}`}>
                    <div className='fDMobileTopBar'>
                        <div className='fDMobileTopBar__icon' onClick={closeResultPanel}>
                            <MdOutlineArrowBack />
                        </div>
                        Flight Details
                        <button className='fDShareItinerary' onClick={changeOption}>
                            <div className='fDShareItinerary__icon'>
                                {itineraryShareable ? <GrClose color='#ffffff' /> : <AiOutlineShareAlt />}
                            </div>
                            {itineraryShareable ? 'Cancel' : 'Share Itinerary'}
                        </button>
                        <ShareFlight itineraryShareable={itineraryShareable} changeOption={changeOption} flightOffer={flightOffer} />
                    </div>
                    <div className='commendingRemark'>
                        <div className='commendingRemark__like'>
                            <LikeIcon />
                        </div>
                        <p>Well done! You chose one of the best value flights. <span>Book now before the price changes</span> </p>
                    </div>
                    <div className='upperNavigation'>
                        <div className={`${tabVisible ? 'upperNavigation__itinery active' : 'upperNavigation__itinery'}`} onClick={toggleItinenaryTabVisibility}>Itinenary</div>
                        <div className={`${!tabVisible ? 'upperNavigation__rules active' : 'upperNavigation__rules'}`} onClick={toggleRulesTabVisibility}>Flight Rules</div>
                        {/* <div className='upperNavigation__rules'>Flight Rules</div> */}
                    </div>


                    {/* close when flight rules tab is open */}
                    {/* Flight itinerary and itinerary segments */}
                    {
                        tabVisible && (
                            <div className='segmentContainer'>
                                {flightOffer?.itineraries?.map((itinerary, index) => {
                                    // Set segments
                                    let segments = itinerary?.segments;

                                    // Set the last segment
                                    let lastSegment = segments[segments.length - 1];
                                    return (
                                        <div className="segmentDetailsContainer" key={index}>
                                            <div className='segmentContainer__header'>{itinerary?.itinerarySummary}</div>
                                            <div className="segmentDetails">
                                                {/* Map flight segment here  */}
                                                {segments?.map((segment, index) => {
                                                    // Set a flag that denotes the last segment
                                                    let isLastSegment = segment?.id === lastSegment?.id;

                                                    // Set the cabin
                                                    let fareDetails = flightOffer?.travelerPricings[0]?.fareDetailsBySegment?.find(s => s?.segmentId === segment?.id);

                                                    return (
                                                        <div key={index}>
                                                            {/* Details on segements  */}
                                                            <div className='segmentContainer__segment'>
                                                                <div className='airline'>
                                                                    <div className='image'>
                                                                        <img src={`https://wakanow-images.azureedge.net/Images/flight-logos/${segment?.carrier?.iataCode}.gif`} alt={segment?.carrier?.iataCode} height="48px" />
                                                                    </div>
                                                                    {segment?.carrier?.name}
                                                                </div>
                                                                <div className='segmentInfo'>
                                                                    <div className='segmentInfo__departure'>
                                                                        <div className='iataCodeTimer'>
                                                                            {segment?.segmentDeparture?.airport?.iataCode} – <span>{moment(segment?.segmentDeparture?.at).format('HH:mm')}</span>
                                                                        </div>
                                                                        <div className='date'>
                                                                            {moment(segment?.segmentDeparture?.at).format('MMM D, yyyy')}
                                                                        </div>
                                                                        <div className='state'>
                                                                            {segment?.segmentDeparture?.airport?.city}
                                                                        </div>
                                                                    </div>
                                                                    <div className='segmentInfo__segmentDuration'>
                                                                        <div className='time'>
                                                                            <ClockIcon />
                                                                            {segment?.duration}
                                                                        </div>
                                                                        <div className='line'></div>
                                                                        <div className='mCabin'>{fareDetails?.cabin} &#40;{fareDetails?.class}&#41;</div>
                                                                    </div>
                                                                    <div className='segmentInfo__arrival'>
                                                                        <div className='iataCodeTimer'>
                                                                            {segment?.segmentArrival?.airport?.iataCode} – <span>{moment(segment?.segmentArrival?.at).format('HH:mm')}</span>
                                                                        </div>
                                                                        <div className='date'>
                                                                            {moment(segment?.segmentArrival?.at).format('MMM D, yyyy')}
                                                                        </div>
                                                                        <div className='state'>
                                                                            {segment?.segmentArrival?.airport?.city}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* If the current index is not the last index...  */}
                                                            {/* Then render the lay over information  */}
                                                            {/* {segments.length - 1 != index ? ( */}
                                                            {isLastSegment ? (<></>) : (
                                                                <div className='segementButtomInfo'>
                                                                    <p>Changing Flight at <span>{segment?.segmentArrival?.airport?.city}</span></p>
                                                                    <div className='waitingTime'>
                                                                        <ClockIcon />
                                                                        {segment?.layOverDuration}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )
                                })}
                                <div className='segmentBaggageInfo'>
                                    <div className="detail">
                                        <span> <BsHandbag /> </span>
                                        <p>Baggage Info</p>
                                    </div>
                                    <span className="chevDown">{quantity}{quantity <= 1 ? 'PC' : 'PCS'} </span>
                                </div>
                            </div>
                        )
                    }

                    {/* Remains static */}
                    <div className='flightPrice'>
                        <div className='flightPrice__price'>{parseFloat(flightOffer?.priceBreakdown?.total).toLocaleString("en-NG", { style: "currency", currency: "NGN", })}</div>
                        <div className='midLine'></div>
                        {enableFurtherAction && <div className='flightPrice__book' onClick={async () => await confirmPrice(flightOffer)}> <button>Book Flight</button> </div>}
                    </div>

                    {/* close when flight rules tab is open */}
                    {/* Fare breakdown */}
                    {
                        tabVisible && (
                            <div className='fareBreakdown'>
                                <h3 className='fareBreakdown__title'>Fare Breakdown</h3>
                                <div className='fareBreakdown__details'>
                                    {flightOffer?.travelerPricings?.map((traveler, index) => {
                                        // Set the travelers
                                        let travelers = flightOffer?.travelerPricings;
                                        // Add the traveler of the current iteration
                                        iteratedTravelers?.push(traveler);
                                        // Filter the iterated travelers
                                        let addedTravelers = iteratedTravelers.filter(iteratedTraveler => iteratedTraveler?.travelerType === traveler?.travelerType);

                                        // If this iteration is an existing traveler type...
                                        if (addedTravelers.length > 1) {
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
                                            <>
                                                <div className="item" key={index}>
                                                    <p>{formatTravelerType(travelerType)} x {travelers.filter(t => t?.travelerType === travelerType).length}:</p> <p className="price">{parseFloat(travelerPriceTotal).toLocaleString("en-NG", { style: "currency", currency: "NGN", })}</p>
                                                </div>
                                            </>
                                        );
                                    })}
                                    <div className='baseTaxPrice'>
                                        <div className='item'>
                                            Base Fare
                                            <p>{parseFloat(flightOffer?.priceBreakdown?.base).toLocaleString("en-NG", { style: "currency", currency: "NGN", })}</p>
                                        </div>
                                        <div className='item'>
                                            Tax &amp; Fees
                                            <p>{parseFloat(flightOffer?.priceBreakdown?.taxesAndFees).toLocaleString("en-NG", { style: "currency", currency: "NGN", })}</p>
                                        </div>
                                    </div>
                                </div>
                                <p className='totalP'>Total Price:</p>
                            </div>
                        )
                    }
                    {/* Flight rules content comes below */}
                    {
                        !tabVisible && (
                            <>
                                <FareRules />
                                {/* <div className='flightRules'>
                                    <h3 className='flightRules__title'>Please carefully go through flight rules below</h3>

                                    <div className="rulesContainer">
                                        <ol>
                                            <li className="rulesContainer__eachRule">
                                                Application and other conditions rule - 001/ry02 unless otherwise specified qatar airways regular fares. application area these fares apply between area 1 and area 2/area 3. class of service these fares apply for economy class service. types of transportation fares governed by this rule can be used to create one-way/round-trip/circle-trip/open-jaw journeys. capacity limitations the carrier shall limit the number of passengers carried on any one flight at fares governed by this rule and such fares will not necessarily be available on all flights.
                                            </li>
                                            <li className="rulesContainer__eachRule">
                                                Application and other conditions rule - 001/ry02 unless otherwise specified qatar airways regular fares. application area these fares apply between area 1 and area 2/area 3. class of service these fares apply for economy class service. types of transportation fares governed by this rule can be used to create one-way/round-trip/circle-trip/open-jaw journeys.
                                            </li>
                                            <li className="rulesContainer__eachRule">
                                                Application and other conditions rule - 001/ry02 unless otherwise specified qatar airways regular fares.
                                            </li>
                                            <li className="rulesContainer__eachRule">
                                                Application and other conditions rule - 001/ry02 unless otherwise specified qatar airways regular fares. application area these fares apply between area 1 and area 2/area 3. class of service these fares apply for economy class service. types of transportation fares governed by this rule can be used to create one-way/round-trip/circle-trip/open-jaw journeys. capacity limitations the carrier shall limit the number of passengers carried on any one flight at fares governed by this rule and such fares will not necessarily be available on all flights.
                                            </li>
                                            <li className="rulesContainer__eachRule">
                                                Application and other conditions rule - 001/ry02 unless otherwise specified qatar airways regular fares. application area these fares apply between area 1 and area 2/area 3. class of service these fares apply for economy class service.
                                            </li>
                                            <li className="rulesContainer__eachRule">
                                                Application and other conditions rule - 001/ry02 unless otherwise specified qatar airways regular fares. application area these fares apply between area 1 and area 2/area 3. class of service these fares apply for economy class service. types of transportation fares governed by this rule can be used to create one-way/round-trip/circle-trip/open-jaw journeys. capacity limitations the carrier shall limit the number of passengers carried on any one flight at fares governed by this rule and such fares will not necessarily be available on all flights.
                                            </li>
                                        </ol>
                                    </div>
                                    <p className='totalP'>Total Price:</p>
                                </div> */}
                            </>
                        )
                    }

                    {/* <FlightFilterMobile /> */}
                </div>
            )}
        </>
    )
}

export default FlightDetailsMobile

export const ShareFlight = ({ itineraryShareable, changeOption, notifyShareItineraryFeedback, flightOffer }) => {

    // Share itinerary form instance
    const [shareItinerary] = Form.useForm();

    const shareFlightResults = useShareFlightResults();

    // State that handles button 
    const [shareItinenaryIsRunning, setShareItinenaryIsRunning] = useState(false);


    // State that handles toast card visibility
    const [mnotificationCardVisible, setmNotificationCardVisible] = useState(false);
    //   State for error message
    const [errorCardVisible, setErrorCardVisible] = useState(false);
    // Function that handles toast card
    function notifyShareItineraryFeedback() {
        setmNotificationCardVisible(true);

        setTimeout(() => {
            setmNotificationCardVisible(false);
        }, 3000);
    }
    // Function that handles toast card
    function notifyShareItineraryErrorFeedback() {
        setErrorCardVisible(true);

        setTimeout(() => {
            setErrorCardVisible(false);
        }, 3000);
    }

    async function handleShareFlight() {
        shareItinerary.validateFields()
            .then(async (data) => {
                setShareItinenaryIsRunning(true);
                await shareFlightResults({
                    email: data.recipentEmail,
                    offerInfo: flightOffer
                })
                    .then((result) => {
                        setShareItinenaryIsRunning(false);
                        shareItinerary.resetFields();
                        if (result.data.successful) {
                            notifyShareItineraryFeedback();
                        }
                    })
                    .catch((error) => {
                        shareItinerary.resetFields();
                        setShareItinenaryIsRunning(false);
                        console.log('Share Itinerary error: ', error);
                    });
            })
            .catch((error) => {
                console.log('Form Error:', error);
                setShareItinenaryIsRunning(false);
                notifyShareItineraryErrorFeedback();
            });
    }


    return (
        <>
            {
                itineraryShareable ?
                    (<div className='SfParentBox'>
                        <div className='SfContainer__Overlay' onClick={changeOption}></div>
                        <div className={mnotificationCardVisible ? 'SfContainer' : 'SfContainerClose'}>
                            <div className={mnotificationCardVisible ? 'SfContainer__notificationMsg' : 'SfContainer__notificationMsgClose'}>Itinerary shared successfully</div>
                            <div className={errorCardVisible ? 'SfContainer__notificationMsgError' : 'SfContainer__notificationMsgCloseError'}>Itinerary share failed. Please try again.</div>
                            <div className='SfContainer__inputContainer'>
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
                                        <Input name="recipentEmail" type='email' placeholder='Please enter your email' />
                                    </Form.Item>
                                </Form>
                            </div>
                            <Button loading={shareItinenaryIsRunning} className='SfSendBtn' onClick={async () => handleShareFlight()}>Send</Button>
                        </div>
                    </div>) : <></>
            }
        </>
    )
}