import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import axios from "axios";
import { VARIABLE } from "../Data/variable";

export const fetchUser = createAsyncThunk(
  "user/fetchUser",
  async (username) => {
    const res = await axios.get(`${VARIABLE.url}/user/${username}}`);
    return res.data;
  }
);

const initialUser = {
  data: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState: initialUser,
  reducers: {
    setUser(state, action) {
      state.data = action.payload;
    },
    clearUser(state) {
      state.atitute = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.data = action.error.message;
      });
  },
});
export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
