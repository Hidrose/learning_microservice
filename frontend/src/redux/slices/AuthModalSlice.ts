import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type AuthType = "login" | "register" | null;

interface AuthModalState {
  type: AuthType;
}

const initialState: AuthModalState = { type: null };

const AuthModalSlice = createSlice({
  name: "authModal",
  initialState,
  reducers: {
    openAuthModal: (state, action: PayloadAction<Exclude<AuthType, null>>) => {
      state.type = action.payload;
    },
    closeAuthModal: (state) => {
      state.type = null;
    },
    switchAuthModal: (state, action: PayloadAction<Exclude<AuthType, null>>) => {
      state.type = action.payload;
    },
  },
});

export const { openAuthModal, closeAuthModal, switchAuthModal } = AuthModalSlice.actions;
export default AuthModalSlice.reducer;