import React, { useEffect, useState } from 'react';

export const FlightDepartureSuggestion = ({
    flightSearchCredentialKey,
    originDepartureInput,
    flightSearchCredentials,
    setFlightSearchCredentials,
    setOriginDepartureInputVal,
    setDepLocationSuggestionsVisible,
    setDepLocationSuggestionsIsHovered
}) => {
    // Initialize and set the media query for mobile
    const [onMobile, setOnMobile] = useState(window.matchMedia("(max-width: 768px)").matches);

    useEffect(() => {
        // Set the media query for mobile
        window.matchMedia("(max-width: 768px)").addEventListener('change', e => {
            setOnMobile(e.matches);
        });
    }, [onMobile]);

    const airportsList = [
        {
            "name": "Murtala Muhammed Intl",
            "iataCode": "LOS",
            "city": "Lagos",
            "state": "Lagos",
            "country": "Nigeria"
        },
        {
            "name": "All Dubai Airports",
            "iataCode": "DXB",
            "city": "Dubai",
            "state": "Dubai",
            "country": "AE"
        },
        {
            "name": "Nnamdi Azikiwe Intl",
            "iataCode": "ABV",
            "city": "Abuja",
            "state": "Abuja",
            "country": "Nigeria"
        },
        {
            "name": "Heathrow",
            "iataCode": "LHR",
            "city": "London",
            "state": "London",
            "country": "United Kingdom"
        },
        {
            "name": "San Francisco Intl",
            "iataCode": "SFO",
            "city": "San Francisco",
            "state": "San Francisco",
            "country": "United States Of America"
        },
        {
            "name": "Los Angeles Intl",
            "iataCode": "LAX",
            "city": "Los Angeles",
            "state": "Los Angeles",
            "country": "United States Of America"
        },
        {
            "name": "Ataturk",
            "iataCode": "IST",
            "city": "Istanbul",
            "state": "Istanbul",
            "country": "Turkey"
        },
        {
            "name": "Jomo Kenyatta Intl",
            "iataCode": "NBO",
            "city": "Nairobi",
            "state": "Nairobi",
            "country": "Kenya"
        },
        {
            "name": "Regional",
            "iataCode": "BWD",
            "city": "Brownwood",
            "state": "Brownwood",
            "country": "United States Of America"
        },
        {
            "name": "Lester B. Pearson Intl",
            "iataCode": "YYZ",
            "city": "Toronto",
            "state": "Toronto",
            "country": "Canada"
        },
        {
            "name": "George Bush Intercont",
            "iataCode": "IAH",
            "city": "Houston",
            "state": "Houston",
            "country": "United States Of America"
        },
        {
            "name": "Charles De Gaulle",
            "iataCode": "CDG",
            "city": "Paris",
            "state": "Paris",
            "country": "France"
        },
        {
            "name": "John F Kennedy Intl",
            "iataCode": "JFK",
            "city": "New York",
            "state": "New York",
            "country": "United States Of America"
        },
    ]

    return (
        <>
            {!onMobile && (
                <div className='fsContainer'
                    onMouseEnter={() => setDepLocationSuggestionsIsHovered(true)}
                    onMouseLeave={() => setDepLocationSuggestionsIsHovered(false)}>
                    <div className='fsContainer__top'>Popular Cities</div>
                    <div className='fsContainer__content'>
                        {
                            airportsList.map((eachAirport, key) => {
                                return (
                                    <p
                                        className='eachPlace'
                                        key={key}
                                        onClick={() => {
                                            setDepLocationSuggestionsVisible(false);
                                            setDepLocationSuggestionsIsHovered(false);
                                            setOriginDepartureInputVal(eachAirport.iataCode);

                                            // Update the flight search credentials
                                            flightSearchCredentials['originLocationCityCode' + flightSearchCredentialKey] = eachAirport.iataCode;
                                            setFlightSearchCredentials(flightSearchCredentials);

                                            // Update the input value
                                            originDepartureInput.current.value = `${eachAirport.name} (${eachAirport.iataCode})`
                                        }
                                        }>
                                        {eachAirport.city}
                                    </p>
                                )
                            })
                        }
                    </div>
                </div>
            )}

            {onMobile && (
                <div className='mFsContainer'
                    onMouseEnter={() => setDepLocationSuggestionsIsHovered(true)}
                    onMouseLeave={() => setDepLocationSuggestionsIsHovered(false)}>
                    <div className='mFsContainer__top'>Popular Cities</div>
                    <div className='mFsContainer__content'>
                        {
                            airportsList.map((eachAirport, key) => {
                                return (
                                    <p
                                        className='eachPlace'
                                        key={key}
                                        onClick={() => {
                                            setDepLocationSuggestionsVisible(false);
                                            setDepLocationSuggestionsIsHovered(false);
                                            setOriginDepartureInputVal(eachAirport.iataCode);

                                            // Update the flight search credentials
                                            flightSearchCredentials['originLocationCityCode' + flightSearchCredentialKey] = eachAirport.iataCode;
                                            setFlightSearchCredentials(flightSearchCredentials);

                                            originDepartureInput.current.value = `${eachAirport.name} (${eachAirport.iataCode})`
                                        }
                                        }>
                                        {eachAirport.city}
                                    </p>
                                )
                            })
                        }
                    </div>
                </div>
            )}
        </>
    )
}

/**
 * Flight arrival suggestion JSX component
 * @param {*} param0 
 * @returns The JSX cpmponent
 */
export const FlightArrivalSuggestion = ({
    flightSearchCredentialKey,
    originArrivalInput,
    flightSearchCredentials,
    setFlightSearchCredentials,
    setOriginArrivalInputVal,
    setArrivalLocationSuggestionsVisible,
    setArrivalLocationSuggestionsIsHovered
}) => {

    // Set the mobile unit
    const [onMobile, setOnMobile] = useState(window.matchMedia("(max-width: 768px)").matches);

    useEffect(() => {
        // Set the media query for mobile
        window.matchMedia("(max-width: 768px)").addEventListener('change', e => {
            setOnMobile(e.matches);
        });
    }, [onMobile]);

    const airportsList = [
        {
            "name": "Murtala Muhammed Intl",
            "iataCode": "LOS",
            "city": "Lagos",
            "state": "Lagos",
            "country": "Nigeria"
        },
        {
            "name": "All Dubai Airports",
            "iataCode": "DXB",
            "city": "Dubai",
            "state": "Dubai",
            "country": "AE"
        },
        {
            "name": "Nnamdi Azikiwe Intl",
            "iataCode": "ABV",
            "city": "Abuja",
            "state": "Abuja",
            "country": "Nigeria"
        },
        {
            "name": "Heathrow",
            "iataCode": "LHR",
            "city": "London",
            "state": "London",
            "country": "United Kingdom"
        },
        {
            "name": "San Francisco Intl",
            "iataCode": "SFO",
            "city": "San Francisco",
            "state": "San Francisco",
            "country": "United States Of America"
        },
        {
            "name": "Los Angeles Intl",
            "iataCode": "LAX",
            "city": "Los Angeles",
            "state": "Los Angeles",
            "country": "United States Of America"
        },
        {
            "name": "Ataturk",
            "iataCode": "IST",
            "city": "Istanbul",
            "state": "Istanbul",
            "country": "Turkey"
        },
        {
            "name": "Jomo Kenyatta Intl",
            "iataCode": "NBO",
            "city": "Nairobi",
            "state": "Nairobi",
            "country": "Kenya"
        },
        {
            "name": "Regional",
            "iataCode": "BWD",
            "city": "Brownwood",
            "state": "Brownwood",
            "country": "United States Of America"
        },
        {
            "name": "Lester B. Pearson Intl",
            "iataCode": "YYZ",
            "city": "Toronto",
            "state": "Toronto",
            "country": "Canada"
        },
        {
            "name": "George Bush Intercont",
            "iataCode": "IAH",
            "city": "Houston",
            "state": "Houston",
            "country": "United States Of America"
        },
        {
            "name": "Charles De Gaulle",
            "iataCode": "CDG",
            "city": "Paris",
            "state": "Paris",
            "country": "France"
        },
        {
            "name": "John F Kennedy Intl",
            "iataCode": "JFK",
            "city": "New York",
            "state": "New York",
            "country": "United States Of America"
        },
    ]

    return (
        <>
            {
                !onMobile && (
                    <div className='fsContainer'
                        onMouseEnter={() => setArrivalLocationSuggestionsIsHovered(true)}
                        onMouseLeave={() => setArrivalLocationSuggestionsIsHovered(false)}>
                        <div className='fsContainer__top'>Popular Cities</div>
                        <div className='fsContainer__content'>
                            {
                                airportsList.map((eachAirport, key) => {
                                    return (
                                        <p
                                            className='eachPlace'
                                            key={key}
                                            onClick={() => {
                                                setArrivalLocationSuggestionsVisible(false);
                                                setArrivalLocationSuggestionsIsHovered(false);
                                                setOriginArrivalInputVal(eachAirport.iataCode);

                                                // Update the flight search credentials
                                                flightSearchCredentials['originDestinationCityCode' + flightSearchCredentialKey] = eachAirport.iataCode;
                                                setFlightSearchCredentials(flightSearchCredentials);
                                                originArrivalInput.current.value = `${eachAirport.name} (${eachAirport.iataCode})`
                                            }
                                            }>
                                            {eachAirport.city}
                                        </p>
                                    )
                                })
                            }
                        </div>
                    </div>
                )
            }

            {
                onMobile && (
                    <div className='mFsContainer'
                        onMouseEnter={() => setArrivalLocationSuggestionsIsHovered(true)}
                        onMouseLeave={() => setArrivalLocationSuggestionsIsHovered(false)}>
                        <div className='mFsContainer__top'>Popular Cities</div>
                        <div className='mFsContainer__content'>
                            {
                                airportsList.map((eachAirport, key) => {
                                    return (
                                        <p
                                            className='eachPlace'
                                            key={key}
                                            onClick={() => {
                                                setArrivalLocationSuggestionsVisible(false);
                                                setArrivalLocationSuggestionsIsHovered(false);
                                                setOriginArrivalInputVal(eachAirport.iataCode);

                                                // Update the flight search credentials
                                                flightSearchCredentials['originDestinationCityCode' + flightSearchCredentialKey] = eachAirport.iataCode;
                                                setFlightSearchCredentials(flightSearchCredentials);
                                                
                                                originArrivalInput.current.value = `${eachAirport.name} (${eachAirport.iataCode})`;
                                            }
                                            }>
                                            {eachAirport.city}
                                        </p>
                                    )
                                })
                            }
                        </div>
                    </div>
                )
            }
        </>
    )
}