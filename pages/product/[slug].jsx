import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import Layout from '../../components/layout';
import { AddToCart } from '../../utils/redux/slices/cartSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import db from '../../utils/db';
import Product from '../../models/prodcut';

export default function ProductScreen(props) {
  const { product } = props;
  const [givenSize, setGivenSize] = useState();
  const [givenColor, setGivenColor] = useState();
  const itemsInCart = useSelector((state) => state.cart.cartItems);

  // // varable to store the query data from path
  // const { query } = useRouter();
  // // getting the slug part from the query
  // const { slug } = query;
  // //finding the query product from data available
  // const product = data.products.find((x) => x.slug === slug);
  //getting the dispatch function to dispatch an action
  const dispatch = useDispatch();
  // handle the onclick function of add to cart
  function addToCartHandler() {
    if (!givenSize && !givenColor) {
      toast.error('please select both size & color');
    } else {
      // dispatching the add to cart action
      const existItem = itemsInCart.find((item) => item.slug == product.slug);
      let quantity = 0;
      existItem ? (quantity = existItem.quantity + 1) : (quantity = 1);
      if (product.countInStock < quantity) {
        toast.error('sorry Item is out of stock for now!!');
      } else {
        dispatch(AddToCart({ ...product, quantity: quantity }));
        toast.success('Product added to the cart!!');
      }
    }
  }

  // if the product not exist then return this
  if (!product)
    return (
      <Layout title="product not found">
        <div>product not found</div>
      </Layout>
    );

  //else return this
  return (
    <Layout title={product.name}>
      <ToastContainer
        position="bottom-center"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <div className="default-link">
        <Link href="/">Back to products</Link>
      </div>
      <div className="grid md:grid-cols-4 md:gap-3">
        <div className="md:col-span-2 ">
          <Image
            src={product.image}
            alt={product.image}
            width={500}
            height={500}
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
            <li>
              <div className="flex">
                Sizes:{' '}
                {product.size.map((size) => (
                  <div key={size} className="ml-1">
                    <input
                      type="radio"
                      id={size}
                      className="p-2 outline-none focus:ring-0"
                      checked={givenSize === size}
                      onChange={() => setGivenSize(size)}
                    />
                    <label htmlFor={size} className="p-1">
                      {size}
                    </label>
                  </div>
                ))}{' '}
              </div>
            </li>
            <li>
              <div className="flex">
                Color:{' '}
                {product.color.map((color) => (
                  <div key={color} className="ml-1">
                    <input
                      type="radio"
                      id={color}
                      className="p-2 outline-none focus:ring-0"
                      checked={givenColor === color}
                      onChange={() => setGivenColor(color)}
                    />
                    <label htmlFor={color} className="p-1">
                      {color}
                    </label>
                  </div>
                ))}{' '}
              </div>
            </li>
            <li>{product.desription}</li>
          </ul>
        </div>
        {/* price card */}
        <div className="flex justify-center mt-2 sm:justify-center md:mt-0 md:block">
          <div className=" border rounded-md shadow p-4 w-1/2 md:w-auto">
            <div className="mb-2 flex justify-evenly md:justify-between">
              <div>Price</div>
              <div>Rs :{product.price}</div>
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
export async function getServerSideProps(context) {
  const { params } = context;
  const { slug } = params;
  await db.connect();
  const product = await Product.findOne({ slug }).lean();
  await db.disconnect();
  return {
    props: {
      product: product ? db.convertDocToObj(product) : null,
    },
  };
}
