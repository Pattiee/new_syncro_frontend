import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { 
  persistStore, 
  persistReducer, 
  FLUSH, 
  REHYDRATE, 
  PAUSE, 
  PERSIST, 
  PURGE, 
  REGISTER 
} from "redux-persist";
import storage from "redux-persist/lib/storage";

import cartReducer from "./slices/cartSlice";
import themeReducer from "./slices/themeSlice";
import { encryptTransform } from "./encryptTransform";

// 1. Group your application's redcuers into a single structural block
const rootReducer = combineReducers({
  cart: cartReducer,
  theme: themeReducer,
});

// 2. Define the configuration mapping contract for redux-persist
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["cart", "theme"],
  transforms: [encryptTransform],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Essential configuration to skip serializability checks on redux-persist's internal actions
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

// 3. Export global application state & dispatch types for hooks
export type RootState = ReturnType<typeof rootReducer>; 
export type AppDispatch = typeof store.dispatch;