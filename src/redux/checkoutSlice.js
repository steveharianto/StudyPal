import { createSlice } from "@reduxjs/toolkit";

const checkoutSlice = createSlice({
  name: "checkout",
  initialState: false,
  reducers: {
    setCheckout: (state, action) => {
      return action.payload;
    },
  },
});

export const { setCheckout } = checkoutSlice.actions;
export const selectCheckout = (state) => state.checkout;

export default checkoutSlice.reducer;
