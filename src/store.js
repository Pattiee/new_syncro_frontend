// store.js
import { configureStore } from "@reduxjs/toolkit";
import cartReducer from './slices/cartSlice';
import authReducer, { checkAuth } from './slices/authSlice';
import themeReducer from './slices/themeSlice';

const loadState = async () => {
    try {
        const auth = localStorage.getItem('authState');
        const cart = localStorage.getItem('cartState');
        const theme = localStorage.getItem('themeState');

        return {
            auth: auth ? JSON.parse(auth) : undefined,
            cart: cart ? JSON.parse(cart) : undefined,
            theme: theme ? JSON.parse(theme) : undefined,
        };
    } catch (e) {
        return undefined;
    }
};

let store;

export const initApp = async () => {
    const preloadedState = await loadState();

    store = configureStore({
        reducer: {
            auth: authReducer,
            cart: cartReducer,
            theme: themeReducer,
        },
        preloadedState,
    });

    // persist store updates
    store.subscribe(() => {
        const state = store.getState();
        localStorage.setItem('authState', JSON.stringify(state?.auth));
        localStorage.setItem('cartState', JSON.stringify(state?.cart));
        localStorage.setItem('themeState', JSON.stringify(state?.theme));
    });

    // now check auth
    store.dispatch(checkAuth());
    
    return store;
};

export const getStore = async () => store;
