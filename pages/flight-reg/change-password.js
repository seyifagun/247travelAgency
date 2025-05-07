import { React, useState } from "react";
import { Layout, Menu } from "antd";
import { Form as FormAnt, Input, Button } from "antd";
import Link from "next/link";
import Image from "next/image";
import Head from "next/head";
import { EditOutlined } from "@ant-design/icons";
import usernameIcon from "../../public/icons/username.webp";
import travellerIcon from "../../public/icons/traveller.webp";
import travelerIcon from "../../public/icons/Postal-code.png";
import creditcardIcon from "../../public/icons/Credit-card.png";
import flightIcon from "../../public/icons/flight-booking.webp";
import PasswordIcon from "../../public/icons/PasswordIcon.png";
import ProfileIcon from "../../public/icons/username.png";
import Spinner from "../../components/Spinner";
import { useChangePassword } from "../../pages/api/apiClient";
import Sidebar from "../../components/Sidebar";

const { Header, Content, Sider } = Layout;

const ChangePassword = () => {
  const [errorMsgCondition, setErrorMsgCondition] = useState(false);
  const [successMsgCondition, setSuccessMsgCondition] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [spinner, setSpinner] = useState(false);
  const changePassword = useChangePassword();
  const [changePasswordForm] = FormAnt.useForm();
  let errorMessage;
  let successMessage;
  const handleChangePassword = () => {
    // console.log("ChangePassword Form: ", changePasswordForm.getFieldsValue());
    // return;
    changePasswordForm
      .validateFields()
      .then(async () => {
        setSpinner(true);
        // Display flight search processing modal
        // setFlightSearchProcessingModalVisibility(true);
        // return;
        await changePassword(changePasswordForm.getFieldsValue())
          .then((response) => {
            // replace the text on the button with spinner
            // console.log("Caught Resp:", response);
            // setFlightSearchErrorModalVisibility(true);
            if (response.successful == false) {
              setSpinner(false);
              setErrorMsgCondition(true);
              // errorMessage = response.errorMessage;
              errorMessage = response.errorMessage + " " + "Check old password";
              return setErrorMsg(errorMessage);
              console.log("Error message: ", errorMessage);
              // dispatch(deleteLoginCredentials());
            }

            if (response.successful == true) {
              successMessage = "Password has been changed successfully";
              setSpinner(false);
              setSuccessMsgCondition(true);
              return setSuccessMsg(successMessage);
            }
            // router.push("../../success-page");
            // display success message for a minute or two before redirect
            // setTimeout(() => router.push("/access-comps/login"), 3000);
            // setFlightSearchProcessingModalVisibility(false);
          })
          .catch((error) => {
            setErrorMsgCondition(true);
            setSpinner(false);
            return setErrorMsg(error);
            // setFlightSearchProcessingModalVisibility(false);
            console.log("Caught Error 2:", error);
            // TODO: Pop up a dialog
            // setFlightSearchErrorModalVisibility(true);
          });
        // console.log("All fields values: " + flightSearchForm.getFieldsValue());
      })
      .catch((err) => {
        setErrorMsgCondition(true);
        setSpinner(false);
        return setErrorMsg(err);
        console.error("Form Error:", err);
      });
    // console.log(errorMessage);
    // return errorMessage;
  };

  return (
    <>
      <Layout>
        <Sidebar />
        <Layout>
          <Header
            className="site-layout-sub-header-background"
            style={{ padding: 0 }}
          />
          <Content className="container" style={{}}>
            <div
              className="site-layout-background"
              style={{ padding: 24, minHeight: 360 }}
            >
              <div className="container">
                <div className="row mt-5 mb-5">
                  <div className="col-md-6 card m-auto shadow-lg">
                    <div className="card-body custom-made p-5">
                      <div className="p-4">
                        <div className="edit-profile-form">
                          <span
                            style={{
                              color: "#0043a4",
                              fontWeight: "700",
                              fontSize: "20px",
                            }}
                          >
                            <EditOutlined /> &nbsp;
                          </span>
                          <span
                            style={{
                              color: "#0043a4",
                              fontWeight: "700",
                              fontSize: "20px",
                            }}
                          >
                            Change Password
                          </span>
                        </div>
                      </div>
                      {errorMsgCondition && (
                        <div
                          className="alert alert-danger"
                          style={{ textAlign: "center" }}
                        >
                          {errorMsg}
                        </div>
                      )}
                      {successMsgCondition && (
                        <div
                          className="alert alert-success"
                          style={{ textAlign: "center" }}
                        >
                          {successMsg}
                        </div>
                      )}
                      <FormAnt form={changePasswordForm}>
                        <div className="form-group input-field p-4">
                          <label
                            htmlFor="Sign Up"
                            style={{ color: "#0043a4" }}
                            className="pb-2"
                          >
                            Old Password
                          </label>
                          <FormAnt.Item
                            name="old_password"
                            rules={[
                              {
                                required: true,
                                message: "Enter Old Password!",
                              },
                            ]}
                          >
                            <Input.Password
                              name="old_password"
                              className="form-control affiliate-input custom-input"
                              placeholder="Enter Old Password"
                            />
                          </FormAnt.Item>
                        </div>
                        <div className="form-group input-field p-4">
                          <label
                            htmlFor="Sign Up"
                            style={{ color: "#0043a4" }}
                            className="pb-2"
                          >
                            Enter New Password
                          </label>
                          <FormAnt.Item
                            name="new_password"
                            rules={[
                              {
                                required: true,
                                message: "Enter New Password!",
                              },
                            ]}
                            hasFeedback
                          >
                            <Input.Password
                              name="new_password"
                              className="form-control affiliate-input custom-input"
                              placeholder="Enter New Password"
                            />
                          </FormAnt.Item>
                        </div>
                        <div className="form-group input-field p-4">
                          <label
                            htmlFor="Sign Up"
                            style={{ color: "#0043a4" }}
                            className="pb-2"
                          >
                            Confirm Password
                          </label>
                          <FormAnt.Item
                            name="confirm_new_password"
                            hasFeedback
                            rules={[
                              { required: true, message: "Confirm password!" },
                              ({ getFieldValue }) => ({
                                validator(_, value) {
                                  if (
                                    !value ||
                                    getFieldValue("new_password") === value
                                  ) {
                                    return Promise.resolve();
                                  }
                                  return Promise.reject(
                                    new Error(
                                      "The password you entered do not match!"
                                    )
                                  );
                                },
                              }),
                            ]}
                          >
                            <Input.Password
                              name="confirm_new_password"
                              className="form-control affiliate-input custom-input"
                              placeholder="Confirm Password"
                            />
                          </FormAnt.Item>
                        </div>
                        <div
                          className="form-group pt-4"
                          style={{ textAlign: "center" }}
                        >
                          <FormAnt.Item>
                            <div className="signup-btn">
                              {spinner ? (
                                <Button
                                  type="primary"
                                  htmlType="submit"
                                  className="btn btn-primary affiliate-login-btn"
                                  style={{ backgroundColor: "#0043a4" }}
                                  onClick={handleChangePassword}
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
                                  onClick={handleChangePassword}
                                >
                                  Submit
                                </Button>
                              )}
                            </div>
                          </FormAnt.Item>
                        </div>
                      </FormAnt>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Content>
        </Layout>
        x
      </Layout>
    </>
  );
};

export default ChangePassword;
