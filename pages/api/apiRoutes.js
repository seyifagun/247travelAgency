export default class ApiRoutes {
  static BASE_URL = "https://api.247travels.xown.solutions/";
  static BASE_URL_TEST = "https://apitest.247travels.com/";
  static BASE_URL_LIVE = "https://api.247travels.com/";
  static BASE_URL_STAGING = "https://stagingapi.247travels.com/";
  static BASE_URL_DEV = "https://localhost:7144/";
  static FRONTEND_BASE_URL_LIVE = "https://247travels.com/";
  // static FRONTEND_BASE_URL_LIVE = "http://localhost:3000/";

  // The route to the FetchAirports endpoint
  static FetchAirports = "api/airports/fetch";

  // The route to the FetchAirlines endpoint
  static FetchAirlines = "api/airlines/fetch";

  // The route to the SaveFlightRequest endpoint
  static SaveFlightRequest = "api/flightrequest/save";

  // The route to the GetFlightOffers endpoint
  static FlightOffers = "api/flight/offers";

  // The route to the InitializeFlightOrder endpoint
  static InitializeFlightOrder = "api/flight/order/initialize";

  // The route to the InitializePayment endpoint
  static InitializePayment = "api/payment/initialize";

  // The route to the VerifyPayment endpoint
  static VerifyPayment = "api/payment/verify";

  // The route to the savedSearch endpoint
  static SavedSearch = "api/flight/offers";

  // The route to the  fetchSavedSearch endpoint
  static FetchSavedSearch = "api/searchhistory/fetch";

  // The route to the  fetchReservation endpoint
  static FetchReservation = "api/customer/reservations/fetch";

  // The route to the  fetchReservation endpoint
  static FetchPayments = "api/customer/payments/fetch";

  // The route to the VerifyEmail endpoint
  static VerifyEmail = "api/email/verify";

  // The route to the ReserveFlight endpoint
  static ReserveFlight = "api/flight/order/reserve";

  // The route to the CreateNewsletterSubscriber endpoint
  static CreateNewsletterSubscriber = "api/newslettersubscriber/create";

  // The route to the CreateContact endpoint
  static CreateEnquiry = "api/enquiry/create";

  // The route to the VerifyPayFi endpoint
  static VerifyPayFiPayment = "api/payment/payfi/verify";

  //The route to fetch article
  static FetchArticles = "api/articles/fetch";

  // The route to the InitializePayFi endpoint
  static InitializePayFiPayment = "api/payment/payfi/initialize";

  // The route to the VerifyPayFi endpoint
  static VerifyPayFiPayment = "api/payment/payfi/verify";

  // The route to the GetPayStackTransactionFee enpoint
  static GetPayStackTransactionFee = "api/paystack/transactionfee/get";
}
