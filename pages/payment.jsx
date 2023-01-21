import React from 'react';
import { useState } from 'react';
import CheckoutWizard from '../components/checkoutwizard';
import Layout from '../components/layout';
import { useDispatch, useSelector } from 'react-redux';
import { SavePaymentMethod } from '../utils/redux/slices/cartSlice';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import Cookies from 'js-cookie';

export default function PaymentScreen() {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const cart = useSelector((state) => state.cart);
  const { ShippingAddress, PaymentMethod } = cart;
  const dispatch = useDispatch();
  const router = useRouter();

  function submitHandler(e) {
    e.preventDefault();
    if (selectedPaymentMethod === '') {
      toast.error('payment method is required');
    } else {
      dispatch(SavePaymentMethod(selectedPaymentMethod));
      Cookies.set(
        'cart',
        JSON.stringify({
          ...cart,
          PaymentMethod: selectedPaymentMethod,
        })
      );
    }
  }

  useEffect(() => {
    if (!ShippingAddress.address) router.push('/shipping');
  }, [PaymentMethod, router, ShippingAddress.address]);

  return (
    <Layout title="Shipping address">
      <ToastContainer position="bottom-center" limit={1}></ToastContainer>
      <CheckoutWizard activeStep="2" />
      <form
        action="mx-auto max-w-screen-md"
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
    </Layout>
  );
}
