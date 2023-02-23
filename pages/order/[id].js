import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useEffect, useReducer } from 'react';
import Layout from '../../components/layout';
import { getError } from '../../utils/getError';

// this is reducer function for the usereducer
function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, order: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
  }
}

const OrderScreen = () => {
  const { query } = useRouter();
  const orderId = query.id;
  //   here are getting state data and dispatch to mutate the state
  //   while giving useReducer the reducer function and initial state
  const [{ loading, error, order }, dispatch] = useReducer(reducer, {
    loading: true,
    order: {},
    error: '',
  });

  // here we are fetching data in useEffect
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/order/${orderId}`);
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (error) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(error) });
      }
    };
    if (!order._id || (order._id && order._id !== orderId)) fetchOrder();
  }, [order, orderId]);
  const {
    shippingAddress,
    paymentMethod,
    subtotalPrice,
    shippingPrice,
    totalPrice,
    isPaid,
    paidAt,
    orderItems,
    isDelivered,
    deliveredAt,
    isConfirmed,
  } = order;

  return (
    <Layout title={`Order ${orderId}`}>
      <h1 className="mb-4 text-lg font-semibold ml-2  text-amber-400">{`Order : ${orderId}`}</h1>
      {loading ? (
        <div className="text-center text-lg text-amber-400">loading...</div>
      ) : error ? (
        <div
          className="my-3 
    rounded-lg bg-red-100 p-3 text-red-700
    "
        >
          {error}
        </div>
      ) : (
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
                <p>
                  phone#{' '}
                  <span className="text-amber-400 font-semibold">
                    {shippingAddress.phone}
                  </span>
                </p>
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
                  className="my-3 
                rounded-lg bg-whitetext-sm p-3 font-bold text-green-700
                "
                >
                  Confirmed To Ship
                </div>
              ) : (
                <div
                  className="my-3 
                rounded-lg bg-white text-sm p-3 font-bold text-red-600
                "
                >
                  Not Confirmed
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
              <div className="mb-1  text-white">{paymentMethod}</div>
              {isPaid ? (
                <div
                  className="my-3 
                rounded-lg bg-white p-3 text-sm text-green-700
                "
                >
                  Paid at {paidAt}
                </div>
              ) : (
                <div
                  className="my-3 
                rounded-lg bg-white p-3 font-bold text-sm text-red-600
                "
                >
                  Not Paid
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
                  className="my-2 
                rounded-lg bg-whitetext-sm p-2 font-bold text-green-700
                "
                >
                  Delivered at {deliveredAt}
                </div>
              ) : (
                <div
                  className="my-3 
                rounded-lg bg-white text-sm p-3 font-bold text-red-600
                "
                >
                  Not Delivered
                </div>
              )}
            </div>
          </div>
          {/* div for orderSummary */}
          <div className="md:w-1/4 mt-2 sm:mt-0 bg-white  mx-2 px-3 py-2 rounded-lg border-2 h-fit ">
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
      )}
    </Layout>
  );
};
OrderScreen.auth = true;
export default OrderScreen;
