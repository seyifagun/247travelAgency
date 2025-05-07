import React from 'react';

const Shimmer = () => {
    return (
            <div className="shimmerContainer">
                {/* <li> */}
                    <p>
                        <span className="skeleton-box" style="width:80%;"></span>
                        <span className="skeleton-box" style="width:90%;"></span>
                        <span className="skeleton-box" style="width:83%;"></span>
                        <span className="skeleton-box" style="width:80%;"></span>
                    </p>
                {/* </li> */}
                Shimmer
            </div>
    )
}

export default Shimmer