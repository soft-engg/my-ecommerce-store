/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

export default function ProductItem({ product }) {
  const router = useRouter();

  // function to tranfer to product screen
  function goToProdctScreen() {
    router.push(`/product/${product.slug}`);
  }

  return (
    <div className="card mx-2 md:mx-0 items-center bg-black">
      <div>
        <img
          src={product.image[0]}
          alt={product.name}
          className="object-contain h-[180px]   cursor-pointer "
          onClick={goToProdctScreen}
        ></img>
      </div>
      <Link href={`/product/${product.slug}`}>
        <h2 className=" cursor-pointer font-semibold text-amber-400 ">
          {product.name}
        </h2>
      </Link>
      <p className=" text-sm text-white font-semibold"> {product.brand}</p>
      <h2 className="  cursor-pointer text-white">Rs. {product.price}</h2>
      <Link href={`/product/${product.slug}`}>
        <button
          className="bg-amber-400 h-8 hover:bg-amber-200 transition-all w-full
           font-semibold text-black  text-center"
          type="button"
        >
          View Details
        </button>
      </Link>
    </div>
  );
}
