import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
  mode: "summary", // summary, edit-menu, edit-info, edit-avatar, edit-password, edit-email
  subscriptionEnabled: true,
  loading: false,
  error: null,
  success: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthState: (state, action) => {
      const { user, token, isAuthenticated } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = isAuthenticated;
    },
    setMode: (state, action) => {
      state.mode = action.payload;
    },
    setSubscriptionEnabled: (state, action) => {
      state.subscriptionEnabled = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setSuccess: (state, action) => {
      state.success = action.payload;
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
    clearAuth: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.mode = "summary";
      state.error = null;
      state.success = null;
    },
    clearMessages: (state) => {
      state.error = null;
      state.success = null;
    },
  },
});

export const {
  setAuthState,
  setMode,
  setSubscriptionEnabled,
  setLoading,
  setError,
  setSuccess,
  updateUser,
  clearAuth,
  clearMessages,
} = authSlice.actions;

export default authSlice.reducer;
