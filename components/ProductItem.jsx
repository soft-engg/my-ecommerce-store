/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AddToCart } from '../utils/redux/slices/cartSlice';
export default function ProductItem({ product, toast }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  // function to handle add to cart
  function addToCartHandler() {
    // dispatching the add to cart action

    dispatch(AddToCart({ ...product, quantity: quantity }));
    toast.success(product.name + ' added to cart');
  }
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
        <div className=" p-1 flex justify-between items-start ">
          <div
            onClick={() => {
              setQuantity((quantity) => {
                if (quantity >= 2) return quantity - 1;
                return (quantity = 1);
              });
            }}
            className="bg-transparent flex justify-center items-center font-bold text-center border-2
           md:text-2xl border-gray-400 rounded-lg leading-none 
           border w-6 h-6  shadow text-red-700 hover:scale-110 active:scale-125"
          >
            <p>-</p>
          </div>
          <div className="mx-2 p-0 flex items-center  text-xl">{quantity}</div>
          <button
            onClick={() => {
              setQuantity((quantity) => quantity + 1);
            }}
            className="bg-transparent flex justify-center items-center font-bold text-center border-2
          md:text-2xl border-gray-400 rounded-lg leading-none 
          border w-6 h-6  shadow text-blue-700 hover:scale-110 active:scale-125"
          >
            +
          </button>
        </div>
        {/* END */}
        <button
          onClick={addToCartHandler}
          className="primary-button font-medium"
          type="button"
        >
          Add To Cart
        </button>
      </div>
    </div>
  );
}
