import React, { useEffect, useState } from 'react';
import CheckoutWizard from '../components/checkoutwizard';
import Layout from '../components/layout';
import { useDispatch, useSelector } from 'react-redux';
import { SaveShippingAddress } from '../utils/redux/slices/cartSlice';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

export default function ShippingScreen() {
  const dispatch = useDispatch();
  const [address, setAddress] = useState('');
  const [fullName, setFullName] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const router = useRouter();
  const cart = useSelector((state) => state.cart);
  useEffect(() => {
    setAddress(cart.ShippingAddress.address);
    setFullName(cart.ShippingAddress.fullName);
    setCity(cart.ShippingAddress.city);
    setCountry(cart.ShippingAddress.country);
    setPostalCode(cart.ShippingAddress.postalCode);
  }, [cart.ShippingAddress]);

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
    router.push('/payment');
  }

  // the body code
  return (
    <Layout title="Shipping address">
      <CheckoutWizard activeStep="1" />
      <form
        className="mx-auto max-w-screen-md"
        onSubmit={(e) => {
          submitHandler(e);
        }}
      >
        <h1 className="text-xl text-blue-700">Shipping address</h1>

        <div className="mb-2">
          <label
            htmlFor="Full Name"
            className="block mb-2  font-bold text-blue-500 dark:text-gray-300"
          >
            Your Full Name
          </label>
          <input
            type="Name"
            id="Full Name"
            value={fullName}
            autoFocus
            onChange={(e) => setFullName(e.target.value)}
            className=" peer focus:bg-blue-100 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-amber-500 focus:border-amber-500 block w-full p-2.5 dark:bg-gray-400 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-amber-500 dark:focus:border-amber-500"
            placeholder="example@gmail.com"
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
            className="block mb-2  font-bold text-blue-500 dark:text-gray-300"
          >
            Your address
          </label>
          <input
            type="address"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className=" peer focus:bg-blue-100 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-amber-500 focus:border-amber-500 block w-full p-2.5 dark:bg-gray-400 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-amber-500 dark:focus:border-amber-500"
            placeholder="example@gmail.com"
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
            className="block mb-2  font-bold text-blue-500 dark:text-gray-300"
          >
            Your city
          </label>
          <input
            type="city"
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className=" peer focus:bg-blue-100 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-amber-500 focus:border-amber-500 block w-full p-2.5 dark:bg-gray-400 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-amber-500 dark:focus:border-amber-500"
            placeholder="City Name"
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
            className="block mb-2  font-bold text-blue-500 dark:text-gray-300"
          >
            Your Postal code
          </label>
          <input
            type="text"
            value={postalCode}
            id="Postal code"
            onChange={(e) => setPostalCode(e.target.value)}
            className=" peer focus:bg-blue-100 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-amber-500 focus:border-amber-500 block w-full p-2.5 dark:bg-gray-400 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-amber-500 dark:focus:border-amber-500"
            placeholder="your area postal code"
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
            className="block mb-2  font-bold text-blue-500 dark:text-gray-300"
          >
            Your country
          </label>
          <input
            type="country"
            id="country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className=" peer focus:bg-blue-100 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-amber-500 focus:border-amber-500 block w-full p-2.5 dark:bg-gray-400 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-amber-500 dark:focus:border-amber-500"
            placeholder="your area postal code"
            required
          />
          {country === '' ? (
            <p className="text-red-600 text-md peer-valid:hidden peer-invalid:visible">
              please enter your country!!!
            </p>
          ) : null}
        </div>
        <button type="submit" className="primary-button">
          Next
        </button>
      </form>
    </Layout>
  );
}

// making the screen authorization protected
ShippingScreen.auth = true;
