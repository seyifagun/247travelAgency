import React from "react";
import Image from "next/image";
import HotDeals from "../components/hotDeals.js";
import Blogpost from "../components/blogpost.js";
import DeveloperNavbar from "../components/developerNavbarr";
import { Rate } from 'antd';
import studentFlightTravels from "../public/sudent-flight-deals.webp";


const B2bIndex = () => {
  return (
    <>
      <div className="container">
        <DeveloperNavbar />

        <div className="container mt-5">
        <Image src={studentFlightTravels} alt={"student-flight-travels"} />
      </div>
        {/* <HotDeals />
        <div className="container ">
              <h3 className="review-header">Customer Reviews</h3>
        </div> */}
        {/* <div className=" review container">
          <div className="review-box mb-2">
            <h5>
              Travelling with 247travels was the best experience so far. Their
              customer experience is excellent and processing my flight was very
              easy. I will choose 247travels whenever I want to travel
            </h5>
            <div className="rating-icon">
              <Rate allowClear={false} defaultValue={3} />
            </div>
          </div>

          <h3 className="reviewers">Benjamin A-canoe</h3>
          <h4 className="reviewers">Business Manager, Mercedes Service</h4>
        </div> */}
        <Blogpost />
      </div>
    </>
  );
};

export default B2bIndex;
