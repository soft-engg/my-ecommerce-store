import React, { useEffect, useState } from 'react';
import CheckoutWizard from '../components/checkoutwizard';
import Layout from '../components/layout';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { SaveShippingAddress } from '../utils/redux/slices/cartSlice';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { toast, ToastContainer } from 'react-toastify';

export default function ShippingScreen() {
  const dispatch = useDispatch();
  const [address, setAddress] = useState('');
  const [fullName, setFullName] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const router = useRouter();
  const cart = useSelector((state) => state.cart, shallowEqual);

  useEffect(() => {
    if (Object.keys(cart.ShippingAddress).length !== 0) {
      setAddress(cart.ShippingAddress.address);
      setFullName(cart.ShippingAddress.fullName);
      setCity(cart.ShippingAddress.city);
      setCountry(cart.ShippingAddress.country);
      setPostalCode(cart.ShippingAddress.postalCode);
    }
  }, [cart.ShippingAddress, router]);

  // handling the submit functions
  function submitHandler(e) {
    e.preventDefault();
    dispatch(
      SaveShippingAddress({ fullName, address, postalCode, city, country })
    );

    Cookies.set(
      'cart',
      JSON.stringify({
        ...cart,
        ShippingAddress: { fullName, address, postalCode, city, country },
      })
    );
    router.push('/payment').finally(() => {
      toast.success('Shipping address is Saved!!');
    });
  }

  // the body code
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
        theme="color"
      />
      <CheckoutWizard activeStep="1" />
      <div className="w-full  flex justify-center">
        <form
          className="mx-3 grow max-w-md p-4 shadow-md shadow-amber-400 rounded-lg "
          onSubmit={(e) => {
            submitHandler(e);
          }}
        >
          <h1 className="text-lg text-blue-500 font-semibold">
            Shipping address
          </h1>

          <div className="mb-2">
            <label
              htmlFor="Full Name"
              className="block mb-2  font-medium text-blue-500 dark:text-gray-300"
            >
              Your Full Name
            </label>
            <input
              type="Name"
              id="Full Name"
              value={fullName}
              autoFocus
              onChange={(e) => setFullName(e.target.value)}
              className=" input-style"
              placeholder="Enter your Full Name"
              required
            />
            {fullName === '' ? (
              <p className="text-red-600 text-md peer-valid:hidden peer-invalid:visible">
                please your Full Name !!!
              </p>
            ) : null}
          </div>
          {/* input for aDDRESS */}

          <div className="mb-2">
            <label
              htmlFor="address"
              className="block mb-2  font-medium text-blue-500 dark:text-gray-300"
            >
              Your address
            </label>
            <input
              type="address"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className=" input-style"
              placeholder="Enter our address"
              required
            />
            {address === '' ? (
              <p className="text-red-600 text-md peer-valid:hidden peer-invalid:visible">
                please enter shipping address !!!
              </p>
            ) : null}
          </div>
          {/* input for city */}
          <div className="mb-2">
            <label
              htmlFor="city"
              className="block mb-2  font-medium text-blue-500 dark:text-gray-300"
            >
              Your city
            </label>
            <input
              type="city"
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className=" input-style"
              placeholder="Enter City Name"
              required
            />
            {city === '' ? (
              <p className="text-red-600 text-md peer-valid:hidden peer-invalid:visible">
                please enter your city !!!
              </p>
            ) : null}
          </div>
          {/* Postal code */}
          <div className="mb-2">
            <label
              htmlFor="Postal code"
              className="block mb-2  font-medium text-blue-500 dark:text-gray-300"
            >
              Your Postal code
            </label>
            <input
              type="text"
              value={postalCode}
              id="Postal code"
              onChange={(e) => setPostalCode(e.target.value)}
              className=" input-style"
              placeholder="Enter your Area postal code"
              required
            />
            {postalCode === '' ? (
              <p className="text-red-600 text-md peer-valid:hidden peer-invalid:visible">
                please enter Postal code!!!
              </p>
            ) : null}
          </div>
          {/* country */}
          <div className="mb-2">
            <label
              htmlFor="country"
              className="block mb-2  font-medium text-blue-500 dark:text-gray-300"
            >
              Your country
            </label>
            <input
              type="country"
              id="country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className=" input-style"
              placeholder="your area postal code"
              required
            />
            {country === '' ? (
              <p className="text-red-600 text-md peer-valid:hidden peer-invalid:visible">
                please enter your country!!!
              </p>
            ) : null}
          </div>
          <button type="submit" className="primary-button ">
            Next
          </button>
        </form>
      </div>
    </Layout>
  );
}

// making the screen authorization protected
ShippingScreen.auth = true;
