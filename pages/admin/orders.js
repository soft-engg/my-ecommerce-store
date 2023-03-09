import axios from 'axios';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminLayout from '../../components/adminLayout';
import Layout from '../../components/layout';
import Pagination from '../../components/orderPagination';
import Order from '../../models/Order';
import db from '../../utils/db';

export default function AllOrders({ orders }) {
  const router = useRouter();
  const session = useSession();
  const [search, setSearch] = useState('');
  const [ordersToShow, setOrdersToShow] = useState(orders);
  const { user } = session.data;
  async function searcHandler(e) {
    e.preventDefault();
    if (search) {
      const { status, data } = await toast.promise(
        axios.get(`/api/admin/searchorder/${search}`),
        { pending: 'searching please wait' }
      );
      if (status == 200) {
        setOrdersToShow([data]);
      }
      if (status == 204) toast.error('No Record Found');
      if (status == 205) toast.error('Invalid Id');
    } else {
      toast.error('search box is empty');
    }
  }

  if (user?.isAdmin)
    return (
      <AdminLayout title="All Orders">
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
        {ordersToShow.length == 0 ? (
          <div className="text-Center flex justify-center text-amber-400 w-full font-semibold  text-xl">
            <h1>No Orders to show!!</h1>
          </div>
        ) : (
          <div>
            {/* div to show search and headings */}
            <div className="flex gap-2 items-center md:gap-5">
              <h1 className="text-amber-400 font-semibold text-xl pb-2">
                All Orders
              </h1>

              {/* this is form for search */}
              <form
                onSubmit={(e) => searcHandler(e)}
                className="flex justify-center relative sm:justify-start mb-2"
              >
                {/* button for showing input */}
                <input
                  value={search}
                  onChange={(e) => {
                    if (e.target.value === '') setOrdersToShow(orders);
                    setSearch(e.target.value);
                  }}
                  placeholder="Search order Id"
                  className="shadow-ld  relative px-1 placeholder:text-sm 
                  tex-sm h-8 w-56
             bg-gray-200 black/bg-black/80 mb-1   
               outline-none border-b-2 rounded-l shadow-lg border-gray-300 "
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
            </div>
            <Pagination
              items={ordersToShow}
              toast={toast}
              router={router}
            ></Pagination>
          </div>
        )}
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
// getting server side props
export async function getServerSideProps() {
  await db.connect();
  const orders = await Order.find().lean();
  await db.disconnect();
  return {
    props: {
      orders: orders.map((order) => db.convertOrderToObj(order)).reverse(),
    },
  };
}
AllOrders.auth = true;
