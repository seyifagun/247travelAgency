import React from 'react';
// import DatePicker from 'react-datepicker';
import { CalendarContainer } from 'react-datepicker';

export const MyContainer = ({className, children}) => {
    return (
        <div style={{ padding: "8px", background: "#0095ff", color: "#fff", position: "absolute", top: "2px" }}>
        <CalendarContainer className={className}>
          <div style={{ position: "relative" }}>{children}</div>
        </CalendarContainer>
      </div>
    //   <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
    );
}

export const MyContainerArrival = ({className, children}) => {
    return (
        <div style={{ padding: "8px", background: "#0095ff", color: "#fff", position: "absolute", top: "2px", right: "0px" }}>
        <CalendarContainer className={className}>
          <div style={{ position: "relative" }} >{children}</div>
        </CalendarContainer>
      </div>
    //   <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
    );
}

// export default MyContainer;