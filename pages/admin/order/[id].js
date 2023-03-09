import axios from 'axios';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import AdminLayout from '../../../components/adminLayout';
import Layout from '../../../components/layout';
// import { getError } from '../../../utils/getError';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import db from '../../../utils/db';
import Order from '../../../models/Order';

// this is reducer function for the usereducer
// function reducer(state, action) {
//   switch (action.type) {
//     case 'FETCH_REQUEST':
//       return { ...state, loading: true, error: '' };
//     case 'FETCH_SUCCESS':
//       return { ...state, loading: false, order: action.payload, error: '' };
//     case 'FETCH_FAIL':
//       return { ...state, loading: false, error: action.payload };
//   }
// }

const OrderScreen = ({ order }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const router = useRouter();
  const session = useSession();
  const { user } = session.data;
  const { query } = useRouter();
  const orderId = query.id;
  //   here are getting state data and dispatch to mutate the state
  //   while giving useReducer the reducer function and initial state
  // const [{ loading, error, order }, dispatch] = useReducer(reducer, {
  //   loading: true,
  //   order: {},
  //   error: '',
  // });

  // here we are fetching data in useEffect
  useEffect(() => {
    const fetchUser = async () => {
      try {
        // dispatch({ type: 'FETCH_REQUEST' });
        // const { data } = await axios.get(`/api/order/${orderId.toString()}`);
        const { user: id } = order;
        const { status, data: user } = await axios.get(
          `/api/admin/getuser/${id}`
        );
        if (status == 200) {
          setName(user.name);
          setEmail(user.email);
        } else {
          setName('Not Found');
          setEmail('Not Found');
        }
        // dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (error) {
        toast.error('error getting user data');
      }
    };
    fetchUser();
    // if (!order._id || (order._id && order._id !== orderId)) fetchOrder();
  }, [order]);

  // destructuring all values from order
  const {
    shippingAddress,
    paymentMethod,
    subtotalPrice,
    shippingPrice,
    totalPrice,
    isPaid,
    orderItems,
    isDelivered,
    isConfirmed,
  } = order;
  // rerunning the getserversideprops
  const refreshData = () => {
    router.replace(router.asPath);
  };
  // change confirm status
  async function changeConfirmStatus(state, id) {
    const { status, data } = await toast.promise(
      axios.put('/api/admin/updateconfirm', { state: state, id }),
      { pending: 'changing confirm status of order...' }
    );
    if (status == 200) {
      toast.success(data);
      refreshData();
    }
    if (status === 400) toast.error(data);
  }
  // change delivered status
  async function changeDeliveredStatus(state, id) {
    const { status, data } = await toast.promise(
      axios.put('/api/admin/updatedeliver', { state: state, id }),
      { pending: 'changing Delivered status of order...' }
    );
    if (status == 200) {
      toast.success(data);
      refreshData();
    }
    if (status === 400) toast.error(data);
  }
  // function to change paid status
  async function changePaidStatus(state, id) {
    const { status, data } = await toast.promise(
      axios.put('/api/admin/updatepaid', { state: state, id }),
      { pending: 'changing Paid status of order...' }
    );
    if (status == 200) {
      toast.success(data);
      refreshData();
    }
    if (status === 400) toast.error(data);
  }

  // returing this is user is admin
  if (user?.isAdmin)
    return (
      <AdminLayout title={`Order ${orderId}`}>
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
        {/* div to show top headings */}
        <div className="">
          <h1
            className="mb-1 text-lg font-semibold ml-2
         text-amber-400"
          >
            Order : <span className="text-white"> {` ${orderId}`}</span>
          </h1>
          <h2
            className="mb-1 text-lg font-semibold ml-2
         text-amber-400"
          >
            Customer: <span className="text-white"> {` ${name}`}</span>
          </h2>
          <h2
            className="mb-1 text-lg font-semibold ml-2
         text-amber-400"
          >
            Email : <span className="text-white"> {` ${email}`}</span>
          </h2>
        </div>
        (
        <div className="flex flex-col md:flex-row mx-1 sm:mx-0.5">
          {/* div for all data */}
          <div className="w-full md:w-3/4">
            {/* div for items table */}
            <div
              className="overflow-x-auto bg-gray-500 md:col-span-3 flex flex-col p-4 
             shadow-lg mb-2 rounded-lg"
            >
              <h2 className="mb-2 text-lg text-amber-400 font-semibold">
                Order items
              </h2>
              <div
                className="flex w-full bg-black text-white pb-1 mb-1 
                text-[14]   border-b-2
             border-gray-300 "
              >
                <div className=" px-1  w-5/12 ">
                  <p>Item(s)</p>
                </div>
                <div className=" text-center w-3/12 ">
                  <p>Qty.</p>
                </div>
                <div className="text-center w-4/12">
                  <p>Price/p</p>
                </div>
              </div>

              {orderItems.map((item) => (
                <div
                  key={item.name + item.size + item.color}
                  className="flex w-full border-b pb-2 text-[14px] sm:text-base text-white "
                >
                  <div className=" flex w-5/12  flex-wrap">
                    <div
                      className=" text-center cursor-pointer 
                      font-bold text-amber-400 hover:text-white"
                    >
                      {item.name} {item.color} {item.size}
                    </div>
                  </div>

                  <div className=" w-3/12 text-center  ">
                    <p className="font-mono">{item.quantity}</p>
                  </div>
                  <div className=" w-4/12 flex justify-center text-center">
                    Rs. <p className="font-mono"> {item.price}</p>
                  </div>
                </div>
              ))}
            </div>
            {/* div for shipping address */}
            <div
              className="overflow-x-auto bg-gray-500 md:col-span-3 flex flex-col p-4 
         shadow-lg mb-2 rounded-lg"
            >
              <h2 className="mb-2 text-lg text-amber-400 font-semibold ">
                Shipping Address
              </h2>
              <div className="mb-1 tex-sm text-white">
                {shippingAddress.fullName},{shippingAddress.address},
                {shippingAddress.city},{shippingAddress.country}
                <p>Phone# {shippingAddress.phone}</p>
              </div>
            </div>
            {/* div for Confirmation */}
            <div
              className="overflow-x-auto bg-gray-500 md:col-span-3 flex flex-col p-4 
         shadow-lg mb-2 rounded-lg"
            >
              <h2 className=" text-lg text-amber-400 font-semibold ">
                Order Confirmation
              </h2>
              {isConfirmed ? (
                <div
                  className="my-3 flex items-center gap-3
                rounded-lg text-sm bg-white p-3 font-bold text-green-700
                "
                >
                  Confirmed To Ship
                  <button
                    className="bg-amber-400 px-1 py-1 rounded hover:bg-amber-300
                       transition-all
                       active:bg-amber-500 text-black"
                    onClick={async () => {
                      await changeConfirmStatus(false, orderId);
                    }}
                  >
                    Change
                  </button>
                </div>
              ) : (
                <div
                  className="my-3 flex items-center gap-3
                rounded-lg text-sm bg-white p-3 font-bold text-red-600
                "
                >
                  Not Confirmed
                  <button
                    className="bg-amber-400 px-1 py-1 rounded hover:bg-amber-300
                       transition-all
                       active:bg-amber-500 text-black"
                    onClick={async () => {
                      await changeConfirmStatus(true, orderId);
                    }}
                  >
                    Change
                  </button>
                </div>
              )}
            </div>
            {/* div for payment Method */}
            <div
              className="overflow-x-auto bg-gray-500 md:col-span-3 flex flex-col p-4 
         shadow-lg mb-2 rounded-lg"
            >
              <h2 className="mb-2 text-lg text-amber-400 font-semibold ">
                paymentMethod
              </h2>
              {/* div to show status of payment */}
              <div className="mb-1  text-white">{paymentMethod}</div>
              {isPaid ? (
                <div
                  className="my-3 flex items-center gap-3
                rounded-lg text-sm bg-white p-3 font-bold text-green-700
                "
                >
                  Paid
                  <button
                    className="bg-amber-400 px-1 py-1 rounded hover:bg-amber-300
                       transition-all
                       active:bg-amber-500 text-black"
                    onClick={async () => {
                      await changePaidStatus(false, orderId);
                    }}
                  >
                    Change
                  </button>
                </div>
              ) : (
                <div
                  className="my-3 flex items-center gap-3
                rounded-lg text-sm bg-white p-3 font-bold text-red-600
                "
                >
                  Not Paid
                  <button
                    className="bg-amber-400 px-1 py-1 rounded hover:bg-amber-300
                       transition-all
                       active:bg-amber-500 text-black"
                    onClick={async () => {
                      await changePaidStatus(true, orderId);
                    }}
                  >
                    Change
                  </button>
                </div>
              )}
            </div>
            {/* div for Delivery */}
            <div
              className="overflow-x-auto bg-gray-500 md:col-span-3 flex flex-col p-4 
         shadow-lg  rounded-lg"
            >
              <h2 className=" text-lg text-amber-400 font-semibold ">
                Delivery Status
              </h2>
              {isDelivered ? (
                <div
                  className="my-3 flex items-center gap-3
                rounded-lg text-sm bg-white p-3 font-bold text-green-700
                "
                >
                  Delivered
                  <button
                    className="bg-amber-400 px-1 py-1 rounded hover:bg-amber-300
                       transition-all
                       active:bg-amber-500 text-black"
                    onClick={async () => {
                      await changeDeliveredStatus(false, orderId);
                    }}
                  >
                    Change
                  </button>
                </div>
              ) : (
                <div
                  className="my-3 flex items-center gap-3
                rounded-lg text-sm bg-white p-3 font-bold text-red-600
                "
                >
                  Not Delivered
                  <button
                    className="bg-amber-400 px-1 py-1 rounded hover:bg-amber-300
                       transition-all
                       active:bg-amber-500 text-black"
                    onClick={async () => {
                      await changeDeliveredStatus(true, orderId);
                    }}
                  >
                    Change
                  </button>
                </div>
              )}
            </div>
          </div>
          {/* div for orderSummary */}
          <div
            className="md:w-1/4 mt-2 sm:mt-0 bg-white  mx-2 px-3 py-2
           rounded-lg border-2 h-fit "
          >
            <h2 className="text-lg font-bold text-amber-400">Order Summary</h2>
            <div className="flex justify-between">
              <p className=" font-bold">Subtotal :</p>
              <p>{subtotalPrice}</p>
            </div>
            <div className="flex justify-between border-b-2 ">
              <p className=" font-bold">Delivery Charges:</p>
              <p>{shippingPrice}</p>
            </div>
            <div className="flex justify-between border-b-2 mb-2 ">
              <p className=" font-bold">Total :</p>
              <p>Rs. {totalPrice}</p>
            </div>
          </div>
        </div>
        )
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
};

export async function getServerSideProps(context) {
  const { id } = context.params;
  await db.connect();
  const order = await Order.findById({ _id: id }).lean();
  await db.disconnect();
  return {
    props: {
      order: db.convertOrderToObj(order),
    },
  };
}
OrderScreen.auth = true;
export default OrderScreen;
