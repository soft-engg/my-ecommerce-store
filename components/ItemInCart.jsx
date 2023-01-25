import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { AddToCart, RemoveFromCart } from '../utils/redux/slices/cartSlice';
import axios from 'axios';
export default function ItemInCart({ item, toast }) {
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
      ? toast.info(`to delete item click remove`)
      : dispatch(AddToCart({ ...item, quantity: quantity }));
  }

  async function increaseProduct() {
    const existItem = itemsInCart.find((i) => i.slug == item.slug);
    let quantity = 0;
    existItem ? (quantity = existItem.quantity + 1) : (quantity = 1);
    const { data } = await axios.get(`/api/products/${item._id}`);
    data.countInStock < quantity
      ? toast.error(`sorry ${existItem.name} is out of stock...`)
      : dispatch(AddToCart({ ...item, quantity: quantity }));
  }

  return (
    <div className="flex py-2 w-full md:mr-2  ">
      <div className="w-2/5 flex">
        <Link href={`/product/${item.slug}`}>
          <img
            src={item.image}
            alt={item.name}
            className="h-12 w-12 object-contain cursor-pointer ease-in-out duration-300 hover:scale-125"
          />
        </Link>
        <Link href={`/product/${item.slug}`}>
          <div className="ml-2 text-center cursor-pointer font-bold text-blue-600 hover:text-gray-700">
            {item.name}
          </div>
        </Link>
      </div>
      <div className="w-1/5 p-0 flex justify-between h-1/6 items-start">
        <div
          onClick={decreaseProduct}
          className="bg-transparent grow-0  
           border shadow-lg width-1/4"
        >
          <p
            className="flex justify-center font-bold text-center
           md:text-2xl border-gray-400 rounded-lg leading-none 
           border-2 items-center md:text-2xl border-gray-400 
           rounded-lg leading-none  shadow text-gray-700 hover:scale-110 
           active:scale-125  w-6 h-6"
          >
            -
          </p>
        </div>
        <div className="w-2/4 flex justify-center ">{item.quantity}</div>
        <div
          onClick={increaseProduct}
          className="w-1/4 bg-transparent grow-0  
           border shadow-lg"
        >
          <p
            className="flex justify-center font-bold text-center
           md:text-2xl border-gray-400 rounded-lg leading-none 
           border-2 items-center md:text-2xl border-gray-400 
           rounded-lg leading-none  shadow text-gray-700 hover:scale-110 
           active:scale-125  w-6 h-6"
          >
            +
          </p>
        </div>
      </div>

      <h2 className="w-1/5 text-center">Rs : {item.price}</h2>
      <div className="w-1/5 flex justify-center">
        <img
          src="/icons/bin.png"
          alt=""
          className="h-6 w-6 hover:scale-105 active:scale-110 cursor-pointer"
          onClick={() => removeFromCart()}
        />
      </div>
    </div>
  );
}
