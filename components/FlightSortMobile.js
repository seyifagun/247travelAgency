import React from 'react';
import { MdClose } from 'react-icons/md';

const FlightSortMobile = (
    { sortVisible, toggleSort, filterFastest, filterCheapest,
        sortSelection, setSortSelection }) => {

    const filterSort = {
        cheapest: 0,
        fastest: 1
    }

    return (
        <>
            <div className={sortVisible ? 'FsContainer' : 'FsContainerActive'}>
                {/* <div className= {'FsContainer'}> */}
                <div className='FsContainer__top'>
                    <h3>Sort by</h3>
                    <div className='FsCloseIcon' onClick={toggleSort}>
                        <MdClose />
                    </div>
                </div>
                <div className='FsContainer__options'>
                    <div className='FcOptionUp'>
                        <div className={sortSelection == filterSort.fastest ? 'FsOptionItemActive' : 'FsOptionItem'}>
                            <input type='radio' name='sort'
                                onClick={() => {
                                    filterFastest();
                                    setSortSelection(filterSort.fastest);
                                }} />
                            <span className='FsChecker'></span>
                            <label className='FsLabel'>Fastest</label>
                        </div>
                        <div className={sortSelection == filterSort.cheapest ? 'FsOptionItemActive' : 'FsOptionItem'}>
                            <input type='radio' name='sort'
                                onClick={() => {
                                    filterCheapest();
                                    setSortSelection(filterSort.cheapest);
                                }} />
                            <span className='FsChecker'></span>
                            <label className='FsLabel'>Cheapest</label>
                        </div>
                    </div>
                    {/* <div className='FcOptionDown'>
                     <div className='FsOptionItem'>
                         <input type='radio' name='sort' />
                         <span className='FsChecker'></span>
                         <label className='FsLabel'>Best</label>
                     </div>
                     <div className='FsOptionItem'>
                         <input type='radio' name='sort' />
                         <span className='FsChecker'></span>
                         <label className='FsLabel'>Latest</label>
                     </div>
                 </div> */}
                </div>
            </div>
        </>
    )
}

export default FlightSortMobile;