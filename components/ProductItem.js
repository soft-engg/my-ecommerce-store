/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import React from 'react';

export default function ProductItem({ product }) {
  return (
    <div className="card ">
      <div className="flex-grow">
        <Link href={`/product/${product.slug}`}>
          <a>
            <img
              src={product.image}
              alt={product.name}
              className="object-contain max-h-[300px]"
            ></img>
          </a>
        </Link>
      </div>

      <div className=" flex flex-col items-center justify-center p-5">
        <Link href={`/product/${product.slug}`}>
          <h2 className="text-lg cursor-pointer"> a{product.name}</h2>
        </Link>
        <p className="mb-2">{product.brand}</p>
        <button className="primary-button" type="button">
          Add To Cart
        </button>
      </div>
    </div>
  );
}
