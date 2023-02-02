import axios from 'axios';
import { signIn, useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import Layout from '../components/layout';
import { getError } from '../utils/getError';
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';
import { useRouter } from 'next/router';
export default function RegisterScreen() {
  const router = useRouter();

  const { redirect } = router.query;
  const { data: session } = useSession();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const pattern = new RegExp(
    "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?"
  );
  useEffect(() => {
    if (session?.user) {
      router.push(redirect || '/');
    }
  }, [redirect, session, router]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      if (password.length > 6) {
        // here we are signing in the user using credentials
        try {
          await toast.promise(
            axios.post('/api/auth/signup', {
              name,
              email,
              password,
            }),
            {
              pending: 'Registration in progress...',

              error: 'Unable to Register...',
              success: 'Registration completed',
            }
          );
        } catch (error) {
          // if any error signing in we are going to show error
          toast.error(getError(error));
        }
      }

      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });
      if (result.error) {
        toast.error(result.error);
      }
    } catch (error) {
      console.log(getError(error));
    }
  };

  return (
    <Layout title="Register User">
      <ToastContainer
        position="bottom-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

      <div className="w-full  flex justify-center">
        <form
          className="p-4 w-3/4 lg:w-1/2 md:m-auto"
          onSubmit={(e) => submitHandler(e)}
        >
          {/* fullName input */}
          <div className="mb-2">
            <label
              htmlFor="fullname"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Your fullName
            </label>
            <input
              type="text"
              id="fullname"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className=" peer focus:bg-blue-100 bg-gray-50 border
              border-gray-300  text-sm rounded-lg
               focus:ring-amber-500  
               block w-full p-2.5 dark:bg-gray-400 dark:border-gray-600
                dark:placeholder-gray-400 dark:text-white outline-none
                 "
              placeholder="eg.. Muhammad Ali"
              required
            />
            {name === '' ? (
              <p className="text-red-600 text-sm peer-valid:hidden peer-invalid:visible">
                please enter your FullName !!!
              </p>
            ) : null}
          </div>

          {/* email input */}
          <div className="mb-2">
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Your email
            </label>
            <input
              type="email"
              id="email"
              pattern="[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className=" peer focus:bg-blue-100 bg-gray-50 border
              border-gray-300  text-sm rounded-lg
               focus:ring-amber-500  
               block w-full p-2.5 dark:bg-gray-400 dark:border-gray-600
                dark:placeholder-gray-400 dark:text-white outline-none
                 "
              placeholder="example@gmail.com"
              required
            />
            {email === '' ? (
              <p className="text-red-600 text-sm peer-valid:hidden peer-invalid:visible">
                please enter an email !!!
              </p>
            ) : pattern.test(email) ? null : (
              <p className="text-red-600 text-sm peer-valid:hidden peer-invalid:visible">
                enter a valid email !!
              </p>
            )}
          </div>
          {/* password input */}
          <div className="mb-2">
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Your password
            </label>
            <input
              type="text"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className=" peer focus:bg-blue-100 bg-gray-50 border
              border-gray-300  text-sm rounded-lg
               focus:ring-amber-500  
               block w-full p-2.5 dark:bg-gray-400 dark:border-gray-600
                dark:placeholder-gray-400 dark:text-white outline-none
                 "
              required
            />
            {password === '' ? (
              <div className="text-red-600 text-sm">
                please enter the password
              </div>
            ) : password.length < 6 ? (
              <p className="text-red-600 text-sm">
                password must be of six characters
              </p>
            ) : null}
          </div>
          {/* Confirm password input */}
          <div className="mb-2">
            <label
              htmlFor="text"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Confirm password
            </label>
            <input
              type="text"
              id="confirmpassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className=" peer focus:bg-blue-100 bg-gray-50 border
              border-gray-300  text-sm rounded-lg
               focus:ring-amber-500  
               block w-full p-2.5 dark:bg-gray-400 dark:border-gray-600
                dark:placeholder-gray-400 dark:text-white outline-none
                 "
              required
            />
            {confirmPassword === '' ? (
              <div className="text-red-600 text-sm">
                please enter the password to confirm
              </div>
            ) : confirmPassword !== password ? (
              <p className="text-red-600 text-sm">password does match..</p>
            ) : null}
          </div>

          <button
            type="submit"
            className=" font-bold bg-amber-400 hover:bg-amber-500 
            active focus:outline-none focus:ring-amber-300 active:bg-amber-300
            font-medium rounded-lg text-sm w-1/2
             sm:w-auto px-5 py-2.5 text-center
              dark:bg-amber-600 dark:hover:bg-amber-400 dark:focus:ring-amber-500"
          >
            Register
          </button>
        </form>
      </div>
    </Layout>
  );
}
