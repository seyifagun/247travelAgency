import React from 'react';

const Tooltip = ({content}) => {
    return (
        <>
            <div className='spTooltip' style={{ display: 'none' }}>{content}</div>
        </>
    )
}

export default Tooltip