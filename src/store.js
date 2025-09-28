// store.js
import { configureStore } from "@reduxjs/toolkit";
import cartReducer, { setCart } from "./slices/cartSlice";
import themeReducer from "./slices/themeSlice";
import authReducer, { setAuth } from "./slices/authSlice";
import { loadState, saveState } from "./config/persist";

// --- THEME from localStorage ---
const loadThemeFromLocal = () => {
  try {
    return JSON.parse(localStorage.getItem("themeState")) || "light";
  } catch {
    return "light";
  }
};

// --- CREATE STORE synchronously (theme only initially) ---
export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    theme: themeReducer,
  },
  preloadedState: {
    theme: loadThemeFromLocal(),
  },
});

// --- TOKEN for Redis persistence (set after Keycloak ready) ---
let persistenceToken = null;
export const setPersistenceToken = token => {
  persistenceToken = token;
};

// --- SUBSCRIBE: persist theme + Redis ---
store.subscribe(() => {
  const state = store.getState();

  // Persist theme locally (always works even if Redis is down)
  try {
    localStorage.setItem("themeState", JSON.stringify(state.theme));
  } catch (e) {
    console.warn("Failed to persist theme:", e?.message || e);
  }

  // Persist cart/auth to Redis
  if (persistenceToken) saveState(persistenceToken, { cart: state.cart, auth: state.auth });
});

// --- HYDRATE from Redis ---
export const hydrateFromServer = async (token) => {
  if (!token) return;
  setPersistenceToken(token);

  const serverState = await loadState(token);
  if (!serverState) return;

  if (serverState.auth) store.dispatch(setAuth(serverState.auth));
  if (serverState.cart) store.dispatch(setCart(serverState.cart));
};

export const initStore = async token => {
  await hydrateFromServer(token);
  return store;
};