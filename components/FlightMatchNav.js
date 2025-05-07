import React from "react";
import { MdOutlineArrowBack } from "react-icons/md";
import { RiEdit2Fill } from "react-icons/ri";
import { EconomySeatIcon, SeaterIcon, EditIcon } from "./CustomSVGIcon";
import Link from "next/dist/client/link";
import RouteModel from "./routeModel";

const FlightMatchNav = ({
  showForm,
  getCabinClass,
  departureData,
  arrivalData,
  departureTravellingDay,
  departureTravellingMonth,
  departureTravellingYear,
  arrivalTravellingDay,
  arrivalTravellingMonth,
  arrivalTravellingYear,
  cabin,
  adultCount,
  childCount,
  seatedInfantCount,
  routeModel,
  singleRowMultiCity
}) => {
  return (
    <div className="fmNavbody">
      <Link href="/">
        <div className="navIcon">
          <MdOutlineArrowBack />
        </div>
      </Link>
      <div className="fmDetailsContainer">
        <p className="header">
          {`${departureData.city} - ${arrivalData.city}`}
        </p>
        <div className="details">
          <p>
            {departureTravellingMonth} {departureTravellingDay},{" "}
            {departureTravellingYear} &nbsp;
            {/* {" - "} */}
            {/* {arrivalTravellingMonth} {arrivalTravellingDay},{" "}
            {arrivalTravellingYear} */}
            {routeModel == RouteModel.OneWay || singleRowMultiCity ?
              (<></>) : (<>– &nbsp;<span>{arrivalTravellingMonth} {arrivalTravellingDay}, {arrivalTravellingYear}</span></>)}
          </p>
          <p>
            {" "}
            <EconomySeatIcon /> {getCabinClass(cabin)}
            {/* Sum of all persons */}
            <span className="details__seater">
              {" "}
              <SeaterIcon /> {adultCount + childCount + seatedInfantCount}{" "}
            </span>{" "}
          </p>
        </div>
      </div>
      <div className="editIcon" onClick={showForm}>
        <EditIcon />
        <span>Modify</span>
      </div>
    </div>
  );
};

export default FlightMatchNav;
