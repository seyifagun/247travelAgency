import React, { useState } from 'react';
import { Border, PlusBtn, MinusBtn, ValueElement } from './BtnElements';

const index = (props) => {

    return (
        <>
            <Border>
                <MinusBtn onClick={props.decreaseNum}>
                    -
                </MinusBtn>
                <ValueElement>
                    {props.numValue}
                </ValueElement>
                <PlusBtn onClick={props.increaseNum}>
                    +
                </PlusBtn>
            </Border>
        </>
    )
}

export default index
