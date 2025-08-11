import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
  // Add other user fields you expect
  [key: string]: any;
}

const initialState: UserState = {};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserState>) {
      return { ...state, ...action.payload };
    },
    clearUser() {
      return {};
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
