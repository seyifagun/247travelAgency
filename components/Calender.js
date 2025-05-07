import { useEffect, useState } from 'react';
import moment from 'moment';
import { IoMdPricetag } from 'react-icons/io';
import { BsFillCaretDownFill, BsFillCaretUpFill } from 'react-icons/bs';

const Calender = ({ fareCalender, fetchResults, calenderVisibility }) => {
  // console.log('Fare Calender:', fareCalender);

  let _fareRows = [];
  let _fareColumns = [];


  // Initialize and set the media query for mobile
  const [onMobile, setOnMobile] = useState(window.matchMedia("(max-width: 768px)").matches);
  useEffect(() => {
    // Set the media query for mobile
    window.matchMedia("(max-width: 768px)").addEventListener('change', e => {
      setOnMobile(e.matches);
    });
  }, [onMobile]);

  console.log('fareCalender: ', fareCalender);

  const [tableVisibility, setTableVisibility] = useState(true);

  return (
    <>
      {
        !onMobile && (
          <>
            {
              calenderVisibility && (
                <div className="calender-container table-responsive">
                  <table className="table table-bordered table-custom">
                    <thead>
                      <tr>
                        <th className="custom-th-header" scope="col"> &nbsp; </th>
                        {fareCalender.map((fare, index) => {

                          let columnExist = _fareColumns.includes(fare.arrivalDate);

                          if (columnExist) {
                            return;
                          }

                          _fareColumns.push(fare.arrivalDate);

                          return (
                            <>
                              <th className="custom-th-header" scope="col">
                                <span className="date-extraInfo">{moment(fare.arrivalDate).format('dddd')}</span>
                                {moment(fare.arrivalDate).format('MMMM')} <span>{moment(fare.arrivalDate).format('DD')}</span>
                              </th>
                            </>
                          );
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {fareCalender.map((fare, index) => {

                        let rowExist = _fareRows.includes(fare.departureDate);

                        if (rowExist) {
                          return;
                        }

                        _fareRows.push(fare.departureDate);

                        let cells = fareCalender.filter(f => f.departureDate === fare.departureDate);
                        // console.log('Cells:', cells);

                        return (
                          <>
                            <tr key={index}>
                              <th scope="row">
                                <span className='date-month'>
                                  <span className="date-extraInfo">{moment(fare.departureDate).format('dddd')}</span>
                                </span>
                                <div className='thElem'>
                                  {moment(fare.departureDate).format('MMMM')}
                                  <span>{moment(fare.departureDate).format('DD')}</span>
                                </div>
                              </th>

                              {cells.map((cell, index) => {
                                // console.log('Cell:', cell);
                                return (
                                  <>
                                    <td key={index} className="custom-td" onClick={() => fetchResults(cell)}>
                                      <p>
                                        &#8358;{(cell.info.price).toLocaleString()}
                                      </p>
                                    </td>
                                  </>
                                );
                              })}
                            </tr>
                          </>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )
            }
          </>
        )
      }
      {
        onMobile && (
          <div className="mCalenderContainer">
            <div className="mCalenderContainer__top">
              <div className="cheapest">
                <IoMdPricetag />
                <div className="cheapest__info">
                  Cheapest Flight
                  <p>From #1,234,000</p>
                </div>
              </div>
              <div className="hideCalender" onClick={() => setTableVisibility(!tableVisibility)}>
                {tableVisibility ? 'Hide Calender' : 'Show Calender'}
                {tableVisibility ? <BsFillCaretUpFill /> : <BsFillCaretDownFill />}
              </div>
            </div>
            {
              tableVisibility && (
                <div className="mCalenderContainer__table">
                  <table>
                    <thead>
                      <tr>
                        <th>Departure</th>
                        <th>Arrival</th>
                        <th>Flight Price</th>
                      </tr>
                    </thead>
                    {/* <div className='trScrollContainer'> */}
                    <tbody className='trScrollContainer'>
                      {
                        fareCalender.map((fare, index) => {
                          return (
                            <tr key={index} onClick={() => {
                              if (fare.info)
                                fetchResults(fare);

                              return;
                            }}>
                              <td>
                                <div className='tdInfo'>
                                  <span>{moment(fare.departureDate).format('dddd')}</span>
                                  {moment(fare.departureDate).format('MMM')} &nbsp;
                                  {moment(fare.departureDate).format('D')}
                                </div>
                              </td>
                              <td>
                                <div className='tdInfo'>
                                  <span>{moment(fare.arrivalDate).format('dddd')}</span>
                                  {moment(fare.arrivalDate).format('MMM')} &nbsp;
                                  {moment(fare.arrivalDate).format('D')}
                                </div>
                              </td>
                              <td>
                                <div className='tdInfo'>
                                  <span className='tdInfo__price'>
                                    {fare.info ? <>&#8358;{fare.info.price.toLocaleString()}</> : <>N/A</>}
                                  </span>
                                </div>
                              </td>
                            </tr>
                          )
                        })
                      }
                    </tbody>
                    {/* </div> */}
                  </table>
                </div>
              )
            }
          </div>
        )
      }
    </>
  );
};

export default Calender;
