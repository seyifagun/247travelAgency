import { React, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Form as FormAnt, Input, Button } from "antd";
import { useResetPassword } from "../pages/api/apiClient";
import Spinner from "../components/Spinner";

const ResetPassword = () => {
  const router = useRouter();
  const [errorMsgCondition, setErrorMsgCondition] = useState(false);
  const [successMsgCondition, setSuccessMsgCondition] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [spinner, setSpinner] = useState(false);
  // const [userIdState, setUserIdState] = useState(router.query.userId);
  // const [resetTokenState, setResetTokenState] = useState(
  //   router.query.resetToken
  // );

  // useEffect(() => {
  //   if (!router.isReady) return;
  //   const userId = router.query.userId;
  //   const resetToken = router.query.resetToken;
  //   setUserIdState(userId);
  //   setResetTokenState(resetToken);
  //   // console.log(router.query);
  // }, [router.isReady, router.query]);

  // Get the current url
  let urlString = window.location.href;

  // Get parameter and query strings
  let paramString = urlString.split("?")[1];
  let queryString = new URLSearchParams(paramString);

  // Get the trxref parameter from the query string
  let userId = queryString.get("userId");

  // Get the reference parameter from the query string
  let resetToken = queryString.get("resetToken");
  
  const [resetPasswordForm] = FormAnt.useForm();

  const [
    flightSearchErrorModalVisibility,
    setFlightSearchErrorModalVisibility,
  ] = useState(false);

  const resetPassword = useResetPassword();

  let errorMessage;
  let successMessage;

  const handleResetPassword = () => {
    // console.log("flightRequest", handleB2Cogin.getFieldsValue());\
    // console.log(router.query.resetToken);
    // console.log(resetPasswordForm.getFieldsValue());
    // return;
    resetPasswordForm
      .validateFields()
      .then(async () => {
        setSpinner(true);
        // Display flight search processing modal
        // setFlightSearchProcessingModalVisibility(true);
        // return;
        await resetPassword(resetPasswordForm.getFieldsValue(), userId, resetToken)
          .then((response) => {
            // console.log("Caught Resp:", response);
            // return;
            if (response.successful == false) {
              setSpinner(false);
              setErrorMsgCondition(true);
              // errorMessage = response.errorMessage;
              errorMessage = response.errorMessage;
              return setErrorMsg(errorMessage);
              console.log("Error message: ", errorMessage);
              // dispatch(deleteLoginCredentials());
            }

            if (response.successful == true) {
              setSpinner(false);
              setSuccessMsgCondition(true);
              successMessage = "Password has been changed successfully";
              setSuccessMsg(successMessage);
              return setInterval(() => {
                router.push("/access-comps/login");
              }, 3000);
            }
            // setFlightSearchProcessingModalVisibility(false);
          })
          .catch((error) => {
            setSpinner(false);
            setErrorMsgCondition(true);
            // errorMessage = error;
            errorMessage = error;
            return setErrorMsg(errorMessage);
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
              <span
                style={{
                  color: "#0043a4",
                  fontWeight: "700",
                  fontSize: "20px",
                }}
              >
                Enter Password
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
            {successMsgCondition && (
              <div
                className="alert alert-success"
                style={{ textAlign: "center" }}
              >
                {successMsg}
              </div>
            )}
            <FormAnt
              form={resetPasswordForm}
              initialValues={{
                userId: userId,
                resetToken: resetToken,
              }}
            >
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
                  hasFeedback
                  rules={[{ required: true }]}
                >
                  <Input.Password
                    name="password"
                    className="form-control affiliate-input custom-input"
                    placeholder="Password"
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
                  name="confirm_password"
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
                    name="confirm_password"
                    className="form-control affiliate-input custom-input"
                    placeholder="Confirm Password"
                  />
                </FormAnt.Item>
              </div>

              <FormAnt.Item hidden={true} name="userId">
                <Input name="userId" />
              </FormAnt.Item>

              <FormAnt.Item hidden={true} name="resetToken">
                <Input name="resetToken" />
              </FormAnt.Item>

              <div className="form-group pt-4" style={{ textAlign: "center" }}>
                {spinner ? (
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="btn btn-primary affiliate-login-btn"
                    style={{ backgroundColor: "#0043a4" }}
                    onClick={handleResetPassword}
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
                    onClick={handleResetPassword}
                  >
                    Submit
                  </Button>
                )}
              </div>
            </FormAnt>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
