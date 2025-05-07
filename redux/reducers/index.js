import { combineReducers } from 'redux';
import { flightReducer } from '../reducers/flightReducer';
// import { storeReducer } from '../reducers/storeReducer';

const reducers = combineReducers({
    store: flightReducer
});

export default reducers;
