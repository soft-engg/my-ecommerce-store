import Link from 'next/link';
import React, { useState } from 'react';
import AdminLayout from '../../components/adminLayout';
import Product from '../../models/prodcut';
import db from '../../utils/db';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import storage from '../../utils/firebase';
import { deleteObject, ref } from 'firebase/storage';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useRouter } from 'next/router';
export default function AllProducts({ products }) {
  const [search, setSearch] = useState('');
  const [searchFlag, setSearchFlag] = useState(false);
  const [searchData, setSearchData] = useState([]);
  const router = useRouter();
  let imageDeleteError = false;
  // function to delete one image
  async function deleteImage(slug, i) {
    const storageRef = ref(storage, `/products/${slug + i}`);
    await deleteObject(storageRef).catch((error) => {
      toast.error('error Deleting Image', error);
      imageDeleteError = true;
    });
  }
  // confirmed the image delete now deleting data here
  const deleteConfirmed = async (product) => {
    for (let i = 0; i < product.image.length; i++) {
      await deleteImage(product.slug, i);
    }
    if (!imageDeleteError) {
      const { status, data } = await axios.delete(
        `/api/products/delete/${product._id}`
      );
      if (status == 204) {
        toast.success('record deleted successfuly!!');
        router.replace('/admin/products');
      }
      if (status == 300) {
        toast.error(data);
      }
    }
  };
  // function to confirm delete in advance
  const deleteHandler = async (product) => {
    confirmAlert({
      title: 'Confirm to Delete',
      message: `Are you sure you want to delete ${product.name} ?`,
      buttons: [
        {
          label: 'confirm delete',
          onClick: async () => {
            await toast.promise(deleteConfirmed(product), {
              pending: 'Deleting product Information',
              error: 'unable to delete the record',
            });
          },
        },
        {
          label: 'No',
          onClick: () => {},
        },
      ],
    });
  };

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
    <AdminLayout title="AllProducts">
      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <div className="mx-4 sm:mx-0 ">
        <div className="flex justify-between flex-wrap">
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
             bg-gray-200 black/bg-black/80 mb-1     outline-none border-b-2 rounded shadow-lg border-gray-300 "
            />
            {/* div for showing search result */}
            {searchFlag ? (
              <div
                className={`absolute m-2 top-8 pl-2 rounded-lg bg-gray-100 
            w-96 border-1 border-gray-300 max-h-80 overflow-y-scroll  shadow-lg `}
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
                  <p className="p-4 font-semibold">No Product is found</p>
                ) : (
                  searchData.map((product) => (
                    <div key={product.slug} className="flex  mb-2    ">
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
                      {/* div to show data*/}
                      <div className=" ml-2  p-2 grid grid-flow-row grid-cols-3 gap-3">
                        <Link
                          href={`/product/${product.slug}`}
                          className="cursor-pointer col-span-2 "
                        >
                          <a className="text-black font-semibold col-span-2 font-serif">
                            {product.name}
                          </a>
                        </Link>
                        <p>Rs.{product.price}</p>
                        <p>stock {product.countInStock}</p>

                        {/* div for button */}
                        <div className="flex col-span-2">
                          <button
                            onClick={() => deleteHandler(product)}
                            className="border-gray-300 
                            flex items-center  rounded hover:bg-gray-200"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              alt=""
                              src="/icons/delete.png"
                              className="h-5 mr-1"
                            ></img>{' '}
                            Delete
                          </button>
                          <Link href={`/admin/updateproduct/${product.slug}`}>
                            <button
                              className="border-gray-300 
                  flex items-center ml-2 rounded hover:bg-gray-200"
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                alt=""
                                src="/icons/update.png"
                                className="h-5 mr-1"
                              ></img>
                              update
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : null}
            {/* button for search */}
            <button
              type="submit"
              className=" items-center px-2 h-8 flex mx-1 bg-amber-300
             hover:bg-amber-400 transition-all active:bg-amber-500 rounded"
            >
              {/*  eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/icons/search.png"
                alt=""
                className="h-5 w-5 mr-1 "
              ></img>
              <p className="font-bold">Search</p>
            </button>
          </form>
          <Link href="/admin/addproducts">
            <a
              className=" mb-2 bg-amber-300 my-auto px-2 py-1 rounded font-bold
             hover:bg-amber-400 transition-all active:bg-amber-500 text-black  hover:text-black"
            >
              Add New Product
            </a>
          </Link>
        </div>
        {/* div to show items */}
        <div className="  ">
          {products.map((product) => (
            <div
              key={product.slug}
              className="shadow-lg  font-bold
               bg-gray-400 rounded-lg  py-3 mb-2 text-sm"
            >
              <div className="grid mt-4 grid-cols-4 grid-flow-row">
                <div className="text-center">
                  <p className="text-amber-300 bg-black/80 mb-1 font-semibold ">
                    Name
                  </p>
                  <p> {product.name}</p>
                </div>
                <div className="text-center">
                  <p className="text-amber-300 bg-black/80 mb-1 font-semibold ">
                    Slug
                  </p>
                  {product.slug}
                </div>
                <div className="text-center">
                  <p className="text-amber-300 bg-black/80 mb-1 font-semibold ">
                    Price
                  </p>
                  {product.price}
                </div>
                <div className="text-center">
                  <p className="text-amber-300 bg-black/80 mb-1 font-semibold text-center ">
                    Stock
                  </p>
                  {product.countInStock}
                </div>
                {/* div for colors */}
                <div>
                  <p className="text-amber-300 bg-black/80 mb-1 font-semibold text-center ">
                    Color
                  </p>
                  <div className="flex text-center justify-center flex-wrap">
                    {product.color.map((color, index) => (
                      <p key={color}>
                        {color} {index < product.color.length - 1 ? ' ,' : null}
                      </p>
                    ))}
                  </div>
                </div>
                {/* div for sizes */}
                <div>
                  <p className="text-amber-300 bg-black/80 mb-1 font-semibold text-center ">
                    Size
                  </p>
                  <div className="flex text-center justify-center flex-wrap">
                    {product.size.map((size, index) => (
                      <div key={size} className="flex flex-wrap">
                        {size} {index < product.size.length - 1 ? ' ,' : null}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="text-center col-span-2">
                  <p className="text-amber-300 bg-black/80 mb-1 font-semibold ">
                    Created At
                  </p>
                  <p> {product.createdAt.slice(0, 16)}</p>
                </div>
              </div>
              {/* div for buttons */}
              <div className="flex mt-1 mx-2">
                <button
                  onClick={() => deleteHandler(product)}
                  className="border-gray-300 border-2 bg-black text-white rounded-lg
                  flex items-center px-3 py-2 hover:bg-gray-700 transition-all"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt=""
                    src="/icons/bin.png"
                    className="h-5 mr-1"
                  ></img>{' '}
                  Delete
                </button>
                <Link href={`/admin/updateproduct/${product.slug}`}>
                  <button
                    className="border-gray-300 border-2 bg-black text-white rounded-lg
                    flex items-center px-3 py-2 hover:bg-gray-700 transition-all"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      alt=""
                      src="/icons/update.png"
                      className="h-5 mr-1"
                    ></img>{' '}
                    update
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}

export async function getServerSideProps() {
  await db.connect();
  const products = await Product.find().lean();
  await db.disconnect();
  return {
    props: {
      products: products
        .map((product) => db.convertDocToObj(product))
        .reverse(),
    },
  };
}
AllProducts.auth = true;
