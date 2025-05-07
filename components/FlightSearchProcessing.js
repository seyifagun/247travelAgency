import React from 'react';
import { Modal, Spin } from 'antd';
import Image from 'next/image';
import aeroplaneImg from '../public/icons/aeroplaneImg.png';

/**
 * Modal view component flagging flight search process
 * @param {*} param0 Components props
 * @returns Modal component view for flagging flight search process
 */
function FlightSearchProcessing({ flightSearchProcessingModalVisibility,
    originLocation,
    originDestination,
    departureDate,
    arrivalDate,
    flightClass,
    totalPassengers }) {

    return (
        <>
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
                <p className="flightModalTitle">
                    <strong>Loading the Best Flights</strong>
                </p>
                <div className="row row-custom">
                    <div
                        className="col-4 col-sm-4 flightFrom"
                        style={{ display: "flex", flexDirection: "column" }}
                    >
                        <p className="flightStatus">Flight</p>
                        <p className="flightStatus">From:</p>
                        <p className="flightModalCode" style={{ textAlign: "start" }}>{`${originLocation
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
                        <p className="flightModalCode" style={{ textAlign: "end" }}>{`${originDestination
                            }`}</p>
                    </div>
                </div>
                <p className="flightModalTitle">
                    {`${departureDate} `}
                    <span> - </span>
                    {`${arrivalDate}`}
                </p>
                <p className="flightModalTitle">
                    {totalPassengers} {totalPassengers > 1 ? 'Passnegers' : 'Passenger'}
                </p>
                <p className="flightModalTitle">
                    {flightClass}
                </p>

                <div>
                    <center>
                        <Spin style={{ color: "rgba(252, 166, 43, 0.8)" }} />
                    </center>
                </div>
            </Modal>
        </>
    )
}

export default FlightSearchProcessing