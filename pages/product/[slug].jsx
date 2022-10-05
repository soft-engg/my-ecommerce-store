import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import Layout from '../../components/layout';
import data from '../../utils/data';

import { AddToCart } from '../../utils/redux/slices/cartSlice';
import { useDispatch } from 'react-redux';
export default function ProductScreen() {
  //const itemsInCart = useSelector((state) => state.cart.cart);
  // varable to store the query data from path
  const { query } = useRouter();
  // getting the slug part from the query
  const { slug } = query;
  //finding the query product from data available
  const product = data.products.find((x) => x.slug === slug);
  //getting the dispatch function to dispatch an action
  const dispatch = useDispatch();
  // handle the onclick function of add to cart
  function addToCartHandler() {
    // dispatching the add to cart action
    dispatch(AddToCart(product));
  }
  // if the product not exist then return this
  if (!product) return <div>product not found</div>;
  //else return this
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
              <h1 className="text-lg">{product.name}</h1>
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
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
