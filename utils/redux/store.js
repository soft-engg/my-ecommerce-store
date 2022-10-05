import cartReducer from '../redux/slices/cartSlice';
import { configureStore } from '@reduxjs/toolkit';
export const store = configureStore({ reducer: { cart: cartReducer } });
