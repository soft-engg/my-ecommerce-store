import { createSlice } from '@reduxjs/toolkit';
// this is initial value of state

// this is the slice for cart
export const cartslice = createSlice({
  name: 'cart',
  initialState: { cart: [] },
  reducers: {
    AddToCart: (state, action) => {
      const newItem = action.payload;
      const newItemExist = state.cart.find(
        (item) => item.slug === newItem.slug
      );
      if (newItemExist) {
        const newCart = state.cart.map((item) =>
          item.name === newItem.name ? newItem : item
        );
        state.cart = newCart;
      } else {
        state.cart.push(newItem);
      }
    },
  },
});

export const { AddToCart } = cartslice.actions;
export default cartslice.reducer;
