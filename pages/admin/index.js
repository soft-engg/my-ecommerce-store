import { useSession } from 'next-auth/react';
import Link from 'next/link';
import React from 'react';
import { ToastContainer } from 'react-toastify';
import AdminLayout from '../../components/adminLayout';
import Layout from '../../components/layout';
import Order from '../../models/Order';
import User from '../../models/users';
import db from '../../utils/db';

export default function AdminScreen({
  totalOrders,
  OrdersToConfirm,
  OrdersToDeliver,
  OrdersNotPaid,
  adminUsers,
  TotalUsers,
  NonAdminUsers,
}) {
  const session = useSession();
  const { user } = session.data;
  // checking if user is admin then do this
  if (user?.isAdmin)
    return (
      <AdminLayout title="Admin Panel">
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
        <div className="text-white">
          <h1 className="text-amber-400 font-bold text-xl">Admin Panel</h1>
          {/* div for Orders */}
          <div className="mt-4">
            <h2 className="text-amber-400 font-semibold text-lg">ORDERS</h2>
            <div className="grid grid-cols-4 text-center gap-2 grid-flow-row">
              <div>
                <h2 className="text-lg  bg-gray-800 rounded text-amber-400 font-semibold">
                  Total Orders
                </h2>
                <p className="mt-1  bg-gray-600 rounded text-lg font-sans font-bold">
                  {totalOrders}
                </p>
              </div>
              <div>
                <h2 className="text-lg bg-gray-800 rounded  text-amber-400 font-semibold">
                  To confirm
                </h2>
                <p className="mt-1 bg-gray-600 rounded text-lg font-sans font-bold">
                  {OrdersToConfirm}
                </p>
              </div>
              <div>
                <h2 className="text-lg bg-gray-800  rounded text-amber-400 font-semibold">
                  To Deliver
                </h2>
                <p className="mt-1 bg-gray-600  rounded text-lg font-sans font-bold">
                  {OrdersToDeliver}
                </p>
              </div>
              <div>
                <h2 className="text-lg bg-gray-800 rounded text-amber-400 font-semibold">
                  To Be Paid
                </h2>
                <p className="mt-1 bg-gray-600 rounded text-lg font-sans font-bold">
                  {OrdersNotPaid}
                </p>
              </div>
            </div>
          </div>

          {/* div for Users */}
          <div className="mt-4">
            <h2 className="text-amber-400 font-semibold text-lg">USERS</h2>
            <div className="grid grid-cols-3 text-center gap-2 grid-flow-row">
              <div>
                <h2 className="text-lg  bg-gray-800 rounded text-amber-400 font-semibold">
                  Total Users
                </h2>
                <p className="mt-1  bg-gray-600 rounded text-lg font-sans font-bold">
                  {TotalUsers}
                </p>
              </div>
              <div>
                <h2 className="text-lg bg-gray-800 rounded  text-amber-400 font-semibold">
                  Admin users
                </h2>
                <p className="mt-1 bg-gray-600 rounded text-lg font-sans font-bold">
                  {adminUsers}
                </p>
              </div>
              <div>
                <h2 className="text-lg bg-gray-800  rounded text-amber-400 font-semibold">
                  Customers
                </h2>
                <p className="mt-1 bg-gray-600  rounded text-lg font-sans font-bold">
                  {NonAdminUsers}
                </p>
              </div>
            </div>
          </div>

          {/* div for Links */}
          <div className="mt-4">
            <h2 className="text-amber-400 font-semiq  bold text-lg">MENU</h2>
            <div className="grid grid-cols-3 text-center gap-2 grid-flow-row">
              <Link href="/admin/orders">
                <a
                  className="text-lg 
                 bg-gray-800 rounded my-auto ring-2 ring-amber-500  hover:text-white active:text-white text-amber-400 font-semibold"
                >
                  View Orders
                </a>
              </Link>
              <Link href="/admin/users">
                <a
                  className="text-lg 
                 bg-gray-800 rounded my-auto ring-2 ring-amber-500 hover:text-white active:text-white text-amber-400 font-semibold"
                >
                  View Users
                </a>
              </Link>
              <Link href="/admin/products">
                <a
                  className="text-lg 
                 bg-gray-800 rounded my-auto ring-2 ring-amber-500 hover:text-white active:text-white text-amber-400 font-semibold"
                >
                  View Products
                </a>
              </Link>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  return (
    <Layout title="only Admin Page">
      <div className="flex flex-col items-center mt-5">
        <h1 className="text-white">
          Only Admin of Website is allowed in this Secion
        </h1>
        <Link href="/">
          <a>Go to Home Page</a>
        </Link>
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  await db.connect();
  const totalOrders = await Order.find().lean().count();
  const OrdersToConfirm = await Order.find({ isConfirmed: false })
    .lean()
    .count();
  const OrdersToDeliver = await Order.find({ isDelivered: false })
    .lean()
    .count();
  const OrdersNotPaid = await Order.find({ isPaid: false }).lean().count();
  const adminUsers = await User.find({ isAdmin: true }).lean().count();
  const TotalUsers = await User.find().lean().count();
  const NonAdminUsers = TotalUsers - adminUsers;
  await db.disconnect();
  return {
    props: {
      totalOrders,
      OrdersToConfirm,
      OrdersToDeliver,
      OrdersNotPaid,
      adminUsers,
      TotalUsers,
      NonAdminUsers,
    },
  };
}
AdminScreen.auth = true;
