import React, { useState, useEffect } from 'react';
import Head from "next/head";
import { Result } from 'antd';

function SuccessPage() {

    // const [SuccessPage, setReservationResult] = useState({});

    return (
        <>
        <Head>
            <title>247Travels | Password Change Success</title>
        </Head>
            <Result
                status='success'
                title='Kindly check your email to reset your password'
                subTitle={`Click the link to change your password`}
            />
        </>
    );
}

export default SuccessPage