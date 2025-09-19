// store.js
import { configureStore } from "@reduxjs/toolkit";
import cartReducer from './slices/cartSlice';
import themeReducer from './slices/themeSlice';

const loadState = async () => {
    try {
        const cart = localStorage.getItem('cartState');
        const theme = localStorage.getItem('themeState');

        return {
            cart: cart ? JSON.parse(cart) : undefined,
            theme: theme ? JSON.parse(theme) : undefined,
        };
    } catch (e) {
        return undefined;
    }
};

let store;

export const initApp = async () => {
    try {
        const preloadedState = await loadState();
    
        store = configureStore({
            reducer: {
                cart: cartReducer,
                theme: themeReducer,
            },
            preloadedState,
        });
    
        // persist store updates
        store.subscribe(() => {
            const state = store.getState();
            localStorage.setItem('cartState', JSON.stringify(state?.cart));
            localStorage.setItem('themeState', JSON.stringify(state?.theme));
        });
        
        return store;
    } catch (error) {
        
    }
};

export const getStore = async () => store;
