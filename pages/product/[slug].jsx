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
import axios from 'axios';

export default function ProductScreen(props) {
  const { product } = props;
  console.log(product);
  const [givenSize, setGivenSize] = useState();
  const [givenColor, setGivenColor] = useState();
  const itemsInCart = useSelector((state) => state.cart.cartItems);
  const [givenQuantity, setQuantity] = useState(1);
  const [imageToShow, setImageToShow] = useState(product.image[0]);
  const dispatch = useDispatch();
  // handle the onclick function of add to cart
  const addToCartHandler = async () => {
    if (!givenSize && !givenColor) {
      toast.error('please select both size & color');
    } else {
      // dispatching the add to cart action
      const existItem = itemsInCart.find(
        (item) =>
          item.slug === product.slug &&
          item.color === givenColor &&
          item.size === givenSize
      );

      let quantity = 0;
      existItem
        ? (quantity = existItem.quantity + givenQuantity)
        : (quantity = givenQuantity);

      const { data } = await toast.promise(
        () => axios.get(`/api/products/${product._id}`),
        {
          pending: 'checking for product availablity',
          error: 'Some error occured',
        }
      );
      let qInCart = 0;
      itemsInCart.forEach((item) => {
        if (item.slug === product.slug) qInCart += item.quantity;
      });
      qInCart += givenQuantity;
      if (data.countInStock < qInCart) {
        toast.error('Sorry given number of item is not available..');
      } else {
        dispatch(
          AddToCart({
            ...product,
            quantity: quantity,
            size: givenSize,
            color: givenColor,
          })
        );
        toast.success('Product added to the cart!!');
      }
    }
  };

  // if the product not exist then return this
  if (!product)
    return (
      <Layout title="product not found">
        <h1 className="text-xl text-amber-400 mt-4 ">product not found</h1>
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
        theme="dark"
      />

      <Link href="/">
        <a
          className="text-amber-400 
          font-semibold hover:text-white mb-1 transition-all"
        >
          Back to Products
        </a>
      </Link>

      <div className="grid md:grid-cols-4 md:gap-3">
        <div className="md:col-span-2 ">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageToShow}
            alt={product.name}
            className="object-contain h-[340px]  w-full rounded bg-white/50"
          ></img>
          {product.image.length > 1 ? (
            <div className="flex h-24 w-52  mt-2">
              {product.image.map((givenImage, index) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  alt=""
                  key={index}
                  src={givenImage}
                  className={`h-24 w-24 mx-1 ${
                    imageToShow == givenImage ? 'ring-amber-400 ring-2' : ''
                  } hover:scale-105 transition-all`}
                  onClick={() => {
                    if (imageToShow !== givenImage) setImageToShow(givenImage);
                  }}
                ></img>
              ))}
            </div>
          ) : null}
        </div>
        {/* discription section */}
        <div className="flex  md:block">
          <ul>
            <li>
              <h1 className="text-2xl mt-2 mb-1 text-amber-400 font-bold">
                {product.name}
              </h1>
            </li>
            <li className="flex">
              {' '}
              <span className="font-semibold text-amber-400">Category :</span>
              <p className="text-white mx-2"> {product.category}</p>
            </li>
            <li className="flex">
              {' '}
              <span className="font-semibold text-amber-400">Brand :</span>
              <p className="text-white mx-2"> {product.brand}</p>
            </li>
            <li>
              <p className="font-semibold text-amber-400">Size(s)</p>
              <div className="flex">
                {product.size.map((size) => (
                  <div key={size} className="ml-1 text-white">
                    <input
                      type="radio"
                      id={size}
                      className="p-2 accent-amber-400 outline-none focus:ring-0 cursor-pointer"
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
              <p className="font-semibold text-amber-400">Colors(s)</p>
              <div className="flex">
                {product.color.map((color) => (
                  <div key={color} className="ml-1 text-white">
                    <input
                      type="radio"
                      id={color}
                      className="p-2 accent-amber-400 outline-none focus:ring-0 cursor-pointer"
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
            {/* start */}
            <span className="font-semibold text-amber-400">Quantity :</span>
            <div className=" text-amber-400 p-1 flex justify-between items-start w-2/5 ">
              <button
                onClick={() => {
                  setQuantity((quantity) => {
                    if (quantity >= 2) return quantity - 1;
                    return (quantity = 1);
                  });
                }}
                className="bg-transparent text-amber-400 flex justify-center items-center font-bold text-center border-2
           md:text-2xl border-amber-400 rounded-lg leading-none 
           border w-6 h-6  shadow  hover:scale-110 active:scale-125"
              >
                <p className="text-amber-400">-</p>
              </button>
              <div className="mx-2 p-0 flex items-center  text-xl">
                {givenQuantity}
              </div>
              <button
                onClick={() => {
                  setQuantity((quantity) => quantity + 1);
                }}
                className="bg-transparent flex justify-center items-center font-bold text-center border-2
          md:text-2xl border-amber-400 rounded-lg leading-none 
          border w-6 h-6  shadow text-amber-400 hover:scale-110 active:scale-125"
              >
                +
              </button>
            </div>
            {/* END */}
            <li className="flex">
              <h2 className="text-white"> {product.description}</h2>
            </li>
          </ul>
        </div>
        {/* price card */}
        <div
          className="flex justify-center mt-2 sm:justify-center
         md:mt-0 md:block"
        >
          <div className=" border bg-white rounded-md shadow p-4 w-1/2 md:w-auto">
            <div className="mb-2 flex justify-evenly md:justify-between">
              <p className="font-bold">Price :</p>
              <p className="font-bold">Rs. {product.price}</p>
            </div>

            <div className="mb-2 flex justify-evenly md:justify-between">
              <h2 className="font-bold">Status :</h2>
              <div>{product.countInStock > 0 ? 'In Stock' : 'Unavailable'}</div>
            </div>
            <div className="flex  justify-center">
              <button
                className="primary-button hover:bg-amber-300 transition-all  md:w-full "
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
