/* eslint-disable @next/next/no-img-element */
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AddToCart } from '../utils/redux/slices/cartSlice';

export default function ProductItem({ product, toast }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [givenQuantity, setQuantity] = useState(1);
  const itemsInCart = useSelector((state) => state.cart.cartItems);

  // function to handle add to cart
  const addToCartHandler = async () => {
    // dispatching the add to cart action
    const existItem = itemsInCart.find((item) => item.slug == product.slug);
    let quantity = 0;
    existItem
      ? (quantity = existItem.quantity + givenQuantity)
      : (quantity = givenQuantity);
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      toast.error('Sorry given number of item is not available..');
    } else {
      dispatch(
        AddToCart({
          ...product,
          quantity: quantity,
          color: product.color[0],
          size: product.size[0],
        })
      );
      toast.success('Product added to the cart!!');
    }
  };
  // function to tranfer to product screen
  function goToProdctScreen() {
    router.push(`/product/${product.slug}`);
  }

  return (
    <div className="card mx-2 md:mx-0 ">
      <div>
        <img
          src={product.image}
          alt={product.name}
          className="object-contain h-[250px]  cursor-pointer "
          onClick={goToProdctScreen}
        ></img>
      </div>

      <div
        className="flex text-gray-700 flex-col
       items-center justify-center pb-3  w-full"
      >
        <Link href={`/product/${product.slug}`}>
          <h2 className="text-lg font-medium cursor-pointer ">
            {' '}
            {product.name}
          </h2>
        </Link>
        <p className="">
          <span className="text-blue-700 font-bold ">{product.price}</span> Rs{' '}
        </p>
        {/* start */}
        <div className=" p-1 flex justify-between items-start w-2/5 ">
          <div
            onClick={() => {
              setQuantity((quantity) => {
                if (quantity >= 2) return quantity - 1;
                return (quantity = 1);
              });
            }}
            className="bg-transparent flex justify-center items-center font-bold text-center border-2
           md:text-2xl border-gray-400 rounded-lg leading-none 
           border w-6 h-6  shadow text-gray-700 hover:scale-110 active:scale-125"
          >
            <p>-</p>
          </div>
          <div className="mx-2 p-0 flex items-center  text-xl">
            {givenQuantity}
          </div>
          <button
            onClick={() => {
              setQuantity((quantity) => quantity + 1);
            }}
            className="bg-transparent flex justify-center items-center font-bold text-center border-2
          md:text-2xl border-gray-400 rounded-lg leading-none 
          border w-6 h-6  shadow text-gray-700 hover:scale-110 active:scale-125"
          >
            +
          </button>
        </div>
        {/* END */}
        <div
          onClick={addToCartHandler}
          className="primary-button font-medium flex items-center"
          type="button"
        >
          <img
            src="/icons/shoppingCart.png"
            alt="cart"
            className="w-6 h-6 mr-1"
          />
          Add To Cart
        </div>
      </div>
    </div>
  );
}
