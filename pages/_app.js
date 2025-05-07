import Layout from "../components/layout";
import "../styles/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "antd/dist/antd.css";
import "../node_modules/@syncfusion/ej2-base/styles/fabric.css";
import "../node_modules/@syncfusion/ej2-react-buttons/styles/fabric.css";
import "../node_modules/@syncfusion/ej2-popups/styles/fabric.css";
import "../node_modules/@syncfusion/ej2-react-notifications/styles/fabric.css";
import "../styles/oneway.css";
import "../styles/login.css";
import "../styles/signup.css";
import "../styles/navbarr.css";
import "../styles/travelercard.css";
import "../styles/affiliate-program.css";
import "../styles/flight-match.css";
import "../styles/flightNav.css";
import "../styles/BookedFlightTable.css";
import "../styles/BookPage.css";
import "../styles/RoundTrip.css";
import "../styles/payment.css";
import "../styles/affiliateLogin.css";
import "../styles/developerAPI.css";
import "../styles/searchHistory.css";
import "../styles/career.css";
import "../styles/blogpost.css";
import "../styles/flightItenerary.css";
import "../styles/customTabs.css";
import "../styles/about.css";
import "../styles/toggleTabs.css";
import "../styles/error.css";
import "../styles/contact-us.css";
import "../styles/flightDetails.css";
// import "../styles/calender.css";
import "../styles/scss/fareCalender.scss";
import "../styles/edit-profile.css";
import "../styles/footer.css";
import "../styles/scss/flightMatch.scss"
import "../styles/scss/flightMatchNav.scss"
import "../styles/scss/flightDetailsMobile.scss"
import "../styles/scss/notificationToastCards.scss"
import "../styles/scss/shimmer.scss"
import "../styles/scss/searchPanel.scss"
import "../styles/scss/mobileSearchPanel.scss"
import "../styles/scss/flightSuggestion.scss"
import "../styles/scss/carousel.scss"
import "react-datepicker/dist/react-datepicker.css";
import "../styles/customize-datepicker.css";
import NextNProgress from 'nextjs-progressbar';
import { Provider } from "react-redux";
import { store, persistor } from "../redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { BrowserRouter } from "react-router-dom";

// export function reportWebVitals(metric) {
//   console.log(metric);
// }

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <Layout>
            {/* <div className="container" style={{marginRight:'5rem'}}>
              <DeveloperNavbar />
            </div> */}
            <NextNProgress color="#FCA62B"/>
            <Component {...pageProps} />
          </Layout>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  );
}

export default MyApp;
