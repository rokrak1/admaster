import { IUser } from "@/context/auth.context";
import { createSlice } from "@reduxjs/toolkit";

export const USER_PREFIX = "user";

export type UserSlice = {
  user: IUser;
  accessToken: string;
};

const initialUser: UserSlice = {
  user: {} as IUser,
  accessToken: "",
};

export const userSlice = createSlice({
  name: USER_PREFIX,
  initialState: initialUser,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
    setAccessToken(state, action) {
      state.accessToken = action.payload;
    },
    setUserAndToken(state, action) {
      state.user = action.payload.user;
      state.accessToken = action.payload.token;
    },
  },
});

const userReducer = userSlice.reducer;
export const userActions = userSlice.actions;
export default userReducer;
