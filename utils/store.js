import { useReducer, createContext } from 'react';

export const Store = createContext();
const initialState = {
  cart: [],
};
function reducer(state, action) {
  switch (action.type) {
    case 'CART_ADD_ITEM': {
      const newItem = action.payload;
      const existItem = state.cart.find((item) => item.slug === newItem.slug);
      const cartItems = existItem
        ? state.cart.map((item) =>
            item.name === existItem.name ? newItem : item
          )
        : [...state.cart, newItem];
      console.log(cartItems);
      return { ...state, cart: cartItems };
    }
  }
}
export default function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{children}</Store.Provider>;
}
