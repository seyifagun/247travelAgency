import { react, useState, useRef } from "react";
import Form from "react-bootstrap/Form";
import { useRouter } from "next/router";
import Button from "react-bootstrap/Button";
import { useSignUpB2C } from "../../pages/api/apiClient";
import { Input, Form as FormAnt, Select, Row, Col } from "antd";
import Spinner from "../../components/Spinner";
const { Option } = Select;

const Signup = () => {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState("");
  const signUpB2C = useSignUpB2C();
  const [B2CSignUp] = FormAnt.useForm();

  // spinner for button
  const [spinner, setSpinner] = useState(false);
  let errorMessage;

  const handleB2CSignUp = () => {
    console.log("flightRequest", B2CSignUp.getFieldsValue());
    // return;
    B2CSignUp.validateFields()
      .then(async () => {
        setSpinner(true);
        // Display flight search processing modal
        // setFlightSearchProcessingModalVisibility(true);
        // return;
        await signUpB2C(B2CSignUp.getFieldsValue())
          .then((response) => {
            // replace the text on the button with spinner
            // console.log("Caught Resp:", response);
            // setFlightSearchErrorModalVisibility(true);
            if (response.response == null || response.response == "{}") {
              // errorMessage = response.errorMessage;
              errorMessage = response.errorMessage;
              console.log("Error message: ", errorMessage);
              return setErrorMsg(errorMessage);
              // dispatch(deleteLoginCredentials());
            }
            // displaySuccessMessageNotification(
            //   "Success",
            //   "Your account has been registered. You will be redirected to the login page."
            // );
            // display success message for a minute or two before redirect
            setTimeout(() => router.push("/access-comps/login"), 3000);
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
                  Sign Up for an account
                </span>
              </div>
            </div>
            <div>{errorMsg}</div>
            <FormAnt form={B2CSignUp}>
              {/* NAME OF CUSTOMER */}
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
                              message: "Please input your Surname!",
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
                        { required: true, message: "Enter your First Name!" },
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
                  rules={[{ required: true, message: "Enter Email Address!" }]}
                >
                  <Input
                    name="email"
                    className="form-control affiliate-input custom-input"
                    placeholder="Email Address"
                  />
                </FormAnt.Item>
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
                  rules={[{ required: true, message: "Enter Phone Number!" }]}
                >
                  <Input
                    name="number"
                    className="form-control affiliate-input custom-input"
                    placeholder="Phone Number"
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
                  hasFeedback
                >
                  <Input.Password
                    name="password"
                    className="form-control affiliate-input custom-input"
                    placeholder="Password"
                  />
                </FormAnt.Item>
              </div>
              {/* CONFIRM PASSWORD */}
              <div className="form-group input-field p-4">
                <label
                  htmlFor="Sign Up"
                  style={{ color: "#0043a4" }}
                  className="pb-2"
                >
                  Confirm Password
                </label>
                <FormAnt.Item
                  name="confirm-password"
                  dependencies={["password"]}
                  hasFeedback
                  rules={[
                    { required: true, message: "Confirm password!" },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error(
                            "The two passwords that you entered do not match!"
                          )
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password
                    name="confirm-password"
                    className="form-control affiliate-input custom-input"
                    placeholder="Confirm Password"
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
                        onClick={handleB2CSignUp}
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
                        onClick={handleB2CSignUp}
                      >
                        Submit
                      </Button>
                    )}
                  </div>
                </FormAnt.Item>
              </div>
            </FormAnt>
            <div className="policy-comment-div">
              <Form.Text className="text-muted form-btn-weight-text">
                <p className="form-btn-weight-text">
                  <span style={{ color: "#0043a4" }}>
                    By logging in you accept our &nbsp;
                  </span>
                  terms of use
                </p>{" "}
                and <p className="form-btn-weight-text">privacy policy.</p>
              </Form.Text>
            </div>
            {/* <div style={{ textAlign: "center" }} className="p-4">
              <small style={{ color: "#0043a4", fontWeight: "600" }}>
                By logging in you accept our{" "}
                <span style={{ color: "orange", fontWeight: "600" }}>
                  terms of use
                </span>{" "}
                and <span style={{ color: "orange" }}>privacy policy.</span>
              </small>
            </div> */}
          </div>
        </div>
      </div>

      {/* |SECOND LOGIN FORM| */}
    </>
  );
};

export default Signup;
