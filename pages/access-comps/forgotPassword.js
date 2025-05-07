import { React, useState, useRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Form as FormAnt, Input, Button } from "antd";
import { useForgotPassword } from "../../pages/api/apiClient";
import Spinner from "../../components/Spinner";

const ForgotPassword = () => {
  const [errorMsgCondition, setErrorMsgCondition] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [spinner, setSpinner] = useState(false);
  const [forgotPasswordForm] = FormAnt.useForm();

  const [
    flightSearchErrorModalVisibility,
    setFlightSearchErrorModalVisibility,
  ] = useState(false);

  const forgotPassword = useForgotPassword();

  const router = useRouter();

  let errorMessage;

  const handleForgotPassword = () => {
    // console.log("flightRequest", handleB2Cogin.getFieldsValue());

    forgotPasswordForm
      .validateFields()
      .then(async () => {
        setSpinner(true);
        // Display flight search processing modal
        // setFlightSearchProcessingModalVisibility(true);
        // return;
        await forgotPassword(forgotPasswordForm.getFieldsValue())
          .then((response) => {
            console.log("Caught Resp:", response);
            if (response.successful == false) {
              // errorMessage = response.errorMessage;
              setFlightSearchErrorModalVisibility(true);
              errorMessage = response.errorMessage;
              console.log("Error message: ", errorMessage);
              setErrorMsg(errorMessage);
              return;
              // dispatch(deleteLoginCredentials());
            } else {
              router.push("../../success-page");
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
                Reset Password
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
            <FormAnt form={forgotPasswordForm}>
              <div className="form-group input-field p-4">
                <label
                  htmlFor="Sign Up"
                  style={{ color: "#0043a4" }}
                  className="pb-2"
                >
                  Enter E-mail Address
                </label>
                <FormAnt.Item
                  name="email"
                  rules={[
                    {
                      type: "email",
                      message: "The input is not valid E-mail!",
                    },
                    { required: true, message: "Please input valid username!" },
                  ]}
                >
                  <Input
                    name="email"
                    className="form-control affiliate-input custom-input"
                    placeholder="Email"
                  />
                </FormAnt.Item>
              </div>

              <div className="form-group pt-4" style={{ textAlign: "center" }}>
                {spinner ? (
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="btn btn-primary affiliate-login-btn"
                    style={{ backgroundColor: "#0043a4" }}
                    onClick={handleForgotPassword}
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
                    onClick={handleForgotPassword}
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

export default ForgotPassword;
