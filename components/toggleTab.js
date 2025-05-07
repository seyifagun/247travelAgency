import React, { useState, useRef } from "react";
import styles from "../styles/BookPage.module.css";
import Image from "next/image";
import Link from "next/link";
import { useSelector } from "react-redux";
import { Button as ButtonAnt, Tabs, Table, Descriptions } from "antd";
import BookingSummary from "../components/BookingSummary";
import { useEffect } from "react";
import { useInitializePayment } from "../pages/api/apiClient";
import ApiRoutes from "../pages/api/apiRoutes";
import API from "../pages/api/apiClient";
import { useRouter } from "next/router";

import flightTo from "../public/icons/take-off.png";
import baggageImg from "../public/icons/baggage.png";
import flightRules from "../public/icons/Flight-rules.png";

import FlightDetails from '../components/FlightDetails';
//   const [displayDetails, setDisplayDetails] = useState(false);
//   const HandleChange = () => {
//       setDisplayDetails(true);
//   }

function ToggleTabs() {

  const [showTab1, setShowTab1] = useState(false);

  const onToggle1 = () => {
    setShowTab1(!showTab1);
  };
  const [showTab2, setShowTab2] = useState(true);

  const onToggle2 = () => {
    setShowTab2(!showTab2);
  };
  const [showTab3, setShowTab3] = useState(true);

  const onToggle3 = () => {
    setShowTab3(!showTab3);
  };

  const [toggleState, setToggleState] = useState(1);

  const toggleTab = (index) => {
    setToggleState(index);
  };



  return (
    <div className="container">
      <div className="bloc-tabs">
        <button
          className={toggleState === 1 ? "toggle-tabs active-toggle-tabs " : "toggle-tabs"}
          onClick={() => toggleTab(1)}>
            <button onClick={onToggle1} className='toggletab-icon'><span className="tab-icon"><Image src={flightTo} alt={""} /> &nbsp; Flight Details</span></button>
        </button>
        <button
          className={toggleState === 2 ? "toggle-tabs active-toggle-tabs" : "toggle-tabs"}
          onClick={() => toggleTab(2)}>
            <button onClick={onToggle2} className='toggletab-icon'><span className="tab-icon"><Image src={baggageImg} alt={""} /> &nbsp; Baggage Info</span></button>   
        </button>
        <button
          className={toggleState === 3 ? "toggle-tabs active-toggle-tabs" : "toggle-tabs"}
          onClick={() => toggleTab(3)}>
          <button onClick={onToggle3} className='toggletab-icon'><span className="tab-icon"><Image src={flightRules} alt={""} /> &nbsp; Flight Rules</span> </button>   
        </button>
      </div>

      <div className="content-tabs mt-3">
        
          <div className={toggleState === 1 ? "content-toggle  active-content" : "content-toggle"}>
            {/* {showTab1 ? ( <FlightDetails flightOffer={item} /> ) : (<></>)} */}
          </div>
        
        {
          showTab2 ? <div className={toggleState === 2 ? "content-toggle  active-content" : "content-toggle"}>
          Pay with nothing.... sapa nice one
          </div> : null
        }
        {
          showTab3 ? <div className={toggleState === 3 ? "content-toggle  active-content" : "content-toggle"}>
            Pay with Pay Fi
          </div> : null
        }
      </div>

    </div>
  );
}

export default ToggleTabs;
