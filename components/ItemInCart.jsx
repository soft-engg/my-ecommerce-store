import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { AddToCart, RemoveFromCart } from '../utils/redux/slices/cartSlice';
import axios from 'axios';
export default function ItemInCart({ item, toast }) {
  const dispatch = useDispatch();

  const itemsInCart = useSelector((state) => state.cart.cartItems);

  function removeFromCart() {
    dispatch(RemoveFromCart({ ...item, size: item.size, color: item.color }));
  }

  function decreaseProduct() {
    const existItem = itemsInCart.find(
      (i) =>
        i.slug === item.slug && i.size === item.size && i.color === item.color
    );
    let quantity = 0;
    existItem ? (quantity = item.quantity - 1) : (quantity = 1);
    quantity < 1
      ? toast.info(`to delete item click remove`)
      : dispatch(
          AddToCart({
            ...item,
            quantity: quantity,
            size: item.size,
            color: item.color,
          })
        );
  }

  async function increaseProduct() {
    const existItem = itemsInCart.find(
      (i) =>
        i.slug === item.slug && i.size === item.size && i.color === item.color
    );
    let quantity = 0;

    existItem ? (quantity = existItem.quantity + 1) : (quantity = 1);
    const { data } = await toast.promise(
      () => axios.get(`/api/products/${item._id}`),
      {
        pending: 'checking for product availablity',
        error: 'Some error occured',
      }
    );
    let qInCart = 0;
    itemsInCart.forEach((i) => {
      if (i.slug === item.slug) qInCart += item.quantity;
    });
    qInCart += 1;

    data.countInStock < qInCart
      ? toast.error(`sorry ${existItem.name} is out of stock...`)
      : dispatch(
          AddToCart({
            ...item,
            quantity: quantity,
            size: item.size,
            color: item.color,
          })
        );
  }

  return (
    <div className="flex justify-between py-2 text-white w-full md:mr-2  ">
      <div className="w-4/12 flex flex-wrap">
        <Link href={`/product/${item.slug}`}>
          <a
            className="ml-2 text-amber-400 text-center cursor-pointer 
          font-bold text-amber-400 hover:text-amber-400"
          >
            {item.name} {item.color} {item.size}
          </a>
        </Link>
      </div>
      <div
        className="w-2/12 p-0 flex
       justify-between sm:justify-around h-1/6 items-center"
      >
        <div
          onClick={decreaseProduct}
          className=" grow-0  
            shadow-lg width-1/4"
        >
          <button
            className="flex justify-center  font-bold text-center
           md:text-2xl border-amber-400 sm:rounded-lg leading-none 
           border-2 items-center  border-amber-400 
           rounded leading-none  shadow text-amber-400 hover:scale-110 
           active:scale-125  w-4 h-4 md:w-6 md:h-6 "
          >
            -
          </button>
        </div>
        <div className="w-2/4 flex justify-center text-amber-400  font-bold text-lg ">
          {item.quantity}
        </div>
        <div
          onClick={increaseProduct}
          className="bg-transparent grow-0  
            shadow-lg width-1/4"
        >
          <button
            className="flex justify-center font-bold text-center
           md:text-2xl border-amber-400 rounded sm:rounded-lg leading-none 
           border-2 items-center md:text-2xl border-amber-400 
            leading-none  shadow text-amber-400 hover:scale-110 
           active:scale-125  w-4 h-4 md:w-6 md:h-6 "
          >
            +
          </button>
        </div>
      </div>

      <h2 className="w-4/12 text-center text-lg">Rs. {item.price}</h2>
      <div className="w-2/12   flex justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/icons/bin.png"
          alt=""
          className="h-7 w-7 hover:scale-110 active:scale-110 cursor-pointer"
          onClick={() => removeFromCart()}
        />
      </div>
    </div>
  );
}
