import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { AddToCart, RemoveFromCart } from '../utils/redux/slices/cartSlice';
export default function ItemInCart({ item }) {
  const dispatch = useDispatch();

  const itemsInCart = useSelector((state) => state.cart.cartItems);

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
        <div
          onClick={decreaseProduct}
          className="bg-transparent flex justify-center items-center font-bold text-center border-2
           md:text-2xl border-gray-400 rounded-lg leading-none 
           border w-6 h-6  shadow text-red-700 hover:scale-110 active:scale-125"
        >
          <p>-</p>
        </div>
        <div>{item.quantity}</div>
        <button
          onClick={increaseProduct}
          className="bg-transparent flex justify-center items-center font-bold text-center border-2
          md:text-2xl border-gray-400 rounded-lg leading-none 
          border w-6 h-6  shadow text-blue-700 hover:scale-110 active:scale-125"
        >
          +
        </button>
      </div>

      <h2 className="w-1/5 text-center">Rs : {item.price}</h2>
      <div className="w-1/5 flex justify-center">
        <img
          src="/icons/bin.png"
          alt=""
          className="h-7 w-7 hover:scale-105 active:scale-110 cursor-pointer"
          onClick={() => removeFromCart()}
        />
      </div>
    </div>
  );
}
