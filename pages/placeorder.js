import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { CartReset } from '../utils/redux/slices/cartSlice';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CheckoutWizard from '../components/checkoutwizard';
import Layout from '../components/layout';
import { getError } from '../utils/getError';
import Cookies from 'js-cookie';

export default function PlaceOrderScreen() {
  const { cartItems, ShippingAddress } = useSelector((state) => state.cart);
  const newPaymentMethod = useSelector((state) => {
    return state.cart.PaymenMethod;
  });

  const [selectedPaymentMethod] = useState(newPaymentMethod || '');
  const [loading, setLoading] = useState(false);
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const router = useRouter();
  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;

  const subtotalPrice = round2(
    cartItems.reduce((i, c) => (i += c.quantity * c.price), 0)
  );

  const shippingPrice = subtotalPrice > 2000 ? 0 : 300;
  const totalPrice = subtotalPrice + shippingPrice;

  const placeOrderHanldler = async () => {
    try {
      setLoading(true);
      const { data, status } = await axios.put('/api/update/stock', {
        orderItems: cartItems,
        order: true,
      });
      if (status == 200 && data === 'sent') {
        const { data } = await axios.post('/api/order', {
          orderItems: cartItems,
          shippingAddress: ShippingAddress,
          paymentMethod: selectedPaymentMethod,
          subtotalPrice,
          shippingPrice,
          totalPrice,
        });
        setLoading(false);
        dispatch(CartReset());
        Cookies.set(
          'cart',
          JSON.stringify({
            ...cart,
            cartItems: [],
          })
        );
        toast.success('order placed');
        router.push(`order/${data._id}`);
      } else toast.error('error in placing the order..');
    } catch (err) {
      setLoading(false);
      toast.error(getError(err));
    }
  };

  useEffect(() => {
    if (!selectedPaymentMethod) {
      router.push('/payment');
    }
  });

  return (
    <Layout title="Place Order">
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
      <CheckoutWizard activeStep={3} className="mx-2" />
      <h1 className="mx-5  mb-1 text-lg text-amber-400 font-semibold">
        Place Order
      </h1>
      {cartItems.length === 0 ? (
        <div>
          cart is empty <Link href="/">Go shopping</Link>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row mx-1 sm:mx-0.5">
          <div className="w-full md:w-3/4">
            {/* div for shipping address */}
            <div
              className="overflow-x-auto text-white bg-gray-600  mx-2 md:col-span-3 flex flex-col p-4 
           shadow-lg mb-2 rounded-lg"
            >
              <h2 className="mb-2 text-lg text-amber-400 font-semibold ">
                Shipping Address
              </h2>
              <div className="mb-1 text-sm">
                {ShippingAddress.fullName},{ShippingAddress.address},
                {ShippingAddress.city},{ShippingAddress.country}
                <br />
                Phone# {ShippingAddress.phone}
              </div>
              <div className="font-medium">
                <Link href="/shipping">
                  <a className="text-amber-400 hover:text-white/90">Edit</a>
                </Link>
              </div>
            </div>
            {/* div for payment Method */}
            <div
              className="overflow-x-auto  bg-gray-600 mx-2 md:col-span-3 flex flex-col p-4 
           shadow-lg mb-2 rounded-lg"
            >
              <h2 className="mb-2  text-lg text-amber-400 font-semibold ">
                paymentMethod
              </h2>
              <div className="mb-1 text-sm text-white">
                {selectedPaymentMethod}
              </div>
              <div className="font-medium">
                <Link href="/payment">
                  <a className="text-amber-400 hover:text-white/90">Edit</a>
                </Link>
              </div>
            </div>
            {/* div for items table */}
            <div
              className="overflow-x-auto bg-gray-600  mx-2 md:col-span-3 flex flex-col p-4 
               shadow-lg mb-2 rounded-lg"
            >
              <h2 className="mb-2 text-lg text-amber-400 font-semibold">
                Order items
              </h2>
              <div
                className="flex w-full bg-black text-white pb-1 mb-1 
                text-[14] font-semibold  border-b-2
             border-gray-300 "
              >
                <div className=" px-1  w-5/12 ">
                  <p>Item(s)</p>
                </div>
                <div className=" text-center w-2/12 ">
                  <p>Qty.</p>
                </div>
                <div className="text-center w-3/12">
                  <p>Price</p>
                </div>

                <div className=" text-center w-2/12 ">Subtotal</div>
              </div>

              {cartItems.map((item) => (
                <div
                  key={item.name + item.size + item.color}
                  className="flex w-full border-b pb-2 text-[14px] text-white "
                >
                  <div className=" flex w-5/12  flex-wrap">
                    <Link href={`/product/${item.slug}`}>
                      <div
                        className="ml-2 text-center cursor-pointer 
                      font-bold text-amber-400 hover:text-white"
                      >
                        {item.name} {item.color} {item.size}
                      </div>
                    </Link>
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

              <div className="font-medium font-bold mt-2">
                <Link href="/cart">
                  <a className="text-amber-400 hover:text-white/90">Edit</a>
                </Link>
              </div>
            </div>
          </div>
          {/* div for order summary */}
          <div className=" md:w-1/4 bg-white  mx-2 px-3 py-2 rounded-lg border-2 h-fit ">
            <h2 className="text-lg font-bold text-amber-400">Order Summary</h2>
            <div className="flex justify-between">
              <p className="">Subtotal :</p>
              <p>{subtotalPrice}</p>
            </div>
            <div className="flex justify-between border-b-2 ">
              <p className="">Shipping :</p>
              <p>{shippingPrice}</p>
            </div>
            <div className="flex justify-between border-b-2 mb-2 ">
              <p className="">total :</p>
              <p>Rs. {totalPrice}</p>
            </div>
            <div className="flex justify-center">
              <button
                className="primary-button hover:bg-amber-300 transition-all"
                disabled={loading}
                onClick={placeOrderHanldler}
              >
                {loading ? 'loading..' : 'Place Order'}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
PlaceOrderScreen.auth = true;
