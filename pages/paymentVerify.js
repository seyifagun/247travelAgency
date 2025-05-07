import React, { useState, useEffect, useRef } from "react";
import { useVerifyPayment } from './api/apiClient';
import { Result, Button, Spin } from 'antd';
import { ToastComponent } from '@syncfusion/ej2-react-notifications';
import OrderStatus from './orderStatus';
import styles from "../styles/scss/payment-verification.module.scss";
import Image from "next/image";

function PaymentVerify() {
  const [paymentStatus, setPaymentStatus] = useState(false);

  const [transactionResponse, setTransactionResponse] = useState({});

  const [transactionMessage, setTransactionMessage] = useState({});

  const verifyPayment = useVerifyPayment();

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

    // Get the trxref parameter from the query string
    let trxref = queryString.get('trxref');
    // Get the reference parameter from the query string
    let reference = queryString.get('reference');

    // Invoke the payment verification request
    async function paymentVerifyAsync() {
      await verifyPayment({ trxref: trxref, reference: reference }).then(
        (response) => {
          if (response.data.successful) {
            console.log('Flight Booked Result:', response);

            // Check for 'flight not found' warning...
            let flightNotFoundIssue = response.data.warningResponse?.warnings.find(warning => warning.code == 55400);

            // Check for 'flight booking failed' warning...
            let flightBookingFailedIssue = response.data.warningResponse?.warnings.find(warning => warning.code == 55401);

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

            // if the order was successfully created...
            if (response.data.response.createOrderResult.successful) {
              // Set the transaction message
              // of the created flight order
              setTransactionMessage({
                status: 'success',
                title: 'Your flight order has been placed successfully',
                subTitle: `Your PNR is ${response.data.response.createOrderResult.result.data.associatedRecords[0].reference}`
              });
            }
            // if the order was placed before...
            else if (response.data.response.retrievedOrderResult) {
              console.log('Retrieved Booked Result:', response.data.response.retrievedOrderResult);
              // Set the transaction message
              // of the retrieved flight order
              setTransactionMessage({
                status: 'info',
                title: 'Your flight order has been placed successfully',
                subTitle: `Your PNR is ${response.data.response.retrievedOrderResult.result.data.associatedRecords[0].reference}`
              });
            }
            // otherwise, the flight order could have failed...
            else {
              console.log('Order Result:', response.data.response.orderResult);
              // Set transaction for reservation
              setTransactionMessage({
                status: 'info',
                title: 'Flight reservation sucessfully made',
                subTitle: `Your reservation id is ${response.data.response.orderResult.reservationId}`
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

      {/* <div className={styles.bookingMessageContainer}>
        <div className={styles.bookingMessageContainer__top}>
          <div className={styles.icon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clip-path="url(#clip0_424_70)">
                <path d="M13.296 0.0690042C11.862 -0.289496 10.53 0.795004 10.434 2.199C10.326 3.7755 10.089 5.223 9.792 6.084C9.6045 6.624 9.0735 7.6035 8.232 8.5425C7.3965 9.477 6.309 10.3095 5.0355 10.6575C4.0275 10.932 3 11.805 3 13.08V19.0815C3 20.349 4.023 21.2775 5.172 21.399C6.777 21.57 7.518 22.0215 8.274 22.4835L8.346 22.5285C8.754 22.776 9.213 23.0505 9.801 23.2545C10.3965 23.4585 11.0925 23.58 12 23.58H17.25C18.6555 23.58 19.6485 22.8645 20.151 21.984C20.3939 21.5685 20.5251 21.0972 20.532 20.616C20.532 20.388 20.4975 20.148 20.4165 19.92C20.718 19.5255 20.9865 19.053 21.1485 18.5685C21.3135 18.0735 21.4065 17.4255 21.1545 16.845C21.258 16.65 21.3345 16.4415 21.393 16.2405C21.5085 15.8355 21.5625 15.3885 21.5625 14.955C21.5625 14.523 21.5085 14.0775 21.393 13.671C21.3405 13.4841 21.2712 13.3024 21.186 13.128C21.4487 12.7543 21.6176 12.323 21.6787 11.8703C21.7398 11.4177 21.6912 10.9569 21.537 10.527C21.228 9.639 20.514 8.877 19.737 8.619C18.4665 8.196 17.0325 8.205 15.963 8.3025C15.741 8.32248 15.5194 8.34749 15.2985 8.3775C15.8189 6.14908 15.7869 3.82728 15.2055 1.614C15.1043 1.25939 14.9103 0.938232 14.6434 0.683749C14.3765 0.429266 14.0465 0.250695 13.6875 0.166504L13.296 0.0690042ZM17.25 22.0815H12C11.235 22.0815 10.7055 21.978 10.29 21.8355C9.8685 21.69 9.531 21.4935 9.126 21.246L9.066 21.21C8.2335 20.7015 7.269 20.1135 5.331 19.908C4.8315 19.854 4.5 19.473 4.5 19.083V13.08C4.5 12.699 4.839 12.2655 5.43 12.105C7.0725 11.655 8.3955 10.611 9.351 9.543C10.3035 8.478 10.947 7.3305 11.208 6.576C11.5725 5.526 11.8185 3.924 11.931 2.301C11.9685 1.758 12.471 1.41 12.9315 1.524L13.3245 1.623C13.5645 1.683 13.7115 1.8375 13.7565 2.0055C14.3691 4.33954 14.2935 6.80093 13.539 9.093C13.4963 9.22048 13.4886 9.3571 13.5168 9.48856C13.545 9.62001 13.608 9.74147 13.6993 9.84022C13.7905 9.93897 13.9066 10.0114 14.0354 10.0499C14.1642 10.0884 14.301 10.0915 14.4315 10.059L14.436 10.0575L14.457 10.053L14.544 10.032C15.0569 9.92308 15.5758 9.84444 16.098 9.7965C17.0925 9.7065 18.2835 9.7155 19.263 10.0425C19.5255 10.1295 19.938 10.4925 20.118 11.0175C20.2785 11.4795 20.2485 12.0225 19.719 12.5505L19.1895 13.08L19.719 13.611C19.7835 13.6755 19.8765 13.8225 19.95 14.0835C20.022 14.334 20.0625 14.6385 20.0625 14.955C20.0625 15.273 20.022 15.576 19.95 15.828C19.875 16.089 19.7835 16.236 19.719 16.3005L19.1895 16.83L19.719 17.361C19.7895 17.4315 19.8825 17.6265 19.7265 18.093C19.5639 18.5454 19.3055 18.9573 18.969 19.3005L18.4395 19.83L18.969 20.361C18.978 20.3685 19.0305 20.436 19.0305 20.616C19.0238 20.836 18.9614 21.0507 18.849 21.24C18.6015 21.672 18.0945 22.0815 17.25 22.0815Z" fill="white" />
              </g>
              <defs>
                <clipPath id="clip0_424_70">
                  <rect width="24" height="24" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </div>
          <h3>Your flight order has been placed successfully</h3>
          <p>Your payment receipt will be sent to your email shortly</p>
          <p><strong>Your PNR code is PRIION</strong></p>
        </div>
        <div className={styles.bookingInfoContainer}>
          <h4 className={styles.title}>You booked</h4>
          <div className={styles.bookingInfo}>
            <>
                <div className={styles.airlineInfo}>
                  <div className={styles.airlineInfo__img}>
                    <Image src='/aeroplane.png' alt="airline_image" width={100} height={100} />
                  </div>
                  <p className={styles.airlineInfo__name}>Virgin Atlantic</p>
                </div>
              <div className={styles.eachBookingInfo}>
                <div className={styles.eachBookingInfo__lhs}>
                  <div className={styles.moreInfo}>
                    <p>Lagos - London</p>
                    <span>September 23, 2023</span>
                  </div>
                </div>
                <div className={styles.eachBookingInfo__rhs}>
                  <div className={styles.moreInfo}>
                    <p>08:10 - 22:03</p>
                    <span>14 hours - Non Stop</span>
                  </div>
                </div>
              </div>
              <span className={styles.dottedLine}></span>
            </>
            <div className={styles.travelersInfo}>
              <h3>Traveler(s)</h3>
              <p>Mr. Benjamin Akano</p>
            </div>
          </div>
        </div>
      </div> */}

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
  );
}

export default PaymentVerify;

let data = {
  "data": {
    "response": {
      "createOrderResult": {
        "response": {
          "data": {
            "type": "flight-order",
            "id": "eJzTd9f3CjIKDw8AAAtSAnI%3D",
            "associatedRecords": [
              {
                "reference": "JR2WWP",
                "creationDate": "2022-02-16T18:17:00.000",
                "originalSystemCode": null,
                "flightOfferId": "1"
              }
            ],
            "flightOffers": [
              {
                "type": "flight-offer",
                "id": "1",
                "source": "GDS",
                "instantTicketingRequired": false,
                "nonHomogeneous": false,
                "oneWay": false,
                "lastTicketingDate": "2022-02-17",
                "numberOfBookableSeats": 0,
                "itineraries": [
                  {
                    "duration": null,
                    "segments": [
                      {
                        "departure": {
                          "iataCode": "LOS",
                          "at": "2022-02-17T23:35:00"
                        },
                        "arrival": {
                          "iataCode": "CDG",
                          "terminal": "2E",
                          "at": "2022-02-18T06:05:00"
                        },
                        "carrierCode": "AF",
                        "number": "149",
                        "aircraft": {
                          "code": "332"
                        },
                        "duration": null,
                        "id": "26",
                        "numberOfStops": 0,
                        "blacklistedInEU": false
                      },
                      {
                        "departure": {
                          "iataCode": "CDG",
                          "at": "2022-02-18T07:35:00"
                        },
                        "arrival": {
                          "iataCode": "LHR",
                          "terminal": "3",
                          "at": "2022-02-18T08:00:00"
                        },
                        "carrierCode": "AF",
                        "number": "1680",
                        "aircraft": {
                          "code": "320"
                        },
                        "duration": null,
                        "id": "27",
                        "numberOfStops": 0,
                        "blacklistedInEU": false
                      }
                    ]
                  },
                  {
                    "duration": null,
                    "segments": [
                      {
                        "departure": {
                          "iataCode": "LHR",
                          "at": "2022-02-26T06:25:00"
                        },
                        "arrival": {
                          "iataCode": "CDG",
                          "terminal": "2E",
                          "at": "2022-02-26T08:45:00"
                        },
                        "carrierCode": "AF",
                        "number": "1381",
                        "aircraft": {
                          "code": "320"
                        },
                        "duration": null,
                        "id": "100",
                        "numberOfStops": 0,
                        "blacklistedInEU": false
                      },
                      {
                        "departure": {
                          "iataCode": "CDG",
                          "at": "2022-02-26T14:40:00"
                        },
                        "arrival": {
                          "iataCode": "LOS",
                          "terminal": "I",
                          "at": "2022-02-26T21:05:00"
                        },
                        "carrierCode": "AF",
                        "number": "104",
                        "aircraft": {
                          "code": "332"
                        },
                        "duration": null,
                        "id": "101",
                        "numberOfStops": 0,
                        "blacklistedInEU": false
                      }
                    ]
                  }
                ],
                "price": {
                  "currency": "NGN",
                  "total": "282517.00",
                  "base": "17760.00",
                  "fees": [
                    {
                      "amount": "0.00",
                      "type": "TICKETING"
                    },
                    {
                      "amount": "0.00",
                      "type": "SUPPLIER"
                    },
                    {
                      "amount": "0.00",
                      "type": "FORM_OF_PAYMENT"
                    }
                  ],
                  "grandTotal": "282517.00"
                },
                "pricingOptions": {
                  "fareType": [
                    "PUBLISHED"
                  ],
                  "includedCheckedBagsOnly": true
                },
                "validatingAirlineCodes": [
                  "AF"
                ],
                "travelerPricings": [
                  {
                    "travelerId": "1",
                    "fareOption": "STANDARD",
                    "travelerType": "ADULT",
                    "associatedAdultId": null,
                    "price": {
                      "currency": "NGN",
                      "total": "282517.00",
                      "base": "17760.00",
                      "fees": null,
                      "grandTotal": null
                    },
                    "fareDetailsBySegment": [
                      {
                        "segmentId": "26",
                        "cabin": "ECONOMY",
                        "fareBasis": "RL50EIRT",
                        "class": "R",
                        "includedCheckedBags": {
                          "quantity": 1
                        }
                      },
                      {
                        "segmentId": "27",
                        "cabin": "ECONOMY",
                        "fareBasis": "RL50EIRT",
                        "class": "L",
                        "includedCheckedBags": {
                          "quantity": 1
                        }
                      },
                      {
                        "segmentId": "100",
                        "cabin": "ECONOMY",
                        "fareBasis": "RL50EIRT",
                        "class": "L",
                        "includedCheckedBags": {
                          "quantity": 1
                        }
                      },
                      {
                        "segmentId": "101",
                        "cabin": "ECONOMY",
                        "fareBasis": "RL50EIRT",
                        "class": "R",
                        "includedCheckedBags": {
                          "quantity": 1
                        }
                      }
                    ]
                  }
                ]
              }
            ],
            "travelers": [
              {
                "id": "1",
                "dateOfBirth": "1998-03-23",
                "name": {
                  "firstName": "Anwo",
                  "lastName": "Peter"
                },
                "gender": "MALE",
                "contact": {
                  "emailAddress": "m.peter.ayobami@gmail.com",
                  "phones": [
                    {
                      "deviceType": "MOBILE",
                      "countryCallingCode": "234",
                      "number": "08183279553"
                    }
                  ]
                },
                "documents": null
              }
            ],
            "formOfPayments": [
              {
                "other": {
                  "method": "CASH",
                  "flightOfferIds": [
                    "1"
                  ]
                }
              }
            ],
            "remarks": null,
            "ticketingAgreement": {
              "option": "DELAY_TO_CANCEL",
              "delay": "6D"
            },
            "contacts": [
              {
                "addresseeName": {
                  "firstName": "247 Travels and Vacation Limited",
                  "lastName": null
                },
                "address": {
                  "lines": [
                    "Manor Court 19 Pariola Street Ogudu GRA"
                  ],
                  "postalCode": null,
                  "cityName": "Lagos",
                  "countryCode": "NG"
                },
                "purpose": "INVOICE",
                "phones": null,
                "companyName": null,
                "emailAddress": null
              },
              {
                "addresseeName": {
                  "firstName": "247 Travels and Vacation Limited",
                  "lastName": null
                },
                "address": {
                  "lines": [
                    "Manor Court 19 Pariola Street Ogudu GRA"
                  ],
                  "postalCode": null,
                  "cityName": "Lagos",
                  "countryCode": "NG"
                },
                "purpose": "STANDARD",
                "phones": [
                  {
                    "deviceType": "LANDLINE",
                    "countryCallingCode": "234",
                    "number": "7057000247"
                  }
                ],
                "companyName": null,
                "emailAddress": "info@247travels.com"
              }
            ]
          }
        },
        "errorResponse": null,
        "httpResponse": {
          "version": "1.1",
          "content": {
            "headers": [
              {
                "key": "Content-Type",
                "value": [
                  "application/vnd.amadeus+json"
                ]
              },
              {
                "key": "Content-Length",
                "value": [
                  "3774"
                ]
              }
            ]
          },
          "statusCode": 201,
          "reasonPhrase": "Created",
          "headers": [
            {
              "key": "Date",
              "value": [
                "Wed, 16 Feb 2022 18:18:01 GMT"
              ]
            },
            {
              "key": "Connection",
              "value": [
                "keep-alive"
              ]
            },
            {
              "key": "ama-client-ref",
              "value": [
                "x-247travels-7fdf171a-1896-449d-9525-b28cec03daed",
                "x-247travels-7fdf171a-1896-449d-9525-b28cec03daed"
              ]
            },
            {
              "key": "Ama-Internal-Message-Version",
              "value": [
                "14.1"
              ]
            },
            {
              "key": "Ama-Request-Id",
              "value": [
                "00014X1AH7ETHO"
              ]
            },
            {
              "key": "Ama-Gateway-Request-Id",
              "value": [
                "rrt-0dfa63e35ca66294c-a-eu-30633-463326251-1"
              ]
            },
            {
              "key": "Access-Control-Allow-Headers",
              "value": [
                "origin, x-requested-with, accept, Content-Type, Authorization"
              ]
            },
            {
              "key": "Access-Control-Max-Age",
              "value": [
                "3628800"
              ]
            },
            {
              "key": "Access-Control-Allow-Methods",
              "value": [
                "OPTIONS, DELETE, POST, GET, PUT, PATCH"
              ]
            },
            {
              "key": "Server",
              "value": [
                "Amadeus"
              ]
            },
            {
              "key": "Access-Control-Allow-Origin",
              "value": [
                "*"
              ]
            },
            {
              "key": "Authorization",
              "value": [
                "Bearer gVDJSemMSfAKmzrgIgzzlDibyGge"
              ]
            }
          ],
          "trailingHeaders": [],
          "requestMessage": {
            "version": "1.1",
            "versionPolicy": 0,
            "content": {
              "headers": [
                {
                  "key": "Content-Type",
                  "value": [
                    "application/json; charset=utf-8"
                  ]
                }
              ]
            },
            "method": {
              "method": "POST"
            },
            "requestUri": "https://test.travel.api.amadeus.com/v1/booking/flight-orders",
            "headers": [
              {
                "key": "Ama-Client-Ref",
                "value": [
                  "x-247travels-7fdf171a-1896-449d-9525-b28cec03daed"
                ]
              },
              {
                "key": "Authorization",
                "value": [
                  "Bearer gVDJSemMSfAKmzrgIgzzlDibyGge"
                ]
              },
              {
                "key": "Transfer-Encoding",
                "value": [
                  "chunked"
                ]
              },
              {
                "key": "traceparent",
                "value": [
                  "00-b26c0b13cf49c4682459776daa3f5f80-3a18ce66d6f5be87-00"
                ]
              }
            ],
            "properties": {},
            "options": {}
          },
          "isSuccessStatusCode": true
        },
        "successful": true,
        "errorMessage": null
      }
    },
    "errorResponse": null,
    "httpResponse": null,
    "successful": true,
    "errorMessage": null
  },
  "status": 200,
  "statusText": "OK",
  "headers": {
    "content-type": "application/json; charset=utf-8"
  },
  "config": {
    "url": "api/payment/verify?trxref=7717210e-d94f-4fa1-b2f6-7190bc821fb5&reference=7717210e-d94f-4fa1-b2f6-7190bc821fb5",
    "method": "get",
    "headers": {
      "Accept": "application/json, text/plain, */*"
    },
    "baseURL": "https://apitest.247travels.com/",
    "transformRequest": [
      null
    ],
    "transformResponse": [
      null
    ],
    "timeout": 0,
    "xsrfCookieName": "XSRF-TOKEN",
    "xsrfHeaderName": "X-XSRF-TOKEN",
    "maxContentLength": -1,
    "maxBodyLength": -1,
    "httpsAgent": {},
    "transitional": {
      "silentJSONParsing": true,
      "forcedJSONParsing": true,
      "clarifyTimeoutError": false
    }
  },
  "request": {}
}
