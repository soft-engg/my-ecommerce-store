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
    <div className="card ">
      <div className="">
        <img
          src={product.image[0]}
          alt={product.name}
          className="object-contain h-[150px]  cursor-pointer "
          onClick={goToProdctScreen}
        ></img>
      </div>
      <Link href={`/product/${product.slug}`}>
        <h2 className=" cursor-pointer font-semibold text-amber-400 ">
          {product.name}
        </h2>
      </Link>
      <p className=" text-sm cursor-default text-white font-semibold">
        {product.brand}
      </p>
      <h2 className="  cursor-default text-white">Rs. {product.price}</h2>
      <Link href={`/product/${product.slug}`}>
        <button
          className="bg-gray-600 h-8 hover:bg-amber-400 hover:text-black
           transition-all w-full ease-out 
           font-semibold text-white  text-center rounded-b-lg"
          type="button"
        >
          View Details
        </button>
      </Link>
    </div>
  );
}
