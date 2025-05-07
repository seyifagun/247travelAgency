import React, { useEffect, useState } from "react";
import { Image } from "react-bootstrap";
// import { useSwipeable } from "react-swipeable";
import mobileStudentFlightTravels1 from "../../public/banner/website-ad-banner-mobile1.jpg";
import mobileStudentFlightTravels2 from "../../public/banner/website-ad-banner-mobile2.jpg";
import mobileStudentFlightTravels3 from "../../public/banner/website-ad-banner-mobile3.jpg";


// export const CarouselItem = ({ children, width }) => {
//     return (
//         <div className="carousel-item" style={{ width: width }}>
//             {children}
//         </div>
//     );
// };

// const CarouselParent = ({ children }) => {
//     const [activeIndex, setActiveIndex] = useState(0);
//     const [paused, setPaused] = useState(false);

//     const updateIndex = (newIndex) => {
//         if (newIndex < 0) {
//             newIndex = React.Children.count(children) - 1;
//         } else if (newIndex >= React.Children.count(children)) {
//             newIndex = 0;
//         }

//         setActiveIndex(newIndex);
//     };

//     useEffect(() => {
//         const interval = setInterval(() => {
//             if (!paused) {
//                 updateIndex(activeIndex + 1);
//             }
//         }, 3000);

//         return () => {
//             if (interval) {
//                 clearInterval(interval);
//             }
//         };
//     });

//     //   const handlers = useSwipeable({
//     //     onSwipedLeft: () => updateIndex(activeIndex + 1),
//     //     onSwipedRight: () => updateIndex(activeIndex - 1)
//     //   });

//     return (
//         <>

//             <div
//                 className="c-carousel"
//                 onMouseEnter={() => setPaused(true)}
//                 onMouseLeave={() => setPaused(false)}
//             >
//                 {/* <div
//         className="c-inner"
//         style={{ transform: `translateX(-${activeIndex * 100}%)` }}
//       >
//         {React.Children.map(children, (child, index) => {
//           return React.cloneElement(child, { width: "100%" });
//         })}
//       </div> */}

//                 <div className="parentCarousel">
//                     <div className="carouseltItem"
//                     // style={{ transform: `translateX(-50%)` }} 
//                     >
//                         {/* {React.Children.map(children, (child, index) =>  */}
//                         {/* //   return React.cloneElement(child, { width: "100%" }); */}
//                         {/* // })} */}
//                         <div className="carouseltItem__img" style={{ height: '180px' }}>
//                             <Image
//                                 src={mobileStudentFlightTravels2}
//                                 alt={"student-flight-travels"}
//                                 onClick={() => {
//                                     router.push("call-to-action?actionId=Student Offer");
//                                 }}
//                             />
//                         </div>
//                         <div className="carouseltItem__img" style={{ height: '180px' }}>
//                             <Image
//                                 src={mobileStudentFlightTravels2}
//                                 alt={"student-flight-travels"}
//                                 onClick={() => {
//                                     router.push("call-to-action?actionId=Student Offer");
//                                 }}
//                             />
//                         </div>
//                         <div className="carouseltItem__img" style={{ height: '180px' }}>
//                             <Image
//                                 src={mobileStudentFlightTravels3}
//                                 alt={"student-flight-travels"}
//                                 onClick={() => {
//                                     router.push("call-to-action?actionId=Student Offer");
//                                 }}
//                             />
//                         </div>
//                     </div>
//                 </div>


//                 <div className="c-indicators">
//                     <button
//                         onClick={() => {
//                             updateIndex(activeIndex - 1);
//                         }}
//                     >
//                         Prev
//                     </button>
//                     {React.Children.map(children, (child, index) => {
//                         return (
//                             <button
//                                 className={`${index === activeIndex ? "active" : ""}`}
//                                 onClick={() => {
//                                     updateIndex(index);
//                                 }}
//                             >
//                                 {index + 1}
//                             </button>
//                         );
//                     })}
//                     <button
//                         onClick={() => {
//                             updateIndex(activeIndex + 1);
//                         }}
//                     >
//                         Next
//                     </button>
//                 </div>
//             </div>
//         </>
//     );
// };

export const EachImage = ({ children }) => {
    return (
        <div className="carouseltItem__img">
            {children}
        </div>
    );
};

export const CarouselItem = ({ children, width }) => {

    const [currentSliderNum, setCurrentSliderNum] = useState(0);
    useEffect(() => {
        if (currentSliderNum === 0) {
            setTimeout(() => {
                setCurrentSliderNum(33.5)
            }, 3000);
        }
        if (currentSliderNum === 33.5) {
            setTimeout(() => {
                setCurrentSliderNum(67)
            }, 3000);
        }
        if (currentSliderNum === 67) {
            setTimeout(() => {
                setCurrentSliderNum(0)
            }, 3000);
        }
    }, [currentSliderNum]);

    return (
        <div className="carouseltItem" style={{ transform: `translateX(-${currentSliderNum}%)` }}>
            {children}
        </div>
    );
};

const CarouselParent = ({ children }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [paused, setPaused] = useState(false);

    const updateIndex = (newIndex) => {
        if (newIndex < 0) {
            newIndex = React.Children.count(children) - 1;
        } else if (newIndex >= React.Children.count(children)) {
            newIndex = 0;
        }

        setActiveIndex(newIndex);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            if (!paused) {
                updateIndex(activeIndex + 1);
            }
        }, 3000);

        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, []);

    return (
        <>
            <div className="parentCarousel">
                {children}
            </div>
        </>
    );
};

export default CarouselParent;
