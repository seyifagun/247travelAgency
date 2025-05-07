import React, { useState, useEffect } from 'react';
import Head from "next/head";
import { Result } from 'antd';
import Script from 'next/script';

function ReservationResult() {

    // const [reservationResult, setReservationResult] = useState({});

    return (
        <>
            <Head>
                <title>247Travels | Reservation Result</title>
                {/* <!-- Event snippet for Website traffic conversion page -->  */}
                {/* <Script id="google-analytics" strategy="afterInteractive">
                    {`
                        gtag('event', 'conversion', {'send_to': 'AW-11038833516/T9GCCM-ovIQYEOz23I8p'})
                    `}
                </Script>
                <Script id="google-analytics" strategy="afterInteractive">
                    {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', ''AW-11038833516');
        `}
                </Script> */}
            </Head>
            <Script id="google-analytics" strategy="afterInteractive">
                {`
                        gtag('event', 'conversion', {'send_to': 'AW-11038833516/T9GCCM-ovIQYEOz23I8p'})
                `}
            </Script>
            <Result
                status='success'
                title='Your Reservation was Successful'
                subTitle={`Your Reservation Id is: ${window.localStorage.getItem('reservationId')}`}
            />
        </>
    );
}

export default ReservationResult