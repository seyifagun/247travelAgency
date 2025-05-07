import { ActionTypes } from "../constants/actionTypes";

const initialState = {
    products: [],
    cart: [],
    flightResults: []
};

export const flightResultsReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case ActionTypes.SET_PRODUCTS:
            return {...state, products: payload};
        case ActionTypes.SELECTED_PRODUCT:
            return {...state, product: payload};
        case ActionTypes.ADD_TO_CART:
            // Get the items data from the products array
            const item = state.products.find(prod => prod.id === payload.id);
            
            // Check if item is in cart already
            const isInCart = state.cart.find(item => item.id === payload.id ? true : false);
            return {
                ...state,
                cart: isInCart ? state.cart.map((item) => 
                    item.id === payload.id 
                        ? { ...item, qty: ++item.qty }
                        : item
                    ) 
                    : [...state.cart, { ...item, qty: 1 }]
            };
        case ActionTypes.REMOVE_CART_ITEM:
            return {
                ...state, 
                cart: state.cart.filter((item) => item.id !== payload.id)
            };
        case ActionTypes.MODIFY_CART_ITEM:
            return {
                ...state, 
                cart: state.cart.map(item => item.id === payload.id ? {...item, qty: payload.qty} : item)
            };
        case ActionTypes.SET_SUPER_CATEGORIES:
            return {
                ...state,
                superCategories: payload
            };
        case ActionTypes.SET_CATEGORIES:
            return {
                ...state,
                categories: payload
            };
        case ActionTypes.SET_STORES:
            return {
                ...state,
                stores: payload
            };
        case ActionTypes.SET_CUSTOMER:
            return {
                ...state,
                customer: payload
            };
        case ActionTypes.SET_CUSTOMERS:
            return {
                ...state,
                customers: payload
            };
        case ActionTypes.SET_ORDER:
            return {
                ...state,
                order: payload
            };
        case ActionTypes.SET_ORDER:
            return {
                ...state,
                order: payload
            };
        case ActionTypes.MODIFY_ORDER:
            return {
                ...state,
                order: payload
            };
        default:
            return state;
    }
}
