import { ActionTypes } from '../constants/actionTypes';

//#region Product Actions

export const setProducts = (products) => {
    return {
        type: ActionTypes.SET_PRODUCTS,
        payload: products
    };
};

export const selectedProduct = (product) => {
    return {
        type: ActionTypes.SELECTED_PRODUCT,
        payload: product
    };
};

//#endregion

//#region Cart Actions

export const addToCart = (itemId) => {
    return {
        type: ActionTypes.ADD_TO_CART,
        payload: {
            id: itemId,
        }
    };
};

export const removeCartItem = (itemId) => {
    return {
        type: ActionTypes.REMOVE_CART_ITEM,
        payload: {
            id: itemId
        }
    };
};

export const modifyCartItem = (itemId, value) => {
    return {
        type: ActionTypes.MODIFY_CART_ITEM,
        payload: {
            id: itemId,
            qty: value
        }
    }
};

//#endregion

//#region Super Category

export const setSuperCategories = (superCategories) => {
    return {
        type: ActionTypes.SET_SUPER_CATEGORIES,
        payload: superCategories
    };
};

//#endregion

//#region Category

export const setCategories = (categories) => {
    return {
        type: ActionTypes.SET_CATEGORIES,
        payload: categories
    };
};

//#endregion

//#region Stores

export const setStores = (stores) => {
    return {
        type: ActionTypes.SET_STORES,
        payload: stores
    }
}

//#endregion

//#region Customers

export const setCustomer = (customer) => {
    return {
        type: ActionTypes.SET_CUSTOMER,
        payload: customer
    };
};

export const setCustomers = (customers) => {
    return {
        type: ActionTypes.SET_CUSTOMERS,
        payload: customers
    };
};

//#endregion

//#region Orders

export const setOrder = (order) => {
    return {
        type: ActionTypes.SET_ORDER,
        payload: order
    };
};

//#endregion
