import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import bookingReducer from "./slices/bookingSlice";
import chatReducer from "./slices/chatSlice";
import notificationReducer from "./slices/notificationSlice";
import { persistReducer, persistStore } from "redux-persist";
import storage from "./storage";

const bookingPersistConfig = {
  key: "booking",
  storage,
};

const notificationPersistConfig = {
  key: "notification",
  storage,
  whitelist: ["settings", "pushToken", "permissionStatus"], // Only persist these fields
};

const rootReducer = combineReducers({
  auth: authReducer,
  booking: persistReducer(bookingPersistConfig, bookingReducer),
  chat: chatReducer,
  notification: persistReducer(notificationPersistConfig, notificationReducer),
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
