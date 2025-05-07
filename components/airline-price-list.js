import React from "react";
import Form from "react-bootstrap/Form";
const AirlineList = (props) => {
  return (
    <>
      <div className="airline-link-price mt-3">
        <div className="flight-checkbox d-flex ">
          <Form.Group className="" controlId="formBasicCheckbox">
            <Form.Check className="form-checkbox-custom" type="checkbox" />
          </Form.Group>
          <p className="checkbox-paragraph">{props.airline}</p>
        </div>
        <div className="">
          <p className="price-list-p"><span style={{ marginBottom: "0rem", fontSize: "11px" }}>from</span> {props.price}</p>
        </div>
      </div>
    </>
  );
};

export default AirlineList;
