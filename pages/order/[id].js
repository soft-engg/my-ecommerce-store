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
        console.log('the data we are getting is', data);
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
  } = order;

  return (
    <Layout title={`Order ${orderId}`}>
      <h1 className="mb-4 text-xl font-semibold text-blue-500">{`Order ${orderId}`}</h1>
      {loading ? (
        <div className="text-center">loading</div>
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
          <div className="w-full md:w-3/4">
            {/* div for shipping address */}
            <div
              className="overflow-x-auto md:col-span-3 flex flex-col p-4 
         shadow-lg mb-2 rounded-lg"
            >
              <h2 className="mb-2 text-lg text-blue-500 font-bold ">
                Shipping Address
              </h2>
              <div className="mb-1">
                {shippingAddress.fullName},{shippingAddress.address},
                {shippingAddress.city},{shippingAddress.postalCode},
                {shippingAddress.country}
              </div>
            </div>
            {/* div for payment Method */}
            <div
              className="overflow-x-auto md:col-span-3 flex flex-col p-4 
         shadow-lg mb-2 rounded-lg"
            >
              <h2 className="mb-2 text-lg text-blue-500 font-bold ">
                paymentMethod
              </h2>
              <div className="mb-1">{paymentMethod}</div>
              {isPaid ? (
                <div
                  className="my-3 
                rounded-lg bg-green-100 p-3 text-green-700
                "
                >
                  Paid at {paidAt}
                </div>
              ) : (
                <div
                  className="my-3 
                rounded-lg bg-red-100 p-3 text-red-700
                "
                >
                  Not Paid
                </div>
              )}
            </div>
            {/* div for Delivery */}
            <div
              className="overflow-x-auto md:col-span-3 flex flex-col p-4 
         shadow-lg mb-2 rounded-lg"
            >
              <h2 className="mb-2 text-lg text-blue-500 font-bold ">
                Delivery Status
              </h2>
              {isDelivered ? (
                <div
                  className="my-3 
                rounded-lg bg-green-100 p-3 text-green-700
                "
                >
                  Delivered at {deliveredAt}
                </div>
              ) : (
                <div
                  className="my-3 
                rounded-lg bg-red-100 p-3 text-red-700
                "
                >
                  Not Delivered
                </div>
              )}
            </div>
            {/* div for items table */}
            <div
              className="overflow-x-hidden  w-full  flex flex-col p-4 
           shadow-lg  rounded-lg"
            >
              <h2 className="mb-2 text-lg text-blue-500 font-bold">
                Order items
              </h2>
              <div
                className="flex w-full pb-2 mb-1   border-b-2
           border-gray-300 "
              >
                <div className=" px-1  w-5/12 ">
                  <p>Item(s)</p>
                </div>
                <div className=" text-center w-2/12 ">
                  <p>Quantity</p>
                </div>
                <div className="text-center w-3/12">
                  <p>Price</p>
                </div>

                <div className=" text-center w-2/12">Subtotal</div>
              </div>

              {orderItems.map((item) => (
                <div
                  key={item.name + item.size + item.color}
                  className="flex w-full border-b pb-2  "
                >
                  <div className=" flex w-5/12  ">
                    <div className="ml-2 text-center cursor-pointer font-semibold text-blue-600 hover:text-gray-700">
                      {item.name} {item.color} {item.size}
                    </div>
                  </div>

                  <div className=" w-2/12 text-center  ">
                    <p>{item.quantity}</p>
                  </div>
                  <div className=" w-3/12 text-center">
                    <p>{item.price} Rs</p>
                  </div>

                  <div className="text-center w-2/12">
                    <p>{item.quantity * item.price} Rs</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* div for orderSummary */}
          <div className="md:w-1/4   mx-2 px-3 py-2 rounded-lg border-2 h-fit ">
            <h2 className="text-lg font-bold text-blue-500">Order Summary</h2>
            <div className="flex justify-between">
              <p className="">Subtotal :</p>
              <p>{subtotalPrice}</p>
            </div>
            <div className="flex justify-between border-b-2 ">
              <p className="">Shipping :</p>
              <p>{shippingPrice}</p>
            </div>
            <div className="flex justify-between border-b-2 mb-2 ">
              <p className="">Total :</p>
              <p>{totalPrice}</p>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};
OrderScreen.auth = true;
export default OrderScreen;
