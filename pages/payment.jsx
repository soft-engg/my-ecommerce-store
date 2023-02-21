import React from 'react';
import { useState } from 'react';
import CheckoutWizard from '../components/checkoutwizard';
import Layout from '../components/layout';
import { useDispatch, useSelector } from 'react-redux';
import { SavePaymentMethod } from '../utils/redux/slices/cartSlice';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';
import PlaceOrderScreen from './placeorder';

export default function PaymentScreen() {
  const newPaymentMethod = useSelector((state) => {
    return state.cart.PaymenMethod;
  });

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    newPaymentMethod || ''
  );
  const cart = useSelector((state) => state.cart);

  const dispatch = useDispatch();
  const router = useRouter();

  function submitHandler(e) {
    e.preventDefault();
    if (!selectedPaymentMethod) {
      toast.error(' payment method required!', {
        position: 'bottom-center',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
    } else {
      dispatch(SavePaymentMethod(selectedPaymentMethod));
      Cookies.set(
        'cart',
        JSON.stringify({
          ...cart,
          PaymenMethod: selectedPaymentMethod,
        })
      );
      toast.success('payment method is saved..');

      toast.onChange((v) => {
        if (v.status === 'removed') {
          router.push('/placeorder');
        }
      });
    }
  }

  useEffect(() => {
    if (Object.keys(cart.ShippingAddress).length === 0) {
      router.push('/shipping');
    }
    if (!selectedPaymentMethod) {
      setSelectedPaymentMethod(cart.PaymentMethod);
    }
  }, [
    cart.PaymentMethod,
    cart.ShippingAddress,
    newPaymentMethod,
    router,
    selectedPaymentMethod,
  ]);

  return (
    <Layout title="Shipping address">
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
      <CheckoutWizard activeStep="2" />
      <div className="flex justify-center">
        <form
          className="mx-3 max-w-xs grow bg-gray-600 shadow-md shadow-amber-400 p-4 rounded-lg"
          onSubmit={(e) => {
            submitHandler(e);
          }}
        >
          <h1 className="mb-4 text-xl font-semibold text-amber-400">
            Payment Method
          </h1>

          {['CashOnDelivery'].map((payment) => (
            <div key={payment} className="mb-4">
              <input
                type="radio"
                id={payment}
                className="p-2 outline-none focus:ring-0 accent-amber-400"
                checked={selectedPaymentMethod === payment}
                onChange={() => setSelectedPaymentMethod(payment)}
              />
              <label htmlFor={payment} className="p-2 text-white">
                {payment}
              </label>
            </div>
          ))}
          {/* div for buttons */}
          <div className="mb-4 flex justify-between">
            <button
              onClick={() => {
                router.push('/shipping');
              }}
              type="button"
              className="default-button"
            >
              back
            </button>
            <button type="submit" className="primary-button">
              forward
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
PlaceOrderScreen.auth = true;
