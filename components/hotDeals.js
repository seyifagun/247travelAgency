import React from "react";
import "../styles/Home.module.css";
import Image from "next/image";
import AffordabletravelImg from "../public/affordable-travel.webp";
import DedicatedImg from "../public/dedicated-workforce-.webp";
import BestcustomerImg from "../public/best-customer-service.webp";
import LagosLondon from "../public/lagos-to-London.webp";
import LagosNewyork from "../public/Lagos-to-Newyork_1.webp";
import LagosDubai from "../public/Lagos-to-Dubai.webp";
import LagLondon from "../public/lagos-to-london2_1.webp";
import timeIcon from "../public/Time.webp";
import britishAirline from "../public/British-airways-w.webp";

const HotDeals = () => {
  return (
    <>
      <div className="container-fluid hotdeals-div">
        <div className="container">
          <div className="row deal-card-container">
            <div className="col-md-12 col-lg-4">
              <div className="deals-card">
                <Image src={AffordabletravelImg} alt={"travel-icon"} />
                <h4>Affordable Travel Services</h4>
              </div>
            </div>
            <div className="col-md-12 col-lg-4">
              <div className="deals-card">
                <div>
                  <Image src={DedicatedImg} alt={"dedicated-icon"} />
                </div>
                <div>
                  <h4>Dedicated Workforce</h4>
                </div>
              </div>
            </div>
            <div className="col-md-12 col-lg-4">
              <div className="deals-card">
                <Image src={BestcustomerImg} alt={"customer-icon"} />
                <h4>Best Customer Service Experience</h4>
              </div>
            </div>
          </div>
        </div>

        {/*  */}

        <div className="container hotdeals-div">
          <h3 className="deals-header">Hot Deals</h3>
        </div>
        <div className="container">
          <div className="row travel-deal-container">
            <div className="col-sm-12 col-md-3">
              <div className="travel-card">
                <Image src={LagosLondon} alt={"lagos-london-hot-deal"} />
                <div className="inner-card-info">
                  <Image src={timeIcon} alt={"travel-time-img"} />
                  <h5>Oct 1 - Jun 25</h5>
                </div>
                <div className="booking-card-info">
                  <h5>Lagos-London</h5>
                  <h3>N252, 900</h3>
                  <p>(1 Adult)</p>
                </div>
                <div className="booking-card-logo">
                  {" "}
                  <Image src={britishAirline} alt={"british-airline"} />
                </div>
              </div>
            </div>

            <div className="col-sm-12 col-md-3">
              <div className="travel-card">
                <Image src={LagosNewyork} alt={"lagos-newyork-hot-deal"} />
                <div className="inner-card-info">
                  <Image src={timeIcon} alt={"travel-time-img"} />
                  <h5>Dec 10 - Dec 16</h5>
                </div>
                <div className="booking-card-info">
                  <h5>Lagos-Las Vegas</h5>
                  <h3>N490, 000</h3>
                  <p>(1 Adult)</p>
                </div>
                <div className="booking-card-logo">
                  {" "}
                  <Image src={britishAirline} alt={"british-airline"} />
                </div>
              </div>
            </div>

            <div className="col-sm-12 col-md-3">
              <div className="travel-card">
                <Image src={LagosDubai} alt={"lagos-dubai-hot-deal"} />
                <div className="inner-card-info">
                  <Image src={timeIcon} alt={"travel-time-img"} />
                  <h5>Dec 10 - Dec 16</h5>
                </div>
                <div className="booking-card-info">
                  <h5>Lagos-Dubai</h5>
                  <h3>N392, 800</h3>
                  <p>(1 Adult)</p>
                </div>
                <div className="booking-card-logo">
                  {" "}
                  <Image src={britishAirline} alt={"british-airline"} />
                </div>
              </div>
            </div>

            <div className="col-sm-12 col-md-3">
              <div className="travel-card">
                <Image src={LagLondon} alt={"lagos-london-hot-deal"} />
                <div className="inner-card-info">
                  <Image src={timeIcon} alt={"travel-time-img"} />
                  <h5>Dec 10 - Dec 16</h5>
                </div>
                <div className="booking-card-info">
                  <h5>Lagos-Malta</h5>
                  <h3>N300, 500</h3>
                  <p>(1 Adult)</p>
                </div>
                <div className="booking-card-logo">
                  {" "}
                  <Image src={britishAirline} alt={"british-airline"} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HotDeals;
