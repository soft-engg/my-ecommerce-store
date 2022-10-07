/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

export default function ProductItem({ product }) {
  const router = useRouter();
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
        <button className="primary-button" type="button">
          Add To Cart
        </button>
      </div>
    </div>
  );
}
