/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AddToCart } from '../utils/redux/slices/cartSlice';
export default function ProductItem({ product }) {
  const itemsInCart = useSelector((state) => state.cart.cart);
  const dispatch = useDispatch();
  const router = useRouter();

  // function to handle add to cart
  function addToCartHandler() {
    // dispatching the add to cart action
    const existItem = itemsInCart.find((item) => item.slug == product.slug);
    let quantity = 0;
    existItem ? (quantity = existItem.quantity + 1) : (quantity = 1);
    product.countInStock < quantity
      ? alert(`sorry ${existItem.name} is not available`)
      : dispatch(AddToCart({ ...product, quantity: quantity }));
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
          className="object-contain h-[330px]  cursor-pointer "
          onClick={goToProdctScreen}
        ></img>
      </div>

      <div className="flex flex-col items-center justify-center p-5">
        <Link href={`/product/${product.slug}`}>
          <h2 className="text-lg cursor-pointer"> a{product.name}</h2>
        </Link>
        <p className="mb-2">{product.brand}</p>
        <button
          onClick={addToCartHandler}
          className="primary-button"
          type="button"
        >
          Add To Cart
        </button>
      </div>
    </div>
  );
}
