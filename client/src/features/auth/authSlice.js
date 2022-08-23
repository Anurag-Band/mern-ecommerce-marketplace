import { createSlice, createAsyncThunk, isAnyOf } from "@reduxjs/toolkit";
import axios from "axios";
import { STATUSES } from "../../utils/STATUSES";

const initialState = {
  user: null,
  isAuthenticated: false,
  status: STATUSES.IDLE,
  statusMessage: null,
  isUpdated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.status = STATUSES.IDLE;
      state.statusMessage = null;
    },
    updateReset: (state) => {
      state.isUpdated = false;
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

      // for updateProfile, updatePassword ->>
      .addMatcher(
        isAnyOf(updateProfile.pending, updatePassword.pending),
        (state, action) => {
          state.status = STATUSES.LOADING;
        }
      )
      .addMatcher(
        isAnyOf(updateProfile.fulfilled, updatePassword.fulfilled),
        (state, action) => {
          state.status = STATUSES.IDLE;
          state.statusMessage = "Profile Update Successfully";
          state.isUpdated = action.payload.user;
        }
      )
      .addMatcher(
        isAnyOf(updateProfile.rejected, updatePassword.rejected),
        (state, action) => {
          state.status = STATUSES.ERROR;
          state.statusMessage = action.payload.error;
          state.isUpdated = false;
        }
      )

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

export const { clearErrors, updateReset } = authSlice.actions;
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

// for updateProfile ->>
export const updateProfile = createAsyncThunk(
  "user/profile/update",
  async (userData, { rejectWithValue }) => {
    const { name, email, photo } = userData;
    const config = { headers: { "Content-Type": "application/json" } };

    const { data } = await axios.put(
      "/api/v1/me/update",
      { name, email, photo },
      config
    );

    if (data.error) {
      return rejectWithValue(data);
    }

    return data;
  }
);

// for updatePassword ->>
export const updatePassword = createAsyncThunk(
  "user/password/change",
  async ({ formData }, { rejectWithValue }) => {
    try {
      let formObject = {};
      formData.forEach(function (value, key) {
        formObject[key] = value;
      });

      const config = {
        headers: { "Content-Type": "application/json" },
      };

      const { data } = await axios.put(
        "/api/v1/password/update",
        formObject,
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
