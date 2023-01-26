import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
// this is the slice for cart
export const cartslice = createSlice({
  name: 'cart',
  initialState: {
    cartItems: Cookies.get('cart')
      ? JSON.parse(Cookies.get('cart')).cartItems
      : [],
    ShippingAddress: Cookies.get('cart')
      ? JSON.parse(Cookies.get('cart')).ShippingAddress
      : {},
    PaymenMethod: Cookies.get('cart')
      ? JSON.parse(Cookies.get('cart')).PaymenMethod
      : '',
  },
  reducers: {
    AddToCart: (state, action) => {
      const newItem = action.payload;

      const newItemExist = state.cartItems.find(
        (item) =>
          item.slug === newItem.slug &&
          item.color === newItem.color &&
          item.size === newItem.size
      );
      if (newItemExist) {
        const newCart = state.cartItems.map((item) =>
          item.name === newItem.name &&
          item.size === newItem.size &&
          item.color === newItem.color
            ? newItem
            : item
        );
        state.cartItems = newCart;
      } else {
        state.cartItems.push(newItem);
      }

      Cookies.set('cart', JSON.stringify(state));
      return state;
    },
    RemoveFromCart: (state, action) => {
      const dItem = action.payload;
      state.cartItems = state.cartItems.filter(
        (item) =>
          item.slug !== dItem.slug ||
          item.color !== dItem.color ||
          item.size !== dItem.size
      );
      Cookies.set('cart', JSON.stringify(state));
      return state;
    },
    CartReset: (state) => {
      state = {
        ...state,
        cartItems: [],
        shippingAddress: { Location: {} },
        paymentMethod: '',
      };
      Cookies.set('cart', JSON.stringify(state));
      return state;
    },
    // save shipping address reducer
    SaveShippingAddress: (state, action) => {
      state = {
        ...state,
        ShippingAddress: { ...state.ShippingAddress, ...action.payload },
      };
      Cookies.set('cart', JSON.stringify(state));

      return state;
    },
    // sav paymen reducer
    SavePaymentMethod: (state, action) => {
      state = {
        ...state,
        PaymenMethod: action.payload,
      };

      Cookies.set('cart', JSON.stringify(state));
      return state;
    },
  },
});

export const {
  AddToCart,
  RemoveFromCart,
  IncreaseProduct,
  CartReset,
  SaveShippingAddress,
  SavePaymentMethod,
} = cartslice.actions;
export default cartslice.reducer;
