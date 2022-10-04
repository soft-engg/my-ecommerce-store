import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import Layout from '../../components/layout';
import data from '../../utils/data';
import { Store } from '../../utils/store';

export default function ProductScreen() {
  const { query } = useRouter();
  const { slug } = query;
  const product = data.products.find((x) => x.slug === slug);
  const { state, dispatch } = useContext(Store);
  function addToCartHandler() {
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity: 1 } });
  }
  if (!product) return <div>product not found</div>;
  return (
    <Layout title={product.name}>
      <div className="pb-2 text-lg text-blue-500 tracking-tighter hover:underline hover:text-blue-600 active:text-blue-700">
        <Link href="/">{' Back to products'}</Link>
      </div>
      <div className="grid md:grid-cols-4 md:gap-3">
        <div className="md:col-span-2">
          <Image
            src={product.image}
            alt={product.image}
            width={640}
            height={640}
            layout="responsive"
          ></Image>
        </div>
        <div>
          <ul>
            <li>
              <h1 className="text-lg">product.name</h1>
            </li>
            <li>Category: {product.category}</li>
            <li>Brand: {product.brand}</li>
            <li>
              {product.rating} of {product.numReviews}
            </li>
            <li>{product.desription}</li>
          </ul>
        </div>
        <div>
          <div className="card p-5">
            <div className="mb-2 flex justify-between">
              <div>Price</div>
              <div>${product.price}</div>
            </div>
            <div className="mb-2 flex justify-between">
              <div>Status</div>
              <div>{product.countInStock > 0 ? 'In Stock' : 'Unavailable'}</div>
            </div>
            <button
              className="primary-button w-full"
              onClick={addToCartHandler}
            >
              {' '}
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
