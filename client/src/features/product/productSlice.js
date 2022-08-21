import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { STATUSES } from "../../utils/STATUSES";

const initialState = {
  products: [],
  resultPerPage: 0,
  totalProductsCount: 0,
  filteredProductsCount: 0,
  status: STATUSES.IDLE,
  productDetails: {},
  errorMessage: "",
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    //  for fetchProducts
    setProducts(state, action) {
      state.products = action.payload;
    },
    setResultPerPage(state, action) {
      state.resultPerPage = action.payload;
    },
    setTotalProductsCount(state, action) {
      state.totalProductsCount = action.payload;
    },
    setFilteredProductsCount(state, action) {
      state.filteredProductsCount = action.payload;
    },
    setStatus(state, action) {
      state.status = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      //  for fetchProductDetails
      .addCase(fetchProductDetails.pending, (state, action) => {
        state.status = STATUSES.LOADING;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.productDetails = action.payload.product;
        state.status = STATUSES.IDLE;
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.status = STATUSES.ERROR;
        state.errorMessage = action.payload.message;
      });
  },
});

export const {
  setProducts,
  setResultPerPage,
  setTotalProductsCount,
  setFilteredProductsCount,
  setStatus,
} = productSlice.actions;
export default productSlice.reducer;

export const fetchAllProducts =
  (search = "", currentPage = 1, price = [0, 5000], category, ratings = 0) =>
  async (dispatch) => {
    dispatch(setStatus(STATUSES.LOADING));
    try {
      let LINK = `/api/v1/products?search=${search}&page=${currentPage}&price[gte]=${price[0]}&price[lte]=${price[1]}&ratings[gte]=${ratings}`;

      if (category) {
        LINK = `/api/v1/products?search=${search}&page=${currentPage}&price[gte]=${price[0]}&price[lte]=${price[1]}&category=${category}&ratings[gte]=${ratings}`;
      }

      const res = await fetch(LINK);
      const data = await res.json();
      dispatch(setProducts(data.products));
      dispatch(setResultPerPage(data.resultPerPage));
      dispatch(setTotalProductsCount(data.totalProductsCount));
      dispatch(setFilteredProductsCount(data.filteredProductsCount));

      dispatch(setStatus(STATUSES.IDLE));
    } catch (error) {
      console.log(error);
      dispatch(setStatus(STATUSES.ERROR));
    }
  };

export const fetchProductDetails = createAsyncThunk(
  "productDetails/fetch",
  async (id) => {
    const { data } = await axios.get(`/api/v1/product/${id}`);
    return data;
  }
);
