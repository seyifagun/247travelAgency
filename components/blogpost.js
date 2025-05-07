import { React, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Image from "next/image";
import Link from "next/link";
import { Card, List, Button } from "antd";
import canoePaddle from "../public/canoe-paddling.webp";
import waterFall from "../public/waterfall.webp";
import icelandWaterfall from "../public/iceland-waterfall.webp";
import { fetchArticles } from "../redux/actions/flightActions";
import { useFetchArticles } from "../pages/api/apiClient";

const Blogpost = ({ articles, dateOfPublish }) => {
  //Assign async fetchArticle function to useCreateArticle hook
  //   const fetchArticles = useFetchArticles();

  //REGION START

  //Create state
  const [updateArticles, setUpdateArticles] = useState([]);


  //REGION END

  return (
    <>
      <div className="container ">
        <h3 className="blog-header">Blog Post</h3>
      </div>
      <div className=" blog-parent container mb-3 mt-3">
        <div className="row">
          {/* blog card */}
          {articles.map((article, index) => {
            return (
              <BlogComponent
                key={index}
                title={article.title}
                imageUrl={article.imageUrl}
                summary={article.summary}
                datePublished={article.datePublished}
                author={article.author}
                link={article.link}
                dateOfPublish={dateOfPublish}
              />
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Blogpost;

export const BlogComponent = ({
  title,
  imageUrl,
  author,
  summary,
  link,
  datePublished,
}) => {
  const blogDate = new Date(datePublished);
  const today = new Date();
  let articleMonth = blogDate.toLocaleString("en-NG", { month: "short" });
  let articleDay = blogDate.getDate();
  let articleYear = blogDate.getFullYear();
  const currentYear = new Date().getFullYear();
  // console.log('DAy:', articleDay);
  // console.log('Blog Date:', blogDate);

  const truncate = (input, ellipsis = "...") =>
    input.length > 100 ? `${input.substr(0, 90) + ellipsis}` : input;

  return (
    <div className="col-md-12 col-lg-4">
      <div className="blog-card position-relative">
        <div className="card blog-post-card">
          {/* CARD-TOP */}
          <div className="card-top">
            <div className="date-wrapper position-absolute">
              <p
                style={{
                  padding: "0rem",
                  backgroundColor: "#0043a4",
                  fontWeight: "600",
                  color: "white",
                }}
              >
                {articleMonth}
              </p>
              <p style={{ fontWeight: "700", fontSize: "25px" }}>
                {articleDay}
              </p>
              <p>{articleYear}</p>
            </div>
            {/*  */}
            <div className="container_">
              <Image
                src={imageUrl}
                className="card-img-top"
                alt={"waterfall-vacation"}
                width={400}
                height={250}
              />
              <div className="link-popup">
                <div className="card-bloglink">
                  <Link href={link}>
                    <a className="cardblog-anchortag">
                      <small>Read More</small>
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="blog-body-section">
            {/* CARD-BODY */}
            <div className="card-body">
              <h5 className="card-title">
                <Link href={link}>
                  <a className="link-blog" target="_blank">
                    {title}
                  </a>
                </Link>
              </h5>
              <div className="card-subcontent">
                <p className="card-text">
                  <small className="text-muted">{author}</small>
                </p>
                <p className="card-text">
                  <small className="text-muted">{`${new Date(
                    datePublished
                  ).toLocaleString("default", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}`}</small>
                </p>
              </div>
              <hr />
              <p className="card-content">{truncate(`${summary}`)}</p>
              {/* {console.log(summary)} */}
            </div>
            {/* CARD-BTN */}
            <div className="card-btn">
              <Link href={link}>
                <a className="btn btn-primary-custom" target="_blank">
                  Read More
                </a>
              </Link>
            </div>
          </div>
          {/*  */}
        </div>
      </div>
    </div>
  );
};
