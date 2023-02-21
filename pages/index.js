/* eslint-disable @next/next/no-img-element */
import Layout from '../components/layout';
import ProductItem from '../components/ProductItem';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import db from '../utils/db';
import Product from '../models/prodcut';
import { useState, useRef } from 'react';
import axios from 'axios';
import Link from 'next/link';
import HeroSection from '../components/hero';

export default function Home({ products }) {
  const divRefs = useRef([]);
  const [search, setSearch] = useState('');
  const [searchFlag, setSearchFlag] = useState(false);
  const [searchData, setSearchData] = useState([]);
  async function searcHandler(e) {
    e.preventDefault();
    setSearchFlag(true);
    if (search) {
      setSearchData('searching');
      const { data } = await axios.get(`/api/products/search/${search}`);
      setSearchData(data);
    } else {
      toast.error('search box is empty');
    }
  }
  function handleRightScroll(index) {
    divRefs.current[index].scrollBy({
      left: +216,
      behavior: 'smooth',
    });
  }
  function handleLeftScroll(index) {
    divRefs.current[index].scrollBy({
      left: -216,
      behavior: 'smooth',
    });
  }

  // returning data
  return (
    <Layout title={'Home'}>
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
      <HeroSection></HeroSection>
      {/* this is div for data */}
      <div id="main">
        {/* this is div for search*/}
        <form
          onSubmit={(e) => searcHandler(e)}
          className="flex justify-center relative sm:justify-start mb-2"
        >
          {/* button for showing input */}
          <input
            value={search}
            onChange={(e) => {
              if (searchFlag === true) setSearchFlag(false);
              setSearch(e.target.value);
            }}
            placeholder="Search products"
            className="shadow-ld  relative px-1 placeholder:text-sm tex-sm h-8 w-56
              px-1
           outline-none border-b-2 rounded-l shadow-lg border-gray-300 "
          />
          {/* div for showing search result */}
          {searchFlag ? (
            <div
              className={`absolute  top-8 -left-6 bg-gray-100 
            w-80 border-1 border-gray-400 max-h-80 overflow-y-scroll z-10 shadow-lg`}
            >
              {/* div for close button */}
              <div className="flex justify-end">
                <button onClick={() => setSearchFlag(false)}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/icons/cross.png"
                    className="h-6 w-6 m-1 hover:scale-105"
                    alt="close"
                  ></img>
                </button>
              </div>
              {/* div for searched products */}
              {searchData === 'searching' ? (
                <p>searching please wait....</p>
              ) : searchData.length == 0 ? (
                <p className="p-4 font-semibod">No Product is found</p>
              ) : (
                searchData.map((product, index) => (
                  <div key={index} className="flex mb-2  ">
                    <Link
                      href={`product/${product.slug}`}
                      className="cursor-pointer w-2/6"
                    >
                      <a>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={product.image}
                          alt={product.name}
                          className="object-contain ml-2 h-16 w-16"
                        ></img>
                      </a>
                    </Link>
                    <Link
                      href={`product/${product.slug}`}
                      className="cursor-pointer "
                    >
                      <a className="ml-3 w-3/6"> {product.name}</a>
                    </Link>
                    <p
                      className="font-semibold  ml-2 w-2/6 justify-end flex 
                      flex-wrap pr-2"
                    >
                      Rs.{product.price}
                    </p>
                  </div>
                ))
              )}
            </div>
          ) : null}
          {/* button for search */}
          <button
            type="submit"
            className=" items-center  h-8 flex px-2 bg-white border-l-2
             hover:bg-amber-300 active:bg-amber-500 rounded-r"
          >
            {/*  eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icons/search.png" alt="" className="h-5 w-5 mr-1 " />
          </button>
        </form>

        {/* this is div for all products */}
        <div className="">
          {products.map((sortedProducts, index) => (
            <div key={index} className="h-[300px] relative    mt-4  rounded  ">
              {/* category heading */}
              <div
                className="text-lg  relative flex items-center w-fit 
                justify-center mb-2
                font-extrabold   items-center"
              >
                <img
                  src="/icons/white-paint-stroke.png"
                  className="h-10 w-full "
                  alt=""
                ></img>
                <Link href={`/category/${sortedProducts[0].category}`}>
                  <a className="absolute text-amber-400 hover:text-black active:text-amber-500 left-auto">
                    {sortedProducts[0].category.toUpperCase()}
                  </a>
                </Link>
              </div>
              {/* previous button */}
              <button
                onClick={() => handleLeftScroll(index)}
                className={`absolute peer bg-white/60 hidden sm:block 
                hover:scale-110 transition-all ${
                  sortedProducts.length < 5 ? 'md:hidden' : 'block'
                }
                hover:bg-white/80 rounded-full left-0 top-1/2`}
              >
                <img
                  alt="previous"
                  src="/icons/left-arrow.png"
                  className="h-8 w-8 opacity-50 hover:opacity-90"
                />
              </button>
              {/* next button */}
              <button
                onClick={() => handleRightScroll(index)}
                className={`absolute peer bg-white/60 hidden sm:block 
                hover:scale-110 transition-all ${
                  sortedProducts.length < 5 ? 'md:hidden' : 'block'
                }
                hover:bg-white/80 rounded-full right-0 top-1/2`}
              >
                <img
                  alt="previous"
                  src="/icons/right-arrow.png"
                  className="h-8 w-8 opacity-50  hover:opacity-90"
                />
              </button>
              {/* div to show products of same category */}
              <div
                className="flex gap-4 overflow-x-scroll webkit-overflow-scrolling-touch 
                sm:overflow-x-auto 
                sm:overflow-x-hidden"
                ref={(el) => (divRefs.current[index] = el)}
              >
                {sortedProducts.map((product, index) => {
                  return (
                    <ProductItem product={product} toast={toast} key={index} />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  await db.connect();
  const products = await Product.find().lean();
  await db.disconnect();
  // sorting products wrt categories
  const distinctMap = new Map();
  products.forEach((obj) => {
    const fieldValue = obj.category;
    if (distinctMap.has(fieldValue)) {
      if (distinctMap.get(fieldValue).length < 10) {
        // limit to 10 objects
        distinctMap.get(fieldValue).push(obj);
      }
    } else {
      distinctMap.set(fieldValue, [obj]);
    }
  });

  const resultArray = Array.from(distinctMap.values()).map((array) => [
    ...array,
  ]);
  // returning the sorted products
  return {
    props: {
      products: resultArray.map((products) => {
        return products.map((product) => db.convertDocToObj(product));
      }),
    },
  };
}
