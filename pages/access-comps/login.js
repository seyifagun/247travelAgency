import { React, useState, useRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button, Form as FormAnt, Input } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { Select } from "antd";
import { useLogin } from "../../pages/api/apiClient";
import "../../components/Files/country-dial-codes.js";
import Spinner from "../../components/Spinner";

const { Option } = Select;

const LoginB2C = () => {
  const [B2CLogin] = FormAnt.useForm();

  const [
    flightSearchErrorModalVisibility,
    setFlightSearchErrorModalVisibility,
  ] = useState(false);

  const login = useLogin();

  const router = useRouter();

  const [errorMsg, setErrorMsg] = useState("");

  // spinner for button
  const [spinner, setSpinner] = useState(false);

  let errorMessage;
  const handleB2Login = () => {
    // console.log("flightRequest", handleB2Cogin.getFieldsValue());
    B2CLogin.validateFields()
      .then(async () => {
        setSpinner(true);
        // Display flight search processing modal
        // setFlightSearchProcessingModalVisibility(true);
        // return;
        await login(B2CLogin.getFieldsValue())
          .then((response) => {
            // console.log("Caught Resp:", response);
            if (response.response == null || response.response == "{}") {
              // errorMessage = response.errorMessage;
              setSpinner(false);
              // setFlightSearchErrorModalVisibility(true);
              errorMessage = response.errorMessage;
              console.log("Error message: ", errorMessage);
              setErrorMsg(errorMessage);
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
        console.error("Form Error:", err);
      });
    // console.log(errorMessage);
    // return errorMessage;
  };

  const onFinish = (values) => {
    console.log("Received values of form: ", values);
  };

  function onChange(value) {
    console.log(`selected ${value}`);
  }

  function onSearch(val) {
    console.log("search:", val);
  }

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
            <div>{errorMsg}</div>
            <FormAnt form={B2CLogin}>
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
                    {
                      type: "email",
                      message: "The input is not valid E-mail!",
                    },
                    { required: true, message: "Please input valid username!" },
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
                    as="/customer/forgot-password"
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
                        href="/access-comps/signup"
                        as="/customer/sign-up"
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
                {spinner ? (
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="btn btn-primary affiliate-login-btn"
                    style={{ backgroundColor: "#0043a4" }}
                    onClick={handleB2Login}
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
                    onClick={handleB2Login}
                  >
                    Submit
                  </Button>
                )}
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
    </>
  );
};

export default LoginB2C;
