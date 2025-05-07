import React, { useState } from "react";
import Link from "next/link";
import { Button, Form as FormAnt, Input } from "antd";
import { useRouter } from "next/router";
import { Select, Modal } from "antd";
import { useLogin } from "../../pages/api/apiClient";
// import { deleteLoginCredentials } from "../redux/actions/flightActions";
// import { useSelector, useDispatch } from "react-redux";
import "../../components/Files/country-dial-codes.js";
import Spinner from "../../components/Spinner";

const { Option } = Select;

const AffiliateLogin = () => {
  const [affiliateLogin] = FormAnt.useForm();

  const [isShow, setIsShow] = useState(false);

  // spinner for button
  const [spinner, setSpinner] = useState(false);

  const [errorMsgCondition, setErrorMsgCondition] = useState(false);

  const [errorMsg, setErrorMsg] = useState("");

  const onFinish = (values) => {
    console.log("Received values of form: ", values);
  };

  function onChange(value) {
    console.log(`selected ${value}`);
  }

  function onSearch(val) {
    console.log("search:", val);
  }

  const hideModal = () => {
    setFlightSearchErrorModalVisibility(false);
  };

  const handleOk = () => {
    setIsShow(false);
  };

  const [
    flightSearchErrorModalVisibility,
    setFlightSearchErrorModalVisibility,
  ] = useState(false);

  const login = useLogin();

  const router = useRouter();

  let errorMessage;
  const handleAffiliateLogin = () => {
    // console.log("flightRequest", affiliateLogin.getFieldsValue());
    affiliateLogin
      .validateFields()
      .then(async () => {
        setSpinner(true);
        // Display flight search processing modal
        // setFlightSearchProcessingModalVisibility(true);
        // return;
        await login(affiliateLogin.getFieldsValue())
          .then((response) => {
            // console.log("Caught Resp:", response);
            if (response.successful == false) {
              // errorMessage = response.errorMessage;
              setSpinner(false);
              setErrorMsgCondition(true);
              // setFlightSearchErrorModalVisibility(true);
              errorMessage = response.errorMessage;
              return setErrorMsg(errorMessage);
              console.log("Error message: ", errorMessage);
              return;
              // dispatch(deleteLoginCredentials());
            } else {
              router.push("../");
            }
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
        setSpinner(false);
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
              <span
                style={{
                  color: "#0043a4",
                  fontWeight: "700",
                  fontSize: "20px",
                }}
              >
                Login to your account
              </span>
            </div>
            {errorMsgCondition && (
              <div
                className="alert alert-danger"
                style={{ textAlign: "center" }}
              >
                {errorMsg}
              </div>
            )}
            <FormAnt form={affiliateLogin}>
              <div className="form-group input-field p-4">
                <label
                  htmlFor="Sign Up"
                  style={{ color: "#0043a4" }}
                  className="pb-2"
                >
                  Enter E-mail Address
                </label>
                <FormAnt.Item
                  name="username"
                  rules={[
                    { required: true, message: "Please input your username!" },
                  ]}
                >
                  <Input
                    name="username"
                    className="form-control affiliate-input custom-input"
                    placeholder="Email"
                  />
                </FormAnt.Item>
              </div>
              <div className="form-group input-field p-4">
                <label
                  htmlFor="Sign Up"
                  style={{ color: "#0043a4" }}
                  className="pb-2"
                >
                  Enter Password
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
                  />
                </FormAnt.Item>
                <div className="forgot-password-div">
                  <Link
                    href="/access-comps/forgotPassword"
                    as="/affiliate/forgotpassword"
                  >
                    <a>
                      <small style={{ color: "#0043a4", fontWeight: "600" }}>
                        Forgot Password?{" "}
                      </small>
                    </a>
                  </Link>
                  <small
                    className="small-right"
                    style={{ color: "#0043a4", fontWeight: "600" }}
                  >
                    Do not have an account?
                    <span style={{ color: "orange" }}>
                      <Link
                        href="/access-comps/signup_agency"
                        as="/affiliate/sign-up"
                        passHref
                      >
                        <a style={{ color: "orange" }}>
                          <small className="create-acc-small">
                            &nbsp;Create Account
                          </small>
                        </a>
                      </Link>
                    </span>
                  </small>
                </div>
              </div>
              <div className="form-group pt-4" style={{ textAlign: "center" }}>
                <FormAnt.Item>
                  <div className="signup-btn">
                    {spinner ? (
                      <Button
                        type="primary"
                        htmlType="submit"
                        className="btn btn-primary affiliate-login-btn"
                        style={{ backgroundColor: "#0043a4" }}
                        onClick={handleAffiliateLogin}
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
                        onClick={handleAffiliateLogin}
                      >
                        Submit
                      </Button>
                    )}
                  </div>
                </FormAnt.Item>
                {/* <Link href="/B2bIndex" as="/B2B-Index" passHref>
                  <a>
                    <input
                      type="Submit"
                      className="btn btn-primary affiliate-login-btn"
                      style={{ backgroundColor: "#0043a4" }}
                    />
                  </a>
                </Link> */}
              </div>
            </FormAnt>
            <div style={{ textAlign: "center" }} className="p-4">
              <small style={{ color: "#0043a4", fontWeight: "600" }}>
                By logging in you accept our{" "}
                <span style={{ color: "orange", fontWeight: "600" }}>
                  terms of use
                </span>{" "}
                and <span style={{ color: "orange" }}>privacy policy.</span>
              </small>
            </div>
          </div>
        </div>
      </div>
      {/* ********************* */}
      {/* <div className="row mt-5">
        <div className="col-md-4 card m-auto shadow-lg">
          <div className="card-body custom-made p-5">
            <div className="p-4">
              <span
                style={{
                  color: "#0043a4",
                  fontWeight: "700",
                  fontSize: "20px",
                }}
              >
                Sign Up for an Account
              </span>
            </div>
            <div className="form-group p-4">
              <label
                htmlFor="Sign Up"
                style={{ color: "#0043a4" }}
                className="pb-2"
              >
                Enter E-mail Address
              </label>
              <input className="form-control affiliate-input" />
            </div>
            <div className="form-group p-4">
              <label
                htmlFor="Sign Up"
                style={{ color: "#0043a4" }}
                className="pb-2"
              >
                Enter Password
              </label>
              <input className="form-control affiliate-input" />
              <div className="forgot-password-div">
                <small style={{ color: "#0043a4", fontWeight: "600" }}>
                  Forgot Password?{" "}
                </small>
                <small
                  className="small-right"
                  style={{ color: "#0043a4", fontWeight: "600" }}
                >
                  Do not have an account?{" "}
                  <Link href="" passHref>
                    <span style={{ color: "orange" }}>Create Account</span>
                  </Link>
                </small>
              </div>
            </div>
            <div className="form-group pt-4" style={{ textAlign: "center" }}>
              <input
                type="Submit"
                className="btn btn-primary"
                style={{ backgroundColor: "#0043a4" }}
              />
            </div>
            <div style={{ textAlign: "center" }} className="p-4">
              <small style={{ color: "#0043a4", fontWeight: "600" }}>
                By logging in you accept our{" "}
                <span style={{ color: "orange", fontWeight: "600" }}>
                  terms of use
                </span>{" "}
                and <span style={{ color: "orange" }}>privacy policy.</span>
              </small>
            </div>
          </div>
        </div>
      </div> */}
      {/* **************************** */}
      {/* <div className="row mt-5" style={{ display: "none" }}>
        <div className="col-md-4 m-auto shadow-lg">
          <div className="p-4">
            <span
              style={{ color: "#0043a4", fontWeight: "700", fontSize: "20px" }}
            >
              Login to your account
            </span>
          </div>
          <FormAnt
            name="normal_login"
            className="login-form p-5"
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
          >

            <FormAnt.Item
              className="p-4"
              name="company-name"
              rules={[
                {
                  required: true,
                  message: "Input Company Name!",
                },
              ]}
            >
              <Input placeholder="Enter Company Name" />
            </FormAnt.Item>

            <div className="row">
              <div className="col-sm-12 col-md-4">
                <Select
                  className="w-100 p-4"
                  showSearch
                  placeholder="Select Country"
                  optionFilterProp="children"
                  onChange={onChange}
                  onSearch={onSearch}
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {dial_codes.map((dialCode, index) => (
                    <Option value={dialCode.dial_codes} key={index}>
                      {dialCode}
                    </Option>
                  ))}
                </Select>
              </div>
              <div className="col-sm-12 col-md-8">
                <FormAnt.Item
                  className="p-4"
                  name="company-name"
                  rules={[
                    {
                      required: true,
                      message: "Input Company Name!",
                    },
                  ]}
                >
                  <Input placeholder="Enter Company Name" />
                </FormAnt.Item>
              </div>
            </div>


            <FormAnt.Item
              className="p-4"
              name="username"
              rules={[
                {
                  required: true,
                  message: "Please input your Username!",
                },
              ]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Username"
              />
            </FormAnt.Item>


            <FormAnt.Item
              className="p-4"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your Password!",
                },
              ]}
            >
              <Input
                style={{ border: "1px solid #000" }}
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Password"
              />
            </FormAnt.Item>


            <FormAnt.Item
              className="p-4"
              name="confirm-password"
              rules={[
                {
                  required: true,
                  message: "Confirm Password!",
                },
              ]}
            >
              <Input
                style={{ border: "1px solid #000" }}
                type="password"
                placeholder="Password"
              />
            </FormAnt.Item>
            <div className="forgot-password-div p-4">
              <small style={{ color: "#0043a4" }}>Forgot Password? </small>
              <small style={{ color: "#0043a4" }}>
                Do not have an account?{" "}
                <span style={{ color: "orange" }}>
                  <Link href="/access-comps/signup_agency" passHref>
                    <a>Create Account</a>
                  </Link>
                </span>
              </small>
            </div>

            <div>
              <FormAnt.Item className="login-form-button affiliate-btn">
                <Link href="/access-comps/B2bIndex" as="/B2B-Index" passHref>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="login-form-button"
                  >
                    Continue
                  </Button>
                </Link>
              </FormAnt.Item>
            </div>
          </FormAnt>
        </div>
      </div> */}

      <Modal
        onOk={handleOk}
        closable={true}
        onCancel={hideModal}
        // onCancel={hideModal}
        centered
        open={flightSearchErrorModalVisibility}
        style={{ color: "#fff" }}
        width="auto"
        keyboard={false}
        footer={null}
        className="loadFlightModal"
        bodyStyle={{ backgroundColor: "#0043a4", padding: "3rem" }}
      >
        <p className="flightModalTitle">Invalid username or password</p>
      </Modal>
    </>
  );
};

export default AffiliateLogin;
