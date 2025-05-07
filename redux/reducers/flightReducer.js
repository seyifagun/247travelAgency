import { ActionTypes } from "../constants/actionTypes";

const initialState = {
  airports: [],
  airlines: [],
  flightResults: [],
  filteredFlightResults: [],
  selectedOffer: {},
  flightRequestMeta: {},
  loginCredentials: {},
};

export const flightReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case ActionTypes.SET_AIRPORTS:
      return { ...state, airports: payload };
    case ActionTypes.SET_AIRLINES:
      return { ...state, airlines: payload };
    case ActionTypes.SET_FLIGHT_RESULTS:
      return { ...state, flightResults: payload };
    case ActionTypes.SET_FILTERED_FLIGHT_RESULTS:
      return { ...state, filteredFlightResults: payload };
    case ActionTypes.SET_SELECTED_FLIGHT_OFFER:
      return { ...state, selectedOffer: payload };
    case ActionTypes.SET_FLIGHT_REQUEST_META:
      return { ...state, flightRequestMeta: payload };
    case ActionTypes.SET_LOGIN_CREDENTIALS:
      return { ...state, loginCredentials: payload };
    case ActionTypes.DELETE_LOGIN_CREDENTIALS:
      return { ...state, loginCredentials: payload };
    case ActionTypes.DELETE_FLIGHT_RESULTS:
      return { ...state, deleteFlightResults: payload };
      case ActionTypes.FETCH_ARTICLES:
        return { ...state, articles: payload };
    default:
      return state;
  }
};
