import React, { useState, useEffect, useRef } from "react";
import { useVerifyPayFiPayment } from './api/apiClient';
import { Result, Button, Spin } from 'antd';
import { ToastComponent } from '@syncfusion/ej2-react-notifications';

function PayFiVerify() {

  const [paymentStatus, setPaymentStatus] = useState(false);

  const [transactionResponse, setTransactionResponse] = useState({});

  const [transactionMessage, setTransactionMessage] = useState({});

  const verifyPayFiPayment = useVerifyPayFiPayment();

  const toastInstance = useRef(null);

  function displayError(title, content) {
    toastInstance.current.title = title;
    toastInstance.current.content = content;
    toastInstance.current.cssClass = 'e-error';
    toastInstance.current.show();
  }

  useEffect(() => {

    // Get the current url
    let urlString = window.location.href;

    // Get parameter and query strings
    let paramString = urlString.split("?")[1];
    let queryString = new URLSearchParams(paramString);

    // Get the reference parameter from the query string
    let reference = queryString.get('reference');

    // Invoke the payment verification request
    async function paymentVerifyAsync() {
      await verifyPayFiPayment({ reference: reference }).then(
        (response) => {
          if (response.data.successful) {
            console.log('Flight Booked Result:', response);

            // Check for 'flight not found' warning...
            let flightNotFoundIssue = response.data.warningResponse.warnings.find(warning => warning.code == 55400);

            // Check for 'flight booking failed' warning...
            let flightBookingFailedIssue = response.data.warningResponse.warnings.find(warning => warning.code == 55401);

            // If we have warning 55400...
            if (flightNotFoundIssue) {
              // Set transaction message
              setTransactionMessage({
                status: 'warning',
                title: flightNotFoundIssue.title,
                subTitle: flightNotFoundIssue.detail
              });
              // Update the payment status
              setPaymentStatus(true);
              // Exit this method
              return;
            }

            // If we have warning 55401...
            if (flightBookingFailedIssue) {
              // Set transaction message
              setTransactionMessage({
                status: 'warning',
                title: flightBookingFailedIssue.title,
                subTitle: flightBookingFailedIssue.detail
              });
              // Update the payment status
              setPaymentStatus(true);
              // Exit this method
              return;
            }

            // if the order was placed before...
            if (response.data.response.retrievedOrderResult) {
              console.log('Retrieved Booked Result:', response.data.response.retrievedOrderResult);
              // Set the transaction message
              // of the retrieveed flight order
              setTransactionMessage({
                status: 'info',
                title: 'Your flight order has been placed successfully',
                subTitle: `Your PNR is ${response.data.response.retrievedOrderResult.result.data.associatedRecords[0].reference}`
              });
            }
            else {
              // Set the transaction message
              // of the created flight order
              setTransactionMessage({
                status: 'success',
                title: 'Your flight order has been placed successfully',
                subTitle: `Your PNR is ${response.data.response.createOrderResult.result.data.associatedRecords[0].reference}`
              });
            }

            // Update the payment status
            setPaymentStatus(true);
          }
          else {

            console.error('Payment Verify Error:', response.data.errorMessage);
            displayError('Error', 'Unable to verify payment');
            setTransactionMessage({
              status: 'error',
              title: 'Your payment could not be verified due to an error',
              subTitle: 'Contact info@247travels.com specifying your payment reference for further support.'
            });
            setPaymentStatus(true);

          }
        }
      )
        .catch(error => {
          console.error('Payment Verify Error:', error);
          displayError('Error', 'An error occurred!');
          setTransactionMessage({
            status: 'error',
            title: 'Your payment could not be verified due to an error',
            subTitle: 'Contact info@247travels.com specifying your payment reference for further support.'
          });
          setPaymentStatus(true);
        });
    }

    paymentVerifyAsync();
  }, [transactionResponse, setTransactionResponse]);

  return (
    <>
      <div>
        {paymentStatus ?
          (<Result
            status={transactionMessage.status}
            title={transactionMessage.title}
            subTitle={transactionMessage.subTitle}
          // extra={[
          //   <Button type="primary" key="viewOrderDetails">
          //     View Order Details
          //   </Button>,
          //   <Button key="buy">Go to the homepage</Button>,
          // ]}
          />) :
          (<div style={{
            display: 'flex',
            justifyContent: 'center'
          }}>
            <p style={{ textAlign: 'center' }}>Confirming your payment...</p>
            <Spin />
          </div>)}
      </div>

      <ToastComponent ref={toastInstance} animation={{ show: { effect: 'SlideLeftIn', duration: 300, easing: 'linear' }, hide: { effect: 'SlideLeftOut', duration: 300, easing: 'linear' } }} />
    </>
  )
}

export default PayFiVerify;
