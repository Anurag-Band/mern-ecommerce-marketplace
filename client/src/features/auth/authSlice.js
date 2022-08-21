import { createSlice, createAsyncThunk, isAnyOf } from "@reduxjs/toolkit";
import axios from "axios";
import { STATUSES } from "../../utils/STATUSES";

const initialState = {
  user: null,
  isAuthenticated: false,
  status: STATUSES.IDLE,
  statusMessage: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.status = null;
      state.statusMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // for logoutUser ->>
      .addCase(logoutUser.pending, (state) => {
        state.status = STATUSES.LOADING;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.status = STATUSES.IDLE;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.status = STATUSES.ERROR;
      })
      // for loginUser, registerUser, loadUser ->>
      .addMatcher(
        isAnyOf(loginUser.pending, registerUser.pending, loadUser.pending),
        (state, action) => {
          state.status = STATUSES.LOADING;
          state.isAuthenticated = false;
        }
      )
      .addMatcher(
        isAnyOf(
          loginUser.fulfilled,
          registerUser.fulfilled,
          loadUser.fulfilled
        ),
        (state, action) => {
          state.user = action.payload.user;
          state.isAuthenticated = true;
          state.status = STATUSES.IDLE;
        }
      )
      .addMatcher(
        isAnyOf(loginUser.rejected, registerUser.rejected, loadUser.rejected),
        (state, action) => {
          state.status = STATUSES.ERROR;
          state.statusMessage = action.payload.error;
          state.user = null;
          state.isAuthenticated = false;
        }
      );
  },
});

export const { clearErrors } = authSlice.actions;
export default authSlice.reducer;

// for loginUser ->>
export const loginUser = createAsyncThunk(
  "user/login",
  async ({ email, password }, { rejectWithValue }) => {
    const config = { headers: { "Content-Type": "application/json" } };
    const { data } = await axios.post(
      "/api/v1/login",
      { email, password },
      config
    );

    if (data.error) {
      return rejectWithValue(data);
    }

    return data;
  }
);

// for registerUser ->>
export const registerUser = createAsyncThunk(
  "user/signup",
  async (formData, { rejectWithValue }) => {
    const { name, email, password, photo } = formData;
    const config = { headers: { "Content-Type": "application/json" } };
    const { data } = await axios.post(
      "/api/v1/signup",
      { name, email, password, photo },
      config
    );

    if (data.error) {
      return rejectWithValue(data);
    }

    return data;
  }
);

// for loadUser ->>
export const loadUser = createAsyncThunk(
  "user/load",
  async (_, { rejectWithValue }) => {
    const { data } = await axios.get("/api/v1/me");

    if (data.error) {
      return rejectWithValue(data);
    }

    return data;
  }
);

// for logoutUser ->>
export const logoutUser = createAsyncThunk(
  "user/logout",
  async (_, { rejectWithValue }) => {
    const { data } = await axios.get("/api/v1/logout");

    if (data.error) {
      return rejectWithValue(data);
    }

    return data;
  }
);
