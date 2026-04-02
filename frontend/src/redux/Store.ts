import { configureStore } from "@reduxjs/toolkit";
import AuthModalReducer from "./slices/AuthModalSlice";
export const Store = configureStore({
  reducer: {
    authModal: AuthModalReducer,
  },
});

export type RootState = ReturnType<typeof Store.getState>;
export type AppDispatch = typeof Store.dispatch;
