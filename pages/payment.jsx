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

export default function PaymentScreen() {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const cart = useSelector((state) => state.cart);
  const newPaymentMethod = useSelector((state) => {
    console.log('I am running selector');
    console.log(state.cart.PaymenMethod);
    return state.cart.PaymenMethod;
  });
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
    }
  }

  useEffect(() => {
    if (Object.keys(cart.ShippingAddress).length === 0) {
      router.push('/shipping');
    }
    if (!selectedPaymentMethod) {
      setSelectedPaymentMethod(cart.PaymenMethod);
    }
  }, [
    cart.PaymenMethod,
    cart.ShippingAddress,
    newPaymentMethod,
    router,
    selectedPaymentMethod,
  ]);

  return (
    <Layout title="Shipping address">
      <ToastContainer
        position="bottom-center"
        autoClose={500}
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
          className="mx-3 max-w-xs grow shadow-md shadow-amber-400 p-4 rounded-lg"
          onSubmit={(e) => {
            submitHandler(e);
          }}
        >
          <h1 className="mb-4 text-xl text-blue-600">Payment Method</h1>

          {['CashOnDelivery', 'CreditCard'].map((payment) => (
            <div key={payment} className="mb-4">
              <input
                type="radio"
                id={payment}
                className="p-2 outline-none focus:ring-0"
                checked={selectedPaymentMethod === payment}
                onChange={() => setSelectedPaymentMethod(payment)}
              />
              <label htmlFor={payment} className="p-2">
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
