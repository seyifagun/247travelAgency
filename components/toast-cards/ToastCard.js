import React, { useState } from 'react'
import { ImCheckmark } from 'react-icons/im';
import { GrClose } from 'react-icons/gr';

export const NotificationToastCard = ({ status, show, notificationCardVisible, setNotificationCardVisible, header, text }) => {
    // const [cardVisibility, setCardVisibility] = useState(true);
    function hideCard() {
        // setCardVisibility(!cardVisibility);
        status = 'hide';
    }
    function closeNotificationCard() {
        setNotificationCardVisible(false);
    }

    return (
        <>
            <div className={notificationCardVisible ? 'notificationContainer' : 'notificationContainerClose'}>
                <div className={status === 'success' ? 'ScContainer' : status === 'error' ? 'EcContainer' : status === 'warning' ? 'WcContainer' : ''}>
                    <div className='cContainer__icon'>
                        <ImCheckmark />
                    </div>
                    <div className='cContainer__text'>
                        <p className='cardTitle'>{header}</p>
                        <p className='cardMessage'>{text}</p>
                    </div>
                    <div className='cContainer__close' onClick={closeNotificationCard}>
                        <GrClose />
                    </div>
                </div>
            </div>
        </>
    )
}
