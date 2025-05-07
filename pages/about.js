import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import Blogpost from "../components/blogpost.js";
import contactBanner from "../public/About-us-banner.webp";
import AffordabletravelImg from "../public/affordable-travel.webp";
import DedicatedImg from "../public/dedicated-workforce-.webp";
import BestcustomerImg from "../public/best-customer-service.webp";
import aboutusImg from "../public/aboutus-content-img.webp";
import ratingIcon from "../public/Rating.webp";
import studentFlightTravels from "../public/banner/banner.webp";
import API from "./api/apiClient";
import ApiRoutes from "./api/apiRoutes";

export const getStaticProps = async () => {
  const result = await API.get(ApiRoutes.FetchAirports);

  //get promise (resolve) form API call and assign to a variable
  const articlesResult = await API.get(ApiRoutes.FetchArticles);
  // console.log("data type for result:",typeof(articlesResult));
  // console.log("Result:", articlesResult)

  //   let airports = result.data.response;

  //data obtained
  let articles = articlesResult.data.response;
  // console.log("Result for articles:", articles)
  // console.log("Result for articles:", articles[0].dateCreated)
  const dateOfPublish = new Date(articles[0]?.dateCreated).toLocaleString(
    "default",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );
  //   console.log("Format Date:", dateOfPublish);

  return {
    props: { articles: articles, dateOfPublish },
  };
};

const About = ({ articles, dateOfPublish }) => {
  return (
    <>
      <Head>
        <title>247Travels | About Us</title>
      </Head>

      <div>
        <div className="container">
          <div className="contactus-banner-container">
            <Image src={contactBanner} alt={"contactus-banner"} />
          </div>
        </div>
        <div className="container">
          <div className="about-247">
            <h3 className="about247-heading">
              An Immersive Travel Experience You will Never Forget
            </h3>
            <p className="about247-p">
              At 247travels, we carefully create luxury enriching travel
              experiences. We inspire you to see, embrace adventures as they
              come and to share new and meaningful experiences with friends and
              loved ones.
            </p>
          </div>
        </div>
        <div className="container">
          <div className="about247-card-wrapper">
            <div className="row">
              <div className="col-lg-4">
                <div className="about247-card card-1 mb-2">
                  <Image src={AffordabletravelImg} alt={"travelling-img"} />
                  <h5>Affordable Travel Services</h5>
                  <p>
                    Our aim is to provide quality and affordable travel services
                    to our teeming corporate and Individual clients.
                  </p>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="about247-card-unique mb-2">
                  <Image src={DedicatedImg} alt={"workforce-img"} />
                  <h5>Dedicated Workforce</h5>
                  <p>
                    Our workforce is dedicated and diverse. We are dedicated to
                    giving you a satisfied trip round the world.
                  </p>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="about247-card mb-2">
                  <Image src={BestcustomerImg} alt={"customer-img"} />
                  <h5>Best Customer Service Experience</h5>
                  <p>
                    We are dedicated to making your journey seamless by making
                    preparations simple, easy and fun.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="about247-info-wrapper">
            <div className="about247-img">
              <Image
                src={aboutusImg}
                alt={"about247-img"}
                width={400}
                height={400}
              />
            </div>
            <p>
              247 Travels and Vacation Limited is a Travel Management Company
              with 100% Nigerian ownership, the aim of the organisation is to
              provide quality and affordable travel services to our teeming
              Corporate and Individual clients.
            </p>

            <p>
              Since obtaining our IATA license in 2013 and issuance of all major
              airlines in 2014, we have shown a broad understanding of the
              travel industry in Nigeria and across the globe. We leverage on
              our experienced and dedicated workforce to handle all the travel
              needs of our clients.
            </p>

            <p>
              We are committed to the highest standards and best customer
              service experience. We make your journey seamless by making
              preparations simple, easy and fun. We also package tours and offer
              great deals.
            </p>

            <p>
              In its nine years of operations, the organisation has positioned
              itself as a force to be reckoned with through the provision of
              excellent service which has made us one of the leading Travel
              companies Nigeria
            </p>
          </div>
        </div>

        {/*  */}

        {/* <div className="container ">
          <h3 className="review-header">Customer Reviews</h3>
      </div>
      <div className=" review container">
        <div className="review-box mb-2">
          <h5>Travelling with 247travels was the best experience so far. 
            Their customer experience is excellent and processing my flight was very easy.
            I will choose 247travels whenever I want to travel</h5>
            <div className="rating-icon"><Image src={ratingIcon} alt={"rating-img"} /></div>
        </div>
        
          <h3 className="reviewers">Benjamin A-canoe</h3>
          <h4 className="reviewers">Business Manager, Mercedes Service</h4>
      </div> */}

        {/* ******CREATE A COMPONENT  FOR THE CUSTOMER REVIEW AND BLOG POST***** */}

        <div className="container">
          <Image src={studentFlightTravels} alt={"student-flight-travels"} />
        </div>

        <Blogpost articles={articles} dateOfPublish={dateOfPublish} />
      </div>
    </>
  );
};

export default About;
