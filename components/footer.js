import Image from "next/image";
import Link from "next/link";
import kenyaAirline from "../public/Kenya-airline-logo_11zon.webp";
import qatarAirways from "../public/Qatar_Airways_logo_11zon.webp";
import royalCarribean from "../public/royal-caribbean_11zon.webp";
import virginAtlantic from "../public/Virgin_Atlantic_logo_11zon.webp";
import group from "../public/Group_1602_11zon.webp";
import britishAirways from "../public/British-airways_11zon.webp";
import emiratesAirline from "../public/emirates-airline.jpg";
import airFrance from "../public/air-france.png";
import turkishAirlines from "../public/turkish-airlines.jpg";
import submitButton from "../public/right-button.webp";
import submitButtonBlue from "../public/icons/arrow.webp";
import twitterIcon from "../public/icons/Twitter.webp";
import instagramIcon from "../public/icons/Instagram.webp";
import facebookIcon from "../public/icons/facebook.webp";
import locationIcon from "../public/location.webp";
import callIcon from "/public/call.webp";
import emailIcon from "/public/Email.webp";
import { Input, Form, Button, message, Row, Col } from "antd";
import { useCreateNewsletterSubscriber } from '../pages/api/apiClient';

const Footer = () => {

  // #region Hooks

  // Subscriber's form
  const [subscriberForm] = Form.useForm();

  // Create newsletter subscriber hook
  const createNewsletterSubscriber = useCreateNewsletterSubscriber();

  // #endregion

  return (
    <>
      <footer>
        <div className="container">
          <div className="container pt-2 d-flex">
            <div className="row airline-container col-sm-4 col-md-12">
              <div className="col">
                {" "}
                <Image src={virginAtlantic} alt={"virgin-atlantic-logo"} />
              </div>
              <div className="col">
                {" "}
                <Image src={qatarAirways} alt={"qatar-airways-logo"} />
              </div>
              <div className="col">
                {" "}
                <Image src={kenyaAirline} alt={"kenya-airline-logo"} />{" "}
              </div>
              <div className="col">
                {" "}
                <Image
                  src={emiratesAirline}
                  alt={"emirates-airline-logo"}
                />{" "}
              </div>
              <div className="col">
                {" "}
                <Image src={britishAirways} alt={"british-airways-logo"} />
              </div>
              <div className="col group">
                {" "}
                <Image src={airFrance} alt={"turkish-airlines-logo"} />{" "}
              </div>
              <div className="col group">
                {" "}
                <Image
                  src={turkishAirlines}
                  alt={"turkish-airlines-logo"}
                />{" "}
              </div>
            </div>
          </div>
          <div className="row subscribe-div">
            <div className="col-12 col-md-5">
              <div className="subscribe-box">
                <Link href="/">
                  <a>
                    <Image
                      src="/247TRAVELS-logo-invert.webp"
                      width={160}
                      height={50}
                      alt={"company Logo"}
                    />{" "}
                  </a>
                </Link>
                <p className="subscribe-text">
                  I would like to receive latest updates on travel deals and
                  services
                </p>
                <div className="subscribe-input-div position-relative">
                  <Form form={subscriberForm}>
                    <Row gutter={4} style={{ alignItems: 'center' }}>
                      <Col span={20}>
                        <Form.Item
                          className="subscribe-input"
                          id="email"
                          name="email"
                          rules={[
                            {
                              type: "email",
                              message: "A valid email address is required",
                            },
                            {
                              required: true,
                              message: "A valid email address is required",
                            },
                          ]}
                        >
                          <Input name="email" placeholder="Enter a valid email address" />
                        </Form.Item>
                      </Col>
                      <Col span={4}>
                        <Button type="primary" onClick={() => {
                          subscriberForm
                            .validateFields()
                            .then(async () => {
                              console.log('Subscriber Credential:', subscriberForm.getFieldsValue());

                              await createNewsletterSubscriber(subscriberForm.getFieldsValue())
                                .then((result) => {
                                  if (result.data.successful) {
                                    message.success('You have successfully subscribed to our newsletters', 3);
                                  } else {
                                    message.error('Newsletter subscription failed! Please try again', [3]);
                                  }
                                })
                                .catch((err) => {
                                  // Log error info
                                  console.error('Create Newsletter Subscriber Error:', err);
                                  // Display error message
                                  message.error('Newsletter subscription failed! Please try again', 3);
                                });
                            })
                            .catch((err) => {
                              // Log the error
                              console.log('Subscriber Form Error:', err);
                            });
                        }
                        }>Submit</Button>
                      </Col>
                    </Row>
                  </Form>
                </div>
                <div className="footer-social-handler">
                  <p className="footer-text">Follow Us</p>
                  <div className="footer-social-icon">
                    <div className="sm-icon-div">
                      <Link href="https://twitter.com/247travels">
                        <a>
                          <Image
                            className="sm-icon"
                            src={twitterIcon}
                            alt={"twitter"}
                            width={20}
                            height={20}
                          />
                        </a>
                      </Link>
                    </div>
                    <div className="sm-icon-div">
                      <Link href="https://www.instagram.com/247travels.com_/">
                        <a>
                          <Image
                            className="sm-icon"
                            src={instagramIcon}
                            alt={"instagram"}
                          />
                        </a>
                      </Link>
                    </div>
                    <div className="sm-icon-div">
                      <Link href="https://www.facebook.com/profile.php?id=100087104714927">
                        <a>
                          <Image
                            className="sm-icon"
                            src={facebookIcon}
                            alt={"facebook"}
                          />
                        </a>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-2">
              <div className="quicklinks-parent">
                <div>
                  <h5 className="quick-links">Quick Links</h5>
                </div>
                <p>
                  <Link href="/">
                    <a className="quick-link"> Home </a>
                  </Link>
                </p>
                <p>
                  <Link href="/about">
                    <a className="quick-link"> About Us </a>
                  </Link>
                </p>
                <p>
                  <Link href="#">
                    <a className="quick-link"> Flight </a>
                  </Link>
                </p>
                <p>
                  <Link href="/contact-us">
                    <a className="quick-link"> Contact Us </a>
                  </Link>
                </p>
                <p>
                  <Link href="/travel-financing">
                    <a className="quick-link"> Travel Financing </a>
                  </Link>
                </p>
              </div>
            </div>

            <div className="col-12 col-md-2">
              <div className="account-parent">
                <div>
                  <h5 className="quick-links">Account</h5>
                </div>
                <p>
                  <Link href="/access-comps/affiliateLogin" as="/affiliate-program">
                    <a className="quick-link"> Login </a>
                  </Link>
                </p>
                <p>
                  <Link href="/access-comps/signup">
                    <a className="quick-link"> Sign Up </a>
                  </Link>
                </p>
                <p>
                  {" "}
                  <Link href="/access-comps/signup_agency">
                    <a className="quick-link"> Affiliates </a>
                  </Link>
                </p>

                <p>
                  {" "}
                  <Link href="/careers">
                    <a className="quick-link"> Careers </a>
                  </Link>
                </p>
              </div>
            </div>

            <div className="col-12 col-md-3">
              <h5 className="quick-links">Contact Us</h5>
              <div className="location">
                <div className="contact-icon-div">
                  <Image src={locationIcon} alt={"location icon"} />
                </div>
                <p className="location-contact">
                  19, Pariola Street, Ogudu G.R.A, Lagos
                </p>
              </div>
              <div className="call">
                <div className="contact-icon-div">
                  <Image src={callIcon} alt={"call icon"} />
                </div>
                <p className="call-contact">+234 705 7000 247</p>
              </div>
              <div className="email">
                <div className="contact-icon-div">
                  <Image src={emailIcon} alt={"email icon"} />
                </div>
                <p className="email-contact"> info@247travels.com</p>
              </div>
            </div>
            <div className="right-reserved">
              <div className="row">
                <div className="col-md-9">
                  <p className="footer-text">
                    &copy; 2022 247travels. All right reserved
                  </p>
                </div>
                <div className="col-md-2">
                  <p className="footer-text">Privacy Policy</p>
                </div>
                <div className="col-md-1 footer-text">Site Map</div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
