import React, { useState, useRef, useEffect } from "react";
import Head from "next/head";
import { useSelector } from "react-redux";
import { Button as ButtonAnt, Drawer, Button, Space } from "antd";
import BookingSummary from "../components/BookingSummary";
import { useGetPayStackTransactionFee, useInitializePayment } from "./api/apiClient";
import { useRouter } from "next/router";
import { ToastComponent } from "@syncfusion/ej2-react-notifications";
import CustomTabs from "../components/customTabs";

const PaymentCustom = () => {
  const setSelectedFlightOfferObject = useSelector(
    (state) => state.store.selectedOffer
  );

  let setSelectedFlightOffer = [];

  setSelectedFlightOffer.push(setSelectedFlightOfferObject);

  // Set the useRouter hook
  const router = useRouter();

  // Initialize payment api hook
  const initializePayment = useInitializePayment();

  // Initialize 'GetPayStackTransactionFee' hook
  const getPayStackTransactionFee = useGetPayStackTransactionFee();

  // Initialize paystack transaction fee with 2000
  const [payStackTransactFee, setPayStackTransactFee] = useState(2000);

  const toastInstance = useRef(null);

  function displayError(title, content) {
    toastInstance.current.title = title;
    toastInstance.current.content = content;
    toastInstance.current.cssClass = "e-error";
    toastInstance.current.show();
  }

  function displayInfo(title, content) {
    toastInstance.current.title = title;
    toastInstance.current.content = content;
    toastInstance.current.cssClass = "e-info";
    toastInstance.current.show();
  }

  useEffect(() => {
    async function getTransactionFee() {
      var result = await getPayStackTransactionFee()
        .then(result => {
          // If we get a successful feedback...
          if (result.data.successful) {
            // Set the transaction fee
            let fee = result.data.response.serviceCharge;
            setPayStackTransactFee(fee);
          }
          // Otherwise...
          else {
            // Log the error message
            console.log('Unable to get paystack transaction fee. Error details:', result.data.errorMessage);
          }
        })
        .catch(error => {
          // Log the caught error
          console.log('Unable to get paystack transaction fee. Error details:', error);
        });
    }

    // Invoke the function to get transaction fee
    getTransactionFee();
  }, []);

  return (
    <>
      <Head>
        <title>247Travels | Payment</title>
      </Head>
      <div className="container">
        <div className="row">
          <div className="col-xl-4 col-lg-4 col-12 mt-5 mb-5 drawercustom-desktop">
            <BookingSummary setSelectedFlightOffer={setSelectedFlightOffer} />
          </div>
          <div className="drawercustom-mobile">
            <DrawerCustom />
          </div>
          <div className="col-xl-8 col-lg-7 col-12 mt-5 mb-5">
            <div
              className="selectPaymentOption mb-5"
              style={{ color: "white" }}
            >
              Select Payment Option{" "}
            </div>
            <CustomTabs payStackTransactionFee={payStackTransactFee} />
            <div className="paymentPage"></div>
          </div>
        </div>
      </div>

      <ToastComponent
        ref={toastInstance}
        animation={{
          show: { effect: "SlideLeftIn", duration: 300, easing: "linear" },
          hide: { effect: "SlideLeftOut", duration: 300, easing: "linear" },
        }}
      />
    </>
  );
};

export default PaymentCustom;

export function DrawerCustom() {
  const setSelectedFlightOfferObject = useSelector(
    (state) => state.store.selectedOffer
  );

  let setSelectedFlightOffer = [];

  setSelectedFlightOffer.push(setSelectedFlightOfferObject);

  // Set the useRouter hook
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [placement, setPlacement] = useState("left");

  const showDrawer = () => {
    setVisible(true);
  };

  const onChange = (e) => {
    setPlacement(e.target.value);
  };

  const onClose = () => {
    setVisible(false);
  };
  return (
    <>
      <Space>
        <Button type="primary" onClick={showDrawer}>
          Filter
        </Button>
      </Space>
      <Drawer
        title="Summary"
        placement={placement}
        width={500}
        onClose={onClose}
        open={visible}
      >
        <BookingSummary setSelectedFlightOffer={setSelectedFlightOffer} />
      </Drawer>
    </>
  );
}
