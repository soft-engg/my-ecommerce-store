import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { AddToCart, RemoveFromCart } from '../utils/redux/slices/cartSlice';
export default function ItemInCart({ item }) {
  const dispatch = useDispatch();
  const itemsInCart = useSelector((state) => state.cart.cart);

  function removeFromCart() {
    dispatch(RemoveFromCart(item));
  }

  function decreaseProduct() {
    const existItem = itemsInCart.find((i) => i.slug == item.slug);
    let quantity = 0;
    existItem ? (quantity = item.quantity - 1) : (quantity = 1);
    quantity < 1
      ? alert(`to delete item click remove`)
      : dispatch(AddToCart({ ...item, quantity: quantity }));
  }

  function increaseProduct() {
    const existItem = itemsInCart.find((i) => i.slug == item.slug);
    let quantity = 0;
    existItem ? (quantity = existItem.quantity + 1) : (quantity = 1);
    item.countInStock < quantity
      ? alert(`sorry ${existItem.name} is not available`)
      : dispatch(AddToCart({ ...item, quantity: quantity }));
  }
  return (
    <div className="flex py-2 w-full  md:mr-2  ">
      <div className="w-2/5 flex">
        <Link href={`/product/${item.slug}`}>
          <img
            src={item.image}
            alt={item.name}
            className="h-14 w-14 object-contain cursor-pointer ease-in-out duration-300 hover:scale-125"
          />
        </Link>
        <Link href={`/product/${item.slug}`}>
          <div className="ml-2 text-center cursor-pointer font-bold hover:text-gray-700">
            {item.name}
          </div>
        </Link>
      </div>
      <div className="w-1/5 p-0 flex justify-between h-1/6 items-start">
        <button
          onClick={decreaseProduct}
          className="text-center md:text-xl leading-none  border w-8  shadow text-red-700 hover:scale-110 active:scale-125"
        >
          -
        </button>
        <div>{item.quantity}</div>
        <button
          onClick={increaseProduct}
          className="text-center border md:text-xl leading-none  w-8 shadow text-green-700 hover:scale-110 active:text-green-900 active:scale-125"
        >
          +
        </button>
      </div>

      <h2 className="w-1/5 text-center">${item.price}</h2>
      <div className="w-1/5 flex justify-center">
        <button
          className=" w-2/5 h-1/2 font-bold bg-red-500 hover:bg-red-600 active:bg-red-700 rounded text-white"
          onClick={removeFromCart}
        >
          x
        </button>
      </div>
    </div>
  );
}
