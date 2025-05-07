import styles from "../styles/careers.module.css";
import Image from "next/image";
import Head from "next/head";
import { Rate } from "antd";
import Blogpost from "../components/blogpost.js";
import careerBanner from "../public/careerPage-banner.jpg";
import careerWorkspace from "../public/career-workspace.png";
import careerWoman from "../public/career-woman.png";
import API from "./api/apiClient";
import ApiRoutes from "./api/apiRoutes";

export const getStaticProps = async () => {
  // Fetch articles
  const articlesResult = await API.get(ApiRoutes.FetchArticles);

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
      articles,
      dateOfPublish,
    },
  };
};

const Careers = ({ articles, dateOfPublish }) => {
  const JobOpeningsProp = ({ title, note, location }) => (
    <>
      <div className="jobOpenings-text-title mt-3">
        <h3>{title}</h3>
      </div>
      <div className="jobOpenings-paragraph">
        <p style={{ marginBottom: "0" }}>{note}</p>
        <div className="jobOpenings-small">
          <small>{location}</small>
        </div>
      </div>
    </>
  );

  return (
    <>
      <Head>
        <title>247travels | Careers</title>
      </Head>
      <div className="container">
        <div className="career-banner">
          <div className="careerbanner-img">
            <Image src={careerBanner} alt="career-banner" className="w-100" />
          </div>
          <div className="careerbanner-text-wrapper">
            <div className="careerbanner-text">
              <h1>
                Start your <span>dream</span> career with us
              </h1>
              <p>Join our expendable team</p>
            </div>
          </div>
        </div>
      </div>

      {/* WHY JOIN US SECTION */}
      <div className=" container joinUs-div mt-5">
        <div className="joinUs-div-header">
          <h1>WHY JOIN US</h1>
        </div>
        <div className="joinUs-div-text">
          <p>
            247 Travels and Vacation Limited is a Travel Management Company with
            100% Nigerian ownership, the aim of the organization is to provide
            quality and affordable travel services to our teeming Corporate and
            Individual clients.
          </p>

          <p>
            Since obtaining our IATA license in 2013 and issuance of all major
            airlines in 2014, we have shown a broad understanding of the travel
            industry in Nigeria and across the globe. We leverage our
            experienced and dedicated workforce to handle all the travel needs
            of our clients.
          </p>

          <p>
            We are committed to the highest standards and best customer service
            experience. We make our customers&apos; journey seamless by making
            preparations simple, easy and fun. We also package tours and offer
            great deals.
          </p>

          <p>
            In its nine years of operations, the organization has positioned
            itself as a force to be reckoned with through the provision of
            excellent service which has made us one of the leading Travel
            companies in Nigeria.
          </p>

          <p>Vacancies exists in Travel Operations, Sales &amp; Marketing, Account &amp; Administration</p>

          <p>
            Interested candidates should forward their CV and Applications to{" "}
            <span>careers@247travels.com</span>
          </p>
        </div>
      </div>

      {/* CUSTOMER REVIEWS */}
      {/* <div
        className=" container-fluid jobOpenings-div"
      >
        <div className="container">
          <div style={{ height: "auto"}}> 
            <div
              className="jobOpenings-img mt-5"
              style={{ display: "inline-block", width: "20%" }}
            >
              <div>
                <Image src={careerWorkspace} alt="" width={400} height={400} />
              </div>
              <div style={{ textAlign: "end" }}>
                <Image src={careerWoman} alt="" width={150} height={150} />
              </div>
            </div>
            <div
              className="jobOpenings-text"
              style={{ width: "70%", float: "right" }}
            >
              <div className="jobOpenings-header mt-5">
                <h1 style={{ color: "#0034a4", fontWeight: "600" }}>
                  Job Openings
                </h1>
              </div>
              <JobOpeningsProp
                title="Accounting Officer"
                location="Location: Lagos, Nigeria"
                note="Software engineers at Microsoft are passionate about 
                building technologies that make the world a better place. 
                At Microsoft, you will collaborate with others to solve problems 
                and build some of the world's most advanced services and devices..."
              />
              <JobOpeningsProp
                title="Accounting Officer"
                location="Location: Lagos, Nigeria"
                note="Software engineers at Microsoft are passionate about 
                building technologies that make the world a better place. 
                At Microsoft, you will collaborate with others to solve problems 
                and build some of the world's most advanced services and devices..."
              />
            </div>
          </div>
        </div>

        <div className="mt-5 pb-5">
          <div className="container ">
            <h3 className="review-header">Customer Reviews</h3>
          </div>
          <div className=" review container">
            <div className="review-box mb-2">
              <h5>
                Travelling with 247travels was the best experience so far. Their
                customer experience is excellent and processing my flight was
                very easy. I will choose 247travels whenever I want to travel
              </h5>
              <div className="rating-icon">
                <Rate allowClear={false} defaultValue={3} />
              </div>
            </div>

            <h3 className="reviewers">Benjamin A-canoe</h3>
            <h4 className="reviewers">Business Manager, Mercedes Service</h4>
          </div>
        </div>
      </div> */}
      <Blogpost articles={articles} dateOfPublish={dateOfPublish} />
    </>
  );
};

export default Careers;
