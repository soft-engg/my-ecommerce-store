import Link from 'next/link';
import React, { useState } from 'react';
import AdminLayout from '../../components/adminLayout';
import Product from '../../models/prodcut';
import db from '../../utils/db';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Layout from '../../components/layout';
import Pagination from '../../components/productpagination';
export default function AllProducts({ products }) {
  const router = useRouter();
  const session = useSession();
  const [productsToShow, setProductsToShow] = useState(products);
  const { user } = session.data;
  const [search, setSearch] = useState('');

  async function searcHandler(e) {
    e.preventDefault();
    if (search) {
      const { data, status } = await toast.promise(
        axios.get(`/api/products/search/${search}`),
        { pending: 'Searching Product please wait!!!' }
      );
      if (status == 200) setProductsToShow(data);
      if (status == 205) toast.error('Error Occured on Server!!');
      if (status === 204) toast.info('No product found!!');
    } else {
      toast.error('search box is empty');
    }
  }

  // checking if user is admin then do this
  if (user?.isAdmin)
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
        <div className="">
          <div className="flex justify-between flex-wrap">
            {/* this is form for search */}
            <form
              onSubmit={(e) => searcHandler(e)}
              className="flex justify-center relative  sm:justify-start mb-2"
            >
              {/* button for showing input */}
              <input
                value={search}
                onChange={(e) => {
                  if (e.target.value === '') {
                    setProductsToShow(products);
                  }
                  setSearch(e.target.value);
                }}
                placeholder="Search products"
                className="shadow-ld  relative px-1 placeholder:text-sm tex-sm h-8 w-56
             bg-gray-200 black/bg-black/80    
               outline-none border-b-2 rounded-l border-gray-300 "
              />
              {/* button for search */}
              <button
                type="submit"
                className=" items-center px-2 h-8 flex  bg-amber-300
             hover:bg-amber-400 transition-all active:bg-amber-500 rounded-r"
              >
                {/*  eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/icons/search.png"
                  alt=""
                  className="h-5 w-5 mr-1 "
                ></img>
              </button>
            </form>
            {/* add new product button */}
            <Link href="/admin/addproducts">
              <a
                className=" mb-2 text-sm bg-amber-300 my-auto px-2 py-1 rounded font-semibold
             hover:bg-amber-400 transition-all active:bg-amber-500 text-black 
              hover:text-black"
              >
                Add New Product
              </a>
            </Link>
          </div>
          {/* div to show items */}
          <div className="  ">
            <Pagination
              toast={toast}
              router={router}
              items={productsToShow}
            ></Pagination>
          </div>
        </div>
      </AdminLayout>
    );
  return (
    <Layout title="only Admin Page">
      <div className="flex flex-col items-center mt-5">
        <h1>Only Admin of Website is allowed in this Secion</h1>
        <Link href="/">
          <a>Go to Home Page</a>
        </Link>
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
      products: products
        .map((product) => db.convertDocToObj(product))
        .reverse(),
    },
  };
}
AllProducts.auth = true;
