import React, { useState } from 'react';
import { FilterIcon, SortIcon } from './CustomSVGIcon';
import { FlightFilterMobile } from './FlightFilterMobile';
import FlightSortMobile from './FlightSortMobile';

const FlightMatchButtomNav = ({ filterCheapest, filterFastest, sortSelection, setSortSelection, filterSort }) => {
  const [visible, setVisible] = useState(false);
  function toggleFilter() {
    setVisible(!visible);
  }

  const [sortVisible, setSortVisible] = useState(false);
  function toggleSort() {
    setSortVisible(!sortVisible);
  }

  return (
    <>
      <div className='fmButtomContainer'>
        <div className='fmButtomContainer__filters' onClick={toggleFilter}>
          <FilterIcon />
          Filters
        </div>
        <div className='fmButtomContainer__line'> </div>
        <div className='fmButtomContainer__sort' onClick={toggleSort}>
          <SortIcon />
          Sort by
        </div>
      </div>
      <FlightSortMobile
        sortVisible={sortVisible}
        toggleSort={toggleSort}
        filterFastest={filterFastest}
        filterCheapest={filterCheapest}
        sortSelection={sortSelection}
        setSortSelection={setSortSelection} />
      <FlightFilterMobile visible={visible} toggleFilter={toggleFilter} />
    </>
  )
}

export default FlightMatchButtomNav;