import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import Layout from '../../components/layout';
import data from '../../utils/data';
import { AddToCart } from '../../utils/redux/slices/cartSlice';
import { useDispatch, useSelector } from 'react-redux';

export default function ProductScreen() {
  const itemsInCart = useSelector((state) => state.cart.cart);
  // varable to store the query data from path
  const { query } = useRouter();
  console.log(query);
  // getting the slug part from the query
  const { slug } = query;
  //finding the query product from data available
  const product = data.products.find((x) => x.slug === slug);
  //getting the dispatch function to dispatch an action
  const dispatch = useDispatch();
  // handle the onclick function of add to cart
  function addToCartHandler() {
    // dispatching the add to cart action
    const existItem = itemsInCart.find((item) => item.slug == product.slug);
    let quantity = 0;
    existItem ? (quantity = existItem.quantity + 1) : (quantity = 1);
    product.countInStock < quantity
      ? alert(`sorry ${existItem.name} is not available`)
      : dispatch(AddToCart({ ...product, quantity: quantity }));
  }

  // if the product not exist then return this
  if (!product) return <div>product not found</div>;

  //else return this
  return (
    <Layout title={product.name}>
      <div className="p-1 font-bold rounded hover:text-gray-500 hover:ring-amber-300 hover:ring-1 mb-2  text-gray-500 border w-fit tracking-tighter  hover:text-gray-600 active:text-gray-800">
        <Link href="/"> Back to products</Link>
      </div>
      <div className="grid md:grid-cols-4 md:gap-3">
        <div className="md:col-span-2">
          <Image
            src={product.image}
            alt={product.image}
            width={640}
            height={640}
            layout="responsive"
            className="object-contain"
          ></Image>
        </div>
        {/* discription section */}
        <div className="flex justify-center md:block">
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
        {/* price card */}
        <div className="flex justify-center mt-2 md:mt-0 md:block">
          <div className=" border rounded-md shadow p-4 w-1/2 md:w-auto">
            <div className="mb-2 flex justify-evenly md:justify-between">
              <div>Price</div>
              <div>${product.price}</div>
            </div>

            <div className="mb-2 flex justify-evenly md:justify-between">
              <div>Status</div>
              <div>{product.countInStock > 0 ? 'In Stock' : 'Unavailable'}</div>
            </div>
            <div className="flex  justify-center">
              <button
                className="primary-button  md:w-full "
                onClick={addToCartHandler}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
