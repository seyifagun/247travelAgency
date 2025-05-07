import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import "../styles/Home.module.css";
import SearchPanel from "../components/SearchPanel";
import Blogpost from "../components/blogpost.js";
import mobileStudentFlightTravels1 from "../public/banner/website-ad-banner-mobile1.jpg";
import mobileStudentFlightTravels2 from "../public/banner/website-ad-banner-mobile2.jpg";
import mobileStudentFlightTravels3 from "../public/banner/website-ad-banner-mobile3.jpg";
import AwardForExcellenceMobile from "../public/banner/247-award-banner-mobile.webp";
import HotDeals from "../components/hotDeals.js";
import { Tabs as TabsAnt, Form, Carousel } from "antd";
import Oneway from "../components/custom-comps/Oneway.js";
import Multicity from "../components/custom-comps/Multicity.js";
import Roundtrip from "../components/custom-comps/Roundtrip.js";
import MultiCityTrial from "../components/custom-comps/MultiCityTrial.js";
import API from "./api/apiClient";
import ApiRoutes from "./api/apiRoutes";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
// import onewayStudentBanner from "../public/banner/oneway-content-banner.jpg";
import AllInOne from "../public/banner/all-in-one.webp";
import TravelLater from "../public/banner/travel-later.webp";
import TravelPlans from "../public/banner/travel-plans.webp";
import AdBanner from "../public/banner/website-ad-banner.webp";
import AdBannerMobile from "../public/banner/website-ad-banner-mobile.webp";
import AwardForExcellence from "../public/banner/247-award-banner.webp";
import {
  Link as LinkDOM,
  useLocation,
  BrowserRouter as Router,
} from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAirlines } from "../redux/actions/flightActions";
import CarouselParent, { CarouselItem, EachImage } from "../components/Carousel/Carousel";

const { TabPane } = TabsAnt;

// **********************************************************************************************

const contentStyle = {
  height: "160px",
  color: "#fff",
  lineHeight: "160px",
  textAlign: "center",
  background: "#364d79",
};

// from https://react-slick.neostack.com/docs/example/custom-arrows
const SampleNextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        color: "black",
        fontSize: "15px",
        lineHeight: "1.5715",
      }}
      onClick={onClick}
    >
      <RightOutlined />
    </div>
  );
};

const SamplePrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        color: "black",
        fontSize: "15px",
        lineHeight: "1.5715",
      }}
      onClick={onClick}
    >
      <LeftOutlined />
    </div>
  );
};

const settings = {
  nextArrow: <SampleNextArrow />,
  prevArrow: <SamplePrevArrow />,
};

// ***********************************************************************

export async function getServerSideProps(context) {
  // Fetch airports
  const result = await API.get(ApiRoutes.FetchAirports);
  // Fetch articles
  const articlesResult = await API.get(ApiRoutes.FetchArticles);
  // Fetch airlines
  const airlinesResult = await API.get(ApiRoutes.FetchAirlines);

  // Extract airports data
  let airports = result.data.response;

  // Extract airlines data
  let airlines = airlinesResult.data.response;

  // Extract articles data
  let articles = articlesResult.data.response;

  const dateOfPublish = new Date(articles[0]?.dateCreated).toLocaleString(
    "default",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );

  return {
    props: {
      airports: airports,
      airlines: airlines,
      articles: articles,
      dateOfPublish,
    },
  };
};

export default function Home({ airports, articles, dateOfPublish, airlines }) {
  // #region Hooks

  // The next router hook
  const router = useRouter();

  const dispatch = useDispatch();

  // #endregion

  // Persist airlines
  dispatch(setAirlines(airlines));

  // Initialize and set the media query for mobile
  const [onMobile, setOnMobile] = useState(window.matchMedia("(max-width: 768px)").matches);

  useEffect(() => {
    // Set the media query for mobile
    window.matchMedia("(max-width: 768px)").addEventListener('change', e => {
      setOnMobile(e.matches);
    });
  }, [onMobile]);


  // const contentStyle = {
  //   width: '100%',
  //   objectPosition: 'cover',
  //   border: '3px solid #000'
  // };

  const [currentSliderNum, setCurrentSliderNum] = useState(0);
  useEffect(() => {
    if (currentSliderNum === 0) {
      setTimeout(() => {
        setCurrentSliderNum(33.5)
      }, 3000);
    }
    if (currentSliderNum === 33.5) {
      setTimeout(() => {
        setCurrentSliderNum(67)
      }, 3000);
    }
    if (currentSliderNum === 67) {
      setTimeout(() => {
        setCurrentSliderNum(0)
      }, 3000);
    }
  }, [currentSliderNum]);


  return (
    <>
      <Head>
        <title>247Travels | Home</title>
        <meta name="keywords" content="247Travels" />
      </Head>

      <SearchPanel airports={airports} />

      {/* <div className="flightsearch-parent">
        <div className=" flightsearch-wrapper container">
          <div className="flightsearch-div">
            <div className="trip-type">
              <div className="container booksection-field">
                <div className="container booksection-inner-field">
                  <div className="trip-menu">
                    <TabsAnt defaultActiveKey="2">
                      <TabPane
                        tab={<span>One Way</span>}
                        key="1"
                        disabled={false}
                      >
                        <Oneway airports={airports} />
                      </TabPane>
                      
                      <TabPane
                        tab={<span>Round Trip</span>}
                        key="2"
                        className="indexpage-tab-menu"
                      >
                        <Roundtrip airports={airports} />
                      </TabPane>{" "}
                      <TabPane
                        tab={<span>Multi City</span>}
                        key="3"
                      >
                        <MultiCityTrial airports={airports} />
                      </TabPane>
                    </TabsAnt>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}


      <div style={{ display: "none" }}>
        <Link href="/onelineForm" passHref>
          link to oneLineForm
        </Link>
      </div>
      
      {/* desktop view */}
      {!onMobile && (
        <Carousel autoplay className="container" arrows {...settings} style={{paddingTop:'4rem'}}>

          <Image
            src={AdBanner}
            alt={"all-in-one-offer"}
            className="callToActionDisplay"
          />

          <Link href="https://blog.247travels.com" passHref={true}>
            <Image
              src={AwardForExcellence}
              alt={"award-for-excellence"}
              style={{ minHeight: '180px' }}
            />
          </Link>

          <Image
            src={AllInOne}
            alt={"all-in-one-offer"}
            onClick={() => {
              router.push("call-to-action?actionId=All in One Offer");
            }}
            className="callToActionDisplay"
          />

          <Image
            src={TravelLater}
            alt={"travel-later"}
            onClick={() => {
              router.push("call-to-action?actionId=Travel Later Offer");
            }}
            className="callToActionDisplay"
          />

          <Image
            src={TravelPlans}
            alt={"travel-plans"}
            onClick={() => {
              router.push("call-to-action?actionId=Travel PLans Offer");
            }}
            className="callToActionDisplay"
          />
        </Carousel>
      )}

      {/* mobile view */}
      {onMobile && (
         <Carousel autoplay style={{paddingTop:'2rem'}}>

          <Image
            src={AdBannerMobile}
            alt={"all-in-one-offer"}
            className="callToActionDisplay"
          />

         <Link href="https://blog.247travels.com" passHref={true}>
           <Image
             src={AwardForExcellence}
             alt={"award-for-excellence"}
             style={{ minHeight: '180px' }}
           />
         </Link>

         <Image
           src={AllInOne}
           alt={"all-in-one-offer"}
           style={{ minHeight: '180px' }}
           onClick={() => {
             router.push("call-to-action?actionId=All in One Offer");
           }}
           className="callToActionDisplay"
         />

         <Image
           src={TravelLater}
           alt={"travel-later"}
           style={{ minHeight: '180px' }}
           onClick={() => {
             router.push("call-to-action?actionId=Travel Later Offer");
           }}
           className="callToActionDisplay"
         />

         <Image
           src={TravelPlans}
           alt={"travel-plans"}
           style={{ minHeight: '180px' }}
           onClick={() => {
             router.push("call-to-action?actionId=Travel PLans Offer");
           }}
           className="callToActionDisplay"
         />
       </Carousel>
        // <CarouselParent>
        //   <CarouselItem>
        //     <EachImage>
        //       <Link href="https://blog.247travels.com" passHref={true}>
        //         <Image
        //           src={AwardForExcellenceMobile}
        //           alt={"award-for-excellence"}
        //           style={{ minHeight: '180px' }}
        //         />
        //       </Link>
        //     </EachImage>
        //     <EachImage>
        //       <Image
        //         src={mobileStudentFlightTravels2}
        //         alt={"student-flight-travels"}
        //         style={{ minHeight: '180px' }}
        //         onClick={() => {
        //           router.push("call-to-action?actionId=Travel Later Offer");
        //         }}
        //       />
        //     </EachImage>
        //     <EachImage>
        //       <Image
        //         src={mobileStudentFlightTravels3}
        //         alt={"student-flight-travels"}
        //         style={{ minHeight: '180px' }}
        //         onClick={() => {
        //           router.push("call-to-action?actionId=Travel Plans Offer");
        //         }}
        //       />
        //     </EachImage>
        //     <EachImage>
        //       <Image
        //         src={mobileStudentFlightTravels1}
        //         alt={"student-flight-travels"}
        //         style={{ minHeight: '180px' }}
        //         onClick={() => {
        //           router.push("call-to-action?actionId=All in One Offer");
        //         }}
        //       />
        //     </EachImage>
        //   </CarouselItem>
        // </CarouselParent>
      )}

      {/*  */}
      <Blogpost articles={articles} dateOfPublish={dateOfPublish} />
    </>
  );
}
