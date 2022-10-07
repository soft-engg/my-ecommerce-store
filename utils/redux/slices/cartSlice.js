import { createSlice } from '@reduxjs/toolkit';
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
    RemoveFromCart: (state, action) => {
      const dItem = action.payload;
      state.cart = state.cart.filter((item) => item.slug !== dItem.slug);
    },
    IncreaseProduct: (state, action) => {
      const increaseItem = action.payload;
      state.cart = state.cart.map((item) => {
        item.slug === increaseItem.slug ? item.quantity++ : item;
      });
    },
  },
});

export const { AddToCart, RemoveFromCart, IncreaseProduct } = cartslice.actions;
export default cartslice.reducer;
