import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { STATUSES } from "../../utils/STATUSES";

const SHIPPING_INFO = "shippingInfo";

const initialState = {
  shippingInfo: localStorage.getItem(SHIPPING_INFO)
    ? JSON.parse(localStorage.getItem(SHIPPING_INFO))
    : {},
  order: {},
  status: STATUSES.IDLE,
  message: null,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setShippingInfo: (state, action) => {
      state.shippingInfo = action.payload;
      localStorage.setItem(SHIPPING_INFO, JSON.stringify(action.payload));
    },
    clearErrors: (state) => {
      state.status = STATUSES.IDLE;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.status = STATUSES.LOADING;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.status = STATUSES.IDLE;
        state.order = action.payload.order;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.status = STATUSES.ERROR;
        state.message = action.payload.error;
      });
  },
});

export const { setShippingInfo, clearErrors } = orderSlice.actions;
export default orderSlice.reducer;

export const createOrder = createAsyncThunk(
  "order/create",
  async ({ order }, { rejectWithValue }) => {
    try {
      const config = {
        headers: { "Content-Type": "application/json" },
      };

      const { data } = await axios.post("/api/v1/order/new", order, config);

      return data;
    } catch (error) {
      rejectWithValue(error.message);
    }
  }
);
