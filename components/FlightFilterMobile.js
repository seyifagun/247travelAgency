import React from 'react'
import { ResetIcon, IndicatorIcon } from './CustomSVGIcon';
import { MdOutlineArrowBack } from 'react-icons/md';
import { useState, useEffect } from 'react';

export const FlightFilterMobile = ( {visible, toggleFilter} ) => {
    // Initialize and set the media query for mobile
    const [onMobile, setOnMobile] = useState(window.matchMedia("(max-width: 768px)").matches);
  
    useEffect(() => {
      // Set the media query for mobile
      window.matchMedia("(max-width: 768px)").addEventListener('change', e => {
        setOnMobile(e.matches);
      });
    }, [onMobile]);
  return (
    <>
    { onMobile && (
    <div className={`FfContainer ${visible ? 'FfContainerActive' : ''}`}>
        <div className='FfTopBar'>
            <div className='FfTopBar__backIcon' onClick={toggleFilter}>
                <MdOutlineArrowBack />
            </div>
            Filter
            <div className='FfTopBar__reset'>
                <ResetIcon />
                Reset all
            </div>
        </div>
        <div className='FfBottomBar'>
            <div className='FfBottomBar__filter'>
                0 Filters
            </div>
            <div className='FfDivider'></div>
            <div className='FfBottomBar__apply'>
                Apply
            </div>
        </div>

        <div className='FfPriceFilter'>
            <FlightFilterMobileTopBar header='Price' />
            <div className='FfPriceFilter__filter'>
                <div className='FfFilterValues'>
                    <p className='FfFilterValues__minPrice'>N50,000</p>
                    <p className='FfFilterValues__maxPrice'>N5M</p>
                </div>
                <div className='FfSliderContainer'>
                    {/* <div className='FfSliderContainer__slider'>
                        <div className='FfSliderThumb'> </div>
                    </div> */}
                    <div className='FfSliderContainer__slider'>
                        <input type='range' min='1' max='100' className='FfSlider' />
                    </div>
                    <div className='FfOperators'>
                        <div className='FfOperators__minus'>
                            {/* Icon */}
                        </div>
                        <div className='FfOperators__add'>
                            {/* Icon */}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className='FfStops'>
            <FlightFilterMobileTopBar header='Number of Stops' />
            <div className='FfStops__filterOption'>
                <div className='FfOption'>
                    <div className='FfOption__numBox'>
                        0
                    </div>
                    N373,246
                </div>
                <div className='FfOption'>
                    <div className='FfOption__numBox'>
                        1
                    </div>
                    N773,246
                </div>
                <div className='FfOption'>
                    <div className='FfOption__numBox'>
                        2
                    </div>
                    N1,773,246
                </div>
            </div>
        </div>

        <div className='FfAirlines'>
            <FlightFilterMobileTopBar header='Airlines' />
            <div className='FfAirlines__checkbox'>
                <div className='FfCheckboxOption'>
                    <div className='FfCheckboxOption__airline'>
                        <input type="checkbox" name="virginAtlantic" />
                        <span className='checker'></span>
                        <label htmlFor='virginAtlantic'>Virgin Atlantic</label>
                    </div>
                    <p>from N569,365</p>
                </div>
                <div className='FfCheckboxOption'>
                    <div className='FfCheckboxOption__airline'>
                        <input type="checkbox" name="virginAtlantic" />
                        <span className='checker'></span>
                        <label htmlFor='virginAtlantic'>Qatar</label>
                    </div>
                    <p>from N769,365</p>
                </div>
                <div className='FfCheckboxOption'>
                    <div className='FfCheckboxOption__airline'>
                        <input type="checkbox" name="virginAtlantic" />
                        <span className='checker'></span>
                        <label htmlFor='virginAtlantic'>Kenya</label>
                    </div>
                    <p>from N869,365</p>
                </div>
            </div>
        </div>

        <div className='FfTakeOffFlight'>
            <FlightFilterMobileTopBar header='Take Off Flight' />
            <div className='FfTakeOffFlight__flightsGrp'>
                <div className='FfFlight'>
                    <p className='FfFlight__title'>Lagos - London</p>
                    <div className='FfFlight__duration'>
                        <div className='FfLine'>
                            <div className='FfIconLeft'>
                                <IndicatorIcon />
                            </div>
                            <div className='FfIconRight'>
                                <IndicatorIcon />
                            </div>
                        </div>
                        <p className='FfStartingTime'>21:30</p>
                        <p className='FfStoppingTime'>23:50</p>
                    </div>
                </div>
                <div className='FfFlight'>
                    <p className='FfFlight__title'>Lagos - London</p>
                    <div className='FfFlight__duration'>
                        <div className='FfLine'>
                            <div className='FfIconLeft'>
                                <IndicatorIcon />
                            </div>
                            <div className='FfIconRight'>
                                <IndicatorIcon />
                            </div>
                        </div>
                        <p className='FfStartingTime'>21:30</p>
                        <p className='FfStoppingTime'>23:50</p>
                    </div>
                </div>
            </div>
        </div>
        <div className='FfTakeOffFlight FfReturnFlight'>
            <FlightFilterMobileTopBar header='Take Off Flight' />
            <div className='FfTakeOffFlight__flightsGrp'>
                <div className='FfFlight'>
                    <p className='FfFlight__title'>Lagos - London</p>
                    <div className='FfFlight__duration'>
                        <div className='FfLine'>
                            <div className='FfIconLeft'>
                                <IndicatorIcon />
                            </div>
                            <div className='FfIconRight'>
                                <IndicatorIcon />
                            </div>
                        </div>
                        <p className='FfStartingTime'>21:30</p>
                        <p className='FfStoppingTime'>23:50</p>
                    </div>
                </div>
                <div className='FfFlight'>
                    <p className='FfFlight__title'>Lagos - London</p>
                    <div className='FfFlight__duration'>
                        <div className='FfLine'>
                            <div className='FfIconLeft'>
                                <IndicatorIcon />
                            </div>
                            <div className='FfIconRight'>
                                <IndicatorIcon />
                            </div>
                        </div>
                        <p className='FfStartingTime'>21:30</p>
                        <p className='FfStoppingTime'>23:50</p>
                    </div>
                </div>
            </div>
        </div>
        {/* <div className='FfReturnFlight'>
            <FlightFilterMobileTopBar header='Take Off Flight' />
            <div className='FfTakeOffFlight__flightsGrp'>
                <div className='FfFlight'>
                    <p className='FfFlight__title'>Lagos - London</p>
                    <div className='FfFlight__duration'>
                        <div className='FfLine'></div>
                        <p className='FfStartingTime'>21:30</p>
                        <p className='FfStoppingTime'>23:50</p>
                    </div>
                </div>
                <div className='FfFlight'>
                    <p className='FfFlight__title'>Lagos - London</p>
                    <div className='FfFlight__duration'>
                        <div className='FfLine'></div>
                        <p className='FfStartingTime'>21:30</p>
                        <p className='FfStoppingTime'>23:50</p>
                    </div>
                </div>
            </div>
        </div> */}
    </div>
    ) }
    </>
  )
}

export const FlightFilterMobileTopBar = ( {header} ) => {
    return (
            <div className='FfSectionTop'>
                <h3> {header} </h3>
                <div className='FfIcon'>
                    <ResetIcon />
                </div>
            </div>
    )
}