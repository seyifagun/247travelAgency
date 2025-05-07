import { useState, useEffect } from 'react';
import Navbarr from "./navbarr";
import FlightMatchNav from './FlightMatchNav';
import Footer from "./footer";
import { useRouter } from 'next/router';

const Layout = ({ children }) => {
  const router = useRouter();
  // Get the current route
  const currentPath = router.pathname;
  const isFlightMatchPage = currentPath === '/flight-match';
  console.log('Current Path:', currentPath);
  // Initialize and set the media query for mobile
  const [onMobile, setOnMobile] = useState(window.matchMedia("(max-width: 768px)").matches);

  const [detailsVisibility, setDetailsVisibility] = useState(false);

  useEffect(() => {
    // Set the media query for mobile
    window.matchMedia("(max-width: 768px)").addEventListener('change', e => {
      setOnMobile(e.matches);
    });
  }, [onMobile]);
  return (
    <div>
      {isFlightMatchPage && onMobile ? (<></>) : <Navbarr />}
      {children}
      <Footer />
    </div>
  );
};

export default Layout;

