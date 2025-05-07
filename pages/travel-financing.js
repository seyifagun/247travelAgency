import React, { useState } from "react";
import Head from "next/head";
import { Select, Form as FormAnt, Input, Button, Alert } from "antd";

const { Option } = Select;

function handleChange(value) {
  console.log(`selected ${value}`);
}

const Travel_Financing = () => {
  const [paymentResult, setPaymentResult] = useState("");

  const travelFinancingFunction = (
    principalTotalAmt,
    firstPayment,
    cycleSelect
  ) => {
    var firstCharge = 0.03;
    var secondCharge = 0.06;

    console.log(cycleSelect);
    var interestRateNew = 1.06;
    var principalReminderNew = principalTotalAmt - firstPayment;
    var financeCharge = 0.03;

    var interestRate = 0.06;
    var interestAmt = principalTotalAmt * interestRate;
    var repaymentAmt = firstPayment + interestAmt;
    var principalRemainder =
      parseInt(principalTotalAmt) - parseInt(firstPayment);
    console.log("Remainder of Total Cost: ", principalRemainder);

    var principalRepayment = principalTotalAmt - firstPayment;
    var interestForThreeMonths = principalRepayment / 2;
    var principalRepaymentInterest = principalRepayment * interestRate;
    // **************************************************************************
    var remainderPayment = principalRepayment + principalRepaymentInterest;

    var principalRepayment = principalTotalAmt - firstPayment;
    var principalRepaymentInterest = principalRepayment * interestRate;
    var SecondRemainderPayment =
      interestForThreeMonths + principalRepaymentInterest;
    // **************************************************************************

    var ThirdRemainderPayment =
      interestForThreeMonths * 0.06 + interestForThreeMonths;

    // *********** DISPLAY VARIABLES **************

    if (firstPayment >= principalTotalAmt * 0.5) {
      for (
        let cycleSelected = cycleSelect;
        cycleSelected <= 4;
        cycleSelected++
      ) {
        if (cycleSelect == 1) {
          console.log(
            "Total Payment:",
            parseInt(principalTotalAmt * interestRate) +
              parseInt(principalTotalAmt)
          );
          let firstPaymentCycleVar =
            // parseInt(principalTotalAmt * interestRate) +
            // parseInt(principalTotalAmt);
            parseInt(principalReminderNew * interestRateNew) + parseInt(principalReminderNew * financeCharge);

          setPaymentResult("Total Payment: " + parseFloat(firstPaymentCycleVar).toLocaleString("en-NG", {style: "currency",currency: "NGN",}) );
        } 

        else if (cycleSelect == 2) {
          var principalRepayment = principalTotalAmt - firstPayment;
          var interestForThreeMonths = principalRepayment / 2;
          var principalRepaymentInterest = principalRepayment * interestRate;
          var remainderPayment =
            parseFloat(principalReminderNew / 2) * parseFloat(1.06);
          var secondCycleInitialPayment = parseInt(principalReminderNew / 2) + parseFloat(principalReminderNew * 0.06) + parseInt(principalReminderNew * 0.03)

          //
          var remainderFee = principalTotalAmt - firstPayment;
          var firstUpfrontRepayment = firstCharge * remainderFee;
          var secondUpfrontRepayment = secondCharge * remainderFee; 
          
          var paySecondUpfront = parseFloat(firstPayment) + parseFloat(firstUpfrontRepayment);
          var paySecondUpfrontII = parseFloat(remainderFee) + parseFloat(secondUpfrontRepayment);
          //

          // console.log(
          //   "First Payment:",
          //   parseInt(principalTotalAmt * 0.06 + parseInt(firstPayment))
          // );
      
          setPaymentResult( "First Payment: " + parseFloat(paySecondUpfront).toLocaleString("en-NG", {style: "currency",currency: "NGN",}) + " " + 
                            "Second Payment: " + parseFloat(paySecondUpfrontII).toLocaleString("en-NG", {style: "currency",currency: "NGN",}));
          // console.log(
          //   "First Payment:",
          //   parseInt(principalTotalAmt * 0.06 + parseInt(firstPayment))
          // );
      
          // setPaymentResult( "First Payment: " + parseFloat(secondCycleInitialPayment).toLocaleString("en-NG", {style: "currency",currency: "NGN",}) + " " + "Second Payment: " +
          //     parseFloat(remainderPayment).toLocaleString("en-NG", {style: "currency",currency: "NGN",}));

          // ********************** //
        

          
        } 
        
        else if (cycleSelect == 3) {
          var principalRepayment = principalTotalAmt - firstPayment;
          var principalRepaymentInterest = principalRepayment * interestRate;
          var paymentInitial =
            parseInt(principalReminderNew / 3) + parseInt(principalReminderNew * 0.06) + parseFloat(principalReminderNew * 0.03);
          var SecondRemainderPayment =
            parseFloat(principalReminderNew / 3) + parseFloat((0.666666666667 * principalReminderNew) * 0.06);
            var ThirdRemainderPayment =
            parseFloat(principalReminderNew / 3) * parseFloat(1.06);

          //
          var remainderFee = principalTotalAmt - firstPayment;
          var remainderHalve = parseFloat(remainderFee / 2);
          var firstUpfrontRepayment = firstCharge * remainderFee;
          var secondUpfrontRepayment = secondCharge * remainderFee; 
          var thirdUpfrontRepayment = remainderHalve * secondCharge;
          var payThirdUpfront = parseFloat(firstPayment) + parseFloat(firstUpfrontRepayment);
          var payThirdUpfrontII = parseFloat(remainderHalve) + parseFloat(secondUpfrontRepayment);
          var payThirdUpfrontIII = parseFloat(remainderHalve) + parseFloat(thirdUpfrontRepayment);
          //

          console.log("First Payent:", paymentInitial);
          // setPaymentResult(
          //   "First Payment: " +
          //     parseFloat(paymentInitial).toLocaleString("en-NG", {style: "currency",currency: "NGN",}) +
          //     " " +
          //     "Second Payment: " +
          //     parseFloat(SecondRemainderPayment).toLocaleString("en-NG", {style: "currency",currency: "NGN",}) +
          //     " " +
          //     "Third Payment: " +
          //     parseFloat(ThirdRemainderPayment).toLocaleString("en-NG", {style: "currency",currency: "NGN",})
          // );
          setPaymentResult(
            "First Payment: " +
              parseFloat(payThirdUpfront).toLocaleString("en-NG", {style: "currency",currency: "NGN",}) +
              " " +
              "Second Payment: " +
              parseFloat(payThirdUpfrontII).toLocaleString("en-NG", {style: "currency",currency: "NGN",}) +
              " " +
              "Third Payment: " +
              parseFloat(payThirdUpfrontIII).toLocaleString("en-NG", {style: "currency",currency: "NGN",})
          );

          console.log("Third Payment1:", SecondRemainderPayment);
          console.log("Third Payment2:", ThirdRemainderPayment);
        }

        else if (cycleSelect == 4) {
          var principalRepayment = principalTotalAmt - firstPayment;
          var principalRepaymentInterest = principalRepayment * interestRate;
          var paymentInitial =
            parseInt(principalReminderNew / 3) + parseInt(principalReminderNew * 0.06) + parseFloat(principalReminderNew * 0.03);
          var SecondRemainderPayment =
            parseFloat(principalReminderNew / 3) + parseFloat((0.666666666667 * principalReminderNew) * 0.06);
            var ThirdRemainderPayment =
            parseFloat(principalReminderNew / 3) * parseFloat(1.06);

          //
          var remainderFee = principalTotalAmt - firstPayment;
          var remainderHalve = parseFloat(remainderFee / 2);
          var remainderThreeHalve = parseFloat(remainderFee / 3);

          var remainderSecondFee = parseFloat(remainderFee) - parseFloat(remainderThreeHalve);
          var firstUpfrontRepayment = firstCharge * remainderFee;
          var secondUpfrontRepayment = secondCharge * remainderFee; 
          var thirdfrontRepayment = remainderSecondFee * secondCharge;
          var fourUpfrontRepayment = remainderThreeHalve * secondCharge;

          var payThirdUpfront = parseFloat(firstPayment) + parseFloat(firstUpfrontRepayment);
          var payThirdUpfrontII = parseFloat(remainderThreeHalve) + parseFloat(secondUpfrontRepayment);
          var payThirdUpfrontIII = parseFloat(remainderThreeHalve) + parseFloat(thirdfrontRepayment);
          var payThirdUpfrontIV = parseFloat(remainderThreeHalve) + parseFloat(fourUpfrontRepayment);
          //

          console.log("First Payent:", paymentInitial);
          // setPaymentResult(
          //   "First Payment: " +
          //     parseFloat(paymentInitial).toLocaleString("en-NG", {style: "currency",currency: "NGN",}) +
          //     " " +
          //     "Second Payment: " +
          //     parseFloat(SecondRemainderPayment).toLocaleString("en-NG", {style: "currency",currency: "NGN",}) +
          //     " " +
          //     "Third Payment: " +
          //     parseFloat(ThirdRemainderPayment).toLocaleString("en-NG", {style: "currency",currency: "NGN",})
          // );
          setPaymentResult(
            "First Payment: " +
              parseFloat(payThirdUpfront).toLocaleString("en-NG", {style: "currency",currency: "NGN",}) +
              " " +
              "Second Payment: " +
              parseFloat(payThirdUpfrontII).toLocaleString("en-NG", {style: "currency",currency: "NGN",}) +
              " " +
              "Third Payment: " +
              parseFloat(payThirdUpfrontIII).toLocaleString("en-NG", {style: "currency",currency: "NGN",}) +
              " " +
              "Fourth Payment: " +
              parseFloat(payThirdUpfrontIV).toLocaleString("en-NG", {style: "currency",currency: "NGN",})
          );

          // console.log("Third Payment1:", SecondRemainderPayment);
          // console.log("Third Payment2:", ThirdRemainderPayment);
        }
      }
    } else {
      console.log("Input is less than 50% of the Total Cost");
      setPaymentResult(
        <Alert
          message="Error"
          description="Initial deposit is less than 50%"
          type="error"
          showIcon
          style={{ display: "inline-block" }}
        />
      );
    }
  };

  const [TravelingFinancing] = FormAnt.useForm();

  return (
    <>
      <Head>
        <title>247Travels | Travel Financing</title>
      </Head>

      <div>
        <div className="container">
          <div className="travelfinance-parent">
            <h5 className="travelfinance-heading">Travel Financing</h5>
          </div>
        </div>
        <FormAnt form={TravelingFinancing}>
          {console.log(
            "Show form instance values",
            TravelingFinancing.getFieldsValue()
          )}
          <div className="container-fluid travel-div">
            <div className="container">
              <div className="travel-input-div">
                <div className="row">
                  <div className="col-sm-12 col-md-4 mb-5">
                    <div className=" ticket-cost-input">
                      <label htmlFor="text">Total Ticket Cost</label>
                      {/* <Input
                        type="text"
                        value={value.number || number}
                        onChange={onNumberChange}
                        aria-label="First name"
                        className="form-control travelfinance-input"
                      /> */}
                    </div>
                    <FormAnt.Item
                      name="ticketCost"
                      // rules={[
                      //   {
                      //     type: "text",
                      //     message: "The input is not valid!",
                      //   },
                      //   {
                      //     required: true,
                      //     message: "Enter Total Ticket Cost!",
                      //   },
                      // ]}
                    >
                      <Input
                        name="ticketCost"
                        placeholder="Enter Total Ticket Cost"
                        className="form-control travelfinance-input"
                      />
                    </FormAnt.Item>
                  </div>
                  <div className="col-sm-12 col-md-5 mb-5">
                    <div className="available-payment ">
                      <label htmlFor="text">
                        Equity
                      </label>
                    </div>
                    <FormAnt.Item
                      name="firstPayment"
                      // rules={[
                      //   {
                      //     type: "text",
                      //     message: "The input is not valid!",
                      //   },
                      //   {
                      //     required: true,
                      //     message: "Please Enter Departing City!",
                      //   },
                      // ]}
                    >
                      <Input
                        name="firstPayment"
                        placeholder="Enter First Payment"
                        className="form-control travelfinance-input"
                      />
                    </FormAnt.Item>
                  </div>
                  <div className="col-sm-12 col-md-3 payment mb-5">
                    <label htmlFor="text">Payment Cycle</label>
                    <FormAnt.Item
                      name="cycleSelect"
                      // initialValue="A Month or less"
                    >
                      <Select
                        id="dropdown-menu-align-end custom-travel-drop"
                        className="dropdown-travel-custom"
                        placeholder="Select Payment Cycle"
                        style={{ width: "100%" }}
                        onChange={handleChange}
                        name="cycleSelect"
                      >
                        {/* <Select.Option value="1">A Month or Less</Select.Option> */}
                        <Select.Option value="2">Two Installment</Select.Option>
                        <Select.Option value="3">Three Installment</Select.Option>
                        <Select.Option value="4">Four Installment</Select.Option>
                      </Select>
                    </FormAnt.Item>
                  </div>
                </div>
                <div className="travel-finance-section">
                  <div className="travelFinance-btn-wrapper">
                  <FormAnt.Item>
                    <Button
                      // onClick={console.log(TravelingFinancing.getFieldsValue()) }
                      onClick={() => {
                        travelFinancingFunction(
                          TravelingFinancing.getFieldsValue().ticketCost,
                          TravelingFinancing.getFieldsValue().firstPayment,
                          TravelingFinancing.getFieldsValue().cycleSelect
                        );
                        console.log(TravelingFinancing.getFieldsValue());
                      }}
                      className="travelFinance-btn"
                    >
                      Calculate
                    </Button>
                  </FormAnt.Item>
                  </div>
                  <div className="travel-financing-presentation">
                  <p
                    style={{
                      color: "#000",
                      fontWeight: "600",
                      marginBottom: "0",
                      padding: "1rem 1rem",
                    }}
                  >
                    {paymentResult}
                  </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FormAnt>
      </div>
    </>
  );
};

export default Travel_Financing;
