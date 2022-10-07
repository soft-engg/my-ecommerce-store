import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
// this is the slice for cart
export const cartslice = createSlice({
  name: 'cart',
  initialState: {
    cart: Cookies.get('cart') ? JSON.parse(Cookies.get('cart')) : [],
  },
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
      console.log('items are ', state.cart);
      Cookies.set('cart', JSON.stringify(state.cart));
    },
    RemoveFromCart: (state, action) => {
      const dItem = action.payload;
      state.cart = state.cart.filter((item) => item.slug !== dItem.slug);
      Cookies.set('cart', JSON.stringify(state.cart));
    },
  },
});

export const { AddToCart, RemoveFromCart, IncreaseProduct } = cartslice.actions;
export default cartslice.reducer;
