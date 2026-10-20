import { createSlice } from "@reduxjs/toolkit";
import { checkTokenExpiration } from "../../../utils/TokenExpiration";

const initialState = {
  accessToken: null,
  refreshToken: null,
  userType: null,
  isAuthenticated: false,
  userId: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginAuth: (state, action) => {
      const { accessToken, refreshToken, userType, userId } = action.payload;
      console.log("userId",userId);
      
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.userType = userType;
      state.userId = userId;
      state.isAuthenticated = !checkTokenExpiration(accessToken);
    },
    logoutAuth: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.userType = null;
      state.userId = null;
      state.isAuthenticated = false;
    },
  },
});

export const { loginAuth, logoutAuth } = authSlice.actions;
export default authSlice.reducer;
