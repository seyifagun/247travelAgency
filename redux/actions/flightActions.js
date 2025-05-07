import { ActionTypes } from "../constants/actionTypes";

export const setAirports = (airports) => {
  return {
    type: ActionTypes.SET_AIRPORTS,
    payload: airports
  };
};

export const setAirlines = (airlines) => {
  return {
    type: ActionTypes.SET_AIRLINES,
    payload: airlines
  };
};

export const setFlightResults = (flightResults) => {
  return {
    type: ActionTypes.SET_FLIGHT_RESULTS,
    payload: flightResults
  };
};

export const setFilteredFlightResults = (filteredFlightResults) => {
  return {
    type: ActionTypes.SET_FILTERED_FLIGHT_RESULTS,
    payload: filteredFlightResults
  };
};

export const setSelectedFlightOffer = (flightOffer) => {
  return {
    type: ActionTypes.SET_SELECTED_FLIGHT_OFFER,
    payload: flightOffer
  };
};

export const setFlightRequestMeta = (flightRequestMeta) => {
  return {
    type: ActionTypes.SET_FLIGHT_REQUEST_META,
    payload: flightRequestMeta
  };
};

export const setLoginCredentials = (loginCredentials) => {
  return {
    type: ActionTypes.SET_LOGIN_CREDENTIALS,
    payload: loginCredentials
  };
};

export const deleteLoginCredentials = () => {
  return {
    type: ActionTypes.DELETE_LOGIN_CREDENTIALS,
    payload: null
  };
};

export const deleteflightResults = () => {
  return {
    type: ActionTypes.DELETE_FLIGHT_RESULTS,
    payload: null
  };
};

// Function to dispatch create article data
export const fetchArticles = (articles) => {
  return {
    type: ActionTypes.FETCH_ARTICLES,
    payload: articles
  }
};

