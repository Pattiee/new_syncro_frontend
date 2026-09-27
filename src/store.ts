import { configureStore, combineReducers, Reducer } from "@reduxjs/toolkit";
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

// Import your newly optimized, strongly-typed state slice modules
import cartReducer from "./slices/cartSlice";
import themeReducer from "./slices/themeSlice";
import authReducer from "./slices/authSlice"; 
import { encryptTransform } from "./encryptTransform";

// 1. Group your application's reducers into a single structural block
const rootReducer = combineReducers({
  cart: cartReducer,
  theme: themeReducer,
  auth: authReducer,
});

// 2. Define the configuration mapping contract for redux-persist
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["cart", "theme"],
  transforms: [encryptTransform],
};

// 🛠️ FIX: Cast the rootReducer inside persistReducer to bridge the type mismatch between Redux Toolkit and redux-persist
const persistedReducer = persistReducer(persistConfig, rootReducer as unknown as Reducer);

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
// These remain perfectly strongly-typed so your useAppSelector hooks still get full autocomplete options!
export type RootState = ReturnType<typeof rootReducer>; 
export type AppDispatch = typeof store.dispatch;