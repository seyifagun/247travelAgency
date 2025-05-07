import { react, useState, useRef } from "react";
import Form from "react-bootstrap/Form";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import { DropdownButton } from "react-bootstrap";
import { Dropdown } from "react-bootstrap";

import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import usernameIcon from "../../public/icons/username.webp";
import passwordIcon from "../../public/icons/password.png";
import visibilityIcon from "../../public/icons/visibility.webp";
import contactIcon from "../../public/icons/contact.webp";
import { useSignUp } from "../../pages/api/apiClient";
import { Input, Form as FormAnt, Select, Row, Col } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { ToastComponent } from "@syncfusion/ej2-react-notifications";
import Spinner from "../../components/Spinner";

const { Option } = Select;

const Signup_Agency = () => {
  const toastInstance = useRef(null);
  const router = useRouter();
  const [AffiliateSignUp] = FormAnt.useForm();
  const [errorMsgCondition, setErrorMsgCondition] = useState(false);
  const [successMsgCondition, setSuccessMsgCondition] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [spinner, setSpinner] = useState(false);

  const signUp = useSignUp();

  function displaySuccessMessageNotification(title, content) {
    toastInstance.current.title = title;
    toastInstance.current.content = content;
    toastInstance.current.cssClass = "e-success";
    toastInstance.current.show();
  }

  let errorMessage;

  const handleAffiliateSignUp = () => {
    // console.log("flightRequest", AffiliateSignUp.getFieldsValue());
    // return;
    AffiliateSignUp.validateFields()
      .then(async () => {
        setSpinner(true);
        // Display flight search processing modal
        // setFlightSearchProcessingModalVisibility(true);
        // return;
        await signUp(AffiliateSignUp.getFieldsValue())
          .then((response) => {
            // replace the text on the button with spinner
            // console.log("Caught Resp:", response);
            // setFlightSearchErrorModalVisibility(true);
            if (response.successful == false) {
              setSpinner(false);
              setErrorMsgCondition(true);
              // errorMessage = response.errorMessage;
              errorMessage = response.errorMessage;
              console.log("Error message: ", errorMessage);
              return setErrorMsg(errorMessage);
              // dispatch(deleteLoginCredentials());
            } else {
              setSpinner(false);
              successMessage = "Password has been changed successfully";
              setSuccessMsg(successMessage);
              return setTimeout(() => router.push("/check-verification"), 2000);
            }
            // displaySuccessMessageNotification(
            //   "Success",
            //   "Your account has been registered. You will be redirected to the login page."
            // );
            // display success message for a minute or two before redirect

            // setFlightSearchProcessingModalVisibility(false);
          })
          .catch((error) => {
            setSpinner(false);
            // setFlightSearchProcessingModalVisibility(false);
            console.log("Caught Error 2:", error);
            // TODO: Pop up a dialog
            // setFlightSearchErrorModalVisibility(true);
          });
        // console.log("All fields values: " + flightSearchForm.getFieldsValue());
      })
      .catch((err) => {
        console.error("Form Error:", err);
      });
    // console.log(errorMessage);
    // return errorMessage;
  };
  return (
    <>
      <div className="row mt-5 mb-5">
        <div className="col-md-4 card m-auto shadow-lg">
          <div className="card-body custom-made p-5">
            <div className="p-4">
              <div className="edit-profile-form">
                <span
                  style={{
                    color: "#0043a4",
                    fontWeight: "700",
                    fontSize: "20px",
                  }}
                ></span>
                <span
                  style={{
                    color: "#0043a4",
                    fontWeight: "700",
                    fontSize: "20px",
                  }}
                >
                  {" "}
                  Sign Up for an account
                </span>
              </div>
            </div>
            <div>
              {errorMsgCondition && (
                <div
                  className="alert alert-danger"
                  style={{ textAlign: "center" }}
                >
                  {errorMsg}
                </div>
              )}
            </div>
            <FormAnt form={AffiliateSignUp}>
              {/* BUSINESS NAME*/}
              <div className="form-group input-field p-4">
                <label
                  htmlFor="Sign Up"
                  style={{ color: "#0043a4" }}
                  className="pb-2"
                >
                  Business Name
                </label>
                <FormAnt.Item
                  name="business_name"
                  rules={[{ required: true, message: "Enter Business Name" }]}
                >
                  <Input
                    name="business_name"
                    className="form-control affiliate-input custom-input"
                    placeholder="Business Name"
                  />
                </FormAnt.Item>
              </div>
              {/* BUSINESS ADDRESS*/}
              <div className="form-group input-field p-4">
                <label
                  htmlFor="Sign Up"
                  style={{ color: "#0043a4" }}
                  className="pb-2"
                >
                  Business Address
                </label>
                <FormAnt.Item
                  name="business_address"
                  rules={[
                    { required: true, message: "Enter Business Address" },
                  ]}
                >
                  <Input
                    name="business_address"
                    className="form-control affiliate-input custom-input"
                    placeholder="Business Address"
                  />
                </FormAnt.Item>
              </div>
              {/* NAME OF CUSTOMER */}

              {/* <div className="row form-group input-field p-2">
                <div className="col-sm-12 col-xl-7 form-group input-field">
                  <div className="form-group input-field name-title-field">
                    <label
                      htmlFor="Sign Up"
                      style={{ color: "#0043a4" }}
                      className="pb-2"
                    >
                      First Name
                    </label>
                    <FormAnt.Item
                      name="username"
                      rules={[
                        { required: true, message: "Enter your First Name!" },
                      ]}
                    >
                      <Input
                        name="username"
                        className="form-control affiliate-input custom-input"
                        placeholder="Enter First Name"
                      />
                    </FormAnt.Item>
                  </div>
                </div>
              </div> */}
              <div className="row form-group input-field p-2">
                <div className="col-sm-12 col-xl-7 form-group input-field">
                  <div className="form-group input-field name-title-field">
                    <label
                      htmlFor="Sign Up"
                      style={{ color: "#0043a4" }}
                      className="pb-2"
                    >
                      Surname
                    </label>
                    <Row>
                      <Col span={10}>
                        <FormAnt.Item
                          name="title"
                          rules={[
                            {
                              required: true,
                              message: "Please input a Title",
                            },
                          ]}
                        >
                          <Select
                            defaultValue="Title"
                            placeholder="Title"
                            name="title"
                            className="form-control affiliate-input custom-input p-2"
                          >
                            <Option value="Mr">Mr</Option>
                            <Option value="Mrs">Mrs</Option>
                            <Option value="Miss">Miss</Option>
                            <Option value="Ms">Ms</Option>
                            <Option value="Master">Master</Option>
                            <Option value="Dr">Dr</Option>
                            <Option value="Sir">Sir</Option>
                            <Option value="Chief">Chief</Option>
                            <Option value="Alh">Alh</Option>
                            <Option value="Sen">Sen</Option>
                            <Option value="Pst">Pst</Option>
                            <Option value="HRH">HRH</Option>
                          </Select>
                        </FormAnt.Item>
                      </Col>
                      <Col span={14}>
                        <FormAnt.Item
                          name="surname"
                          rules={[
                            {
                              required: true,
                              message: "Please input your Surname",
                            },
                          ]}
                          // noStyle={true}
                        >
                          <Input
                            defaultValue=""
                            placeholder="Enter Surname"
                            name="surname"
                            className="form-control affiliate-input custom-input p-2"
                          />
                        </FormAnt.Item>
                      </Col>
                    </Row>
                  </div>
                </div>
                <div className="col-sm-12 col-xl-5">
                  <div className="form-group input-field name-firstname-field ">
                    <label
                      htmlFor="Sign Up"
                      style={{ color: "#0043a4" }}
                      className="pb-2"
                    >
                      First Name
                    </label>
                    <FormAnt.Item
                      name="firstname"
                      rules={[
                        { required: true, message: "Enter your First Name" },
                      ]}
                    >
                      <Input
                        name="firstname"
                        className="form-control affiliate-input custom-input"
                        placeholder="Enter First Name"
                      />
                    </FormAnt.Item>
                  </div>
                </div>
              </div>
              {/* PHONE NUMBER */}
              <div className="form-group input-field p-4">
                <label
                  htmlFor="Sign Up"
                  style={{ color: "#0043a4" }}
                  className="pb-2"
                >
                  Phone Number
                </label>
                <FormAnt.Item
                  name="number"
                  rules={[{ required: true, message: "Enter Phone Number" }]}
                >
                  <Input
                    name="number"
                    className="form-control affiliate-input custom-input"
                    placeholder="Phone Number"
                  />
                </FormAnt.Item>
              </div>
              {/* EMAIL ADDRESS */}
              <div className="form-group input-field p-4">
                <label
                  htmlFor="Sign Up"
                  style={{ color: "#0043a4" }}
                  className="pb-2"
                >
                  Email Address
                </label>
                <FormAnt.Item
                  name="email"
                  rules={[{ required: true, message: "Enter Email Address" }]}
                >
                  <Input
                    name="email"
                    className="form-control affiliate-input custom-input"
                    placeholder="Email Address"
                  />
                </FormAnt.Item>
              </div>
              {/* PASSWORD */}
              <div className="form-group input-field p-4">
                <label
                  htmlFor="Sign Up"
                  style={{ color: "#0043a4" }}
                  className="pb-2"
                >
                  Password
                </label>
                <FormAnt.Item
                  name="password"
                  rules={[
                    { required: true, message: "Please input your password!" },
                  ]}
                >
                  <Input.Password
                    name="password"
                    className="form-control affiliate-input custom-input"
                    placeholder="Password"
                    // prefix = {<Image src={passwordIcon} alt="Password-icon" />}
                  />
                </FormAnt.Item>
              </div>
              {/*BUTTON  */}
              <div className="form-group pt-4" style={{ textAlign: "center" }}>
                <FormAnt.Item>
                  <div className="signup-btn">
                    {spinner ? (
                      <Button
                        type="primary"
                        htmlType="submit"
                        className="btn btn-primary affiliate-login-btn"
                        style={{ backgroundColor: "#0043a4" }}
                        onClick={handleAffiliateSignUp}
                        disabled
                      >
                        Submit &nbsp; <Spinner size={"small"} />
                      </Button>
                    ) : (
                      <Button
                        type="primary"
                        htmlType="submit"
                        className="btn btn-primary affiliate-login-btn"
                        style={{ backgroundColor: "#0043a4" }}
                        onClick={handleAffiliateSignUp}
                      >
                        Submit
                      </Button>
                    )}
                  </div>
                </FormAnt.Item>
              </div>
            </FormAnt>
            <div className="policy-comment-div">
              <Form.Text className="text-muted form-btn-weight-text pt-4">
                <p className="form-btn-weight-text">
                  <span style={{ color: "#0043a4" }}>
                    By logging in you accept our{" "}
                  </span>
                  terms of use
                </p>{" "}
                <span>and</span>{" "}
                <p className="form-btn-weight-text">privacy policy.</p>
              </Form.Text>
            </div>
          </div>
        </div>
      </div>
      <ToastComponent
        ref={toastInstance}
        animation={{
          show: { effect: "SlideRightIn", duration: 300, easing: "linear" },
          hide: { effect: "SlideRightOut", duration: 300, easing: "linear" },
        }}
        position={{ X: "Right", Y: "Top" }}
      />
    </>
  );
};

export default Signup_Agency;
