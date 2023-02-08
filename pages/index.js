import Layout from '../components/layout';
import ProductItem from '../components/ProductItem';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import db from '../utils/db';
import Product from '../models/prodcut';
import { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function Home({ products }) {
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
      <div>
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
             bg-blue-100 px-1
           outline-none border-b-2 rounded shadow-lg border-gray-300 "
          />
          {/* div for showing search result */}
          {searchFlag ? (
            <div
              className={`absolute m-1 top-8 rounded-lg bg-gray-100 
            w-80 border-1 border-gray-400 max-h-80 overflow-y-scroll  shadow-lg`}
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
                searchData.map((product) => (
                  <div key={product.slug} className="flex mb-2  ">
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
            className="border-2 items-center px-2 h-8 flex mx-1 bg-amber-300
             hover:bg-amber-400 active:bg-amber-500 rounded"
          >
            {/*  eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icons/search.png" alt="" className="h-5 w-5 mr-1 "></img>
            <p>Search</p>
          </button>
        </form>
        {/* this is div for products */}
        <div className="grid grid-cols-2 md:gap-4 md:grid-cols-4 lg:grid-col-4">
          {products.map((product) => (
            <ProductItem
              product={product}
              toast={toast}
              key={product.slug + product.color + product.size}
            ></ProductItem>
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
  return {
    props: {
      products: products.map((product) => db.convertDocToObj(product)),
    },
  };
}
