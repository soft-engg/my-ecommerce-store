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
  const [otpInput, sendOtpInput] = useState('');
  const [showForm, setShowForm] = useState(true);
  const [otp, setOtp] = useState('');
  const [sendAgainFlag, setSendAgainFlag] = useState(true);

  const pattern = new RegExp(
    "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?"
  );

  useEffect(() => {
    if (session?.user) {
      router.push(redirect || '/');
    }
  }, [redirect, session, router]);

  async function sendOTP() {
    try {
      const { data } = await toast.promise(axios.get(`/api/email/${email}`), {
        pending: 'Sending OTP...',
      });

      if (data === 'error') {
        toast.error('error sending otp...');
        return;
      }
      if (data === 'notValidEmail') {
        toast.error('Please enter a valid Email Address!!');
        return;
      }
      toast.success('OTP Sent Successfully!!');

      setOtp(data);
      setShowForm(false);
    } catch (error) {
      toast.error('Error Sending OTP...');
    }
    setSendAgainFlag(false);
    await new Promise((resolve) => {
      setTimeout(() => {
        setSendAgainFlag(true);
        resolve('send again');
      }, 18000);
    });
  }
  async function vaidatingFields() {
    try {
      if (password.length > 6) {
        // here we are signing in the user using credentials
        try {
          const result = await toast.promise(
            axios.post('/api/auth/signup', {
              name,
              email,
              password,
            }),
            {
              pending: 'Registration in progress...',
            }
          );
          if (result.status === 422) {
            toast.error(result.body.message);
            return false;
          } else if (result.status === 201) {
            return true;
          }
          if (result.error) {
            toast.error(result.error);
            return false;
          }
        } catch (error) {
          // if any error signing in we are going to show error
          toast.error(getError(error));
        }
      }
    } catch (error) {
      toast.error(getError(error));
    }
  }
  const register = async () => {
    if (otpInput === '') {
      toast.error('please enter an OTP...');
      return;
    }
    if (otp == otpInput) {
      try {
        if (password.length > 6) {
          // here we are signing in the user using credentials
          try {
            // logging in after signup
            await toast.promise(
              signIn('credentials', {
                redirect: false,
                email,
                password,
              }),
              { pending: 'Signing you in!!!' }
            );
          } catch (error) {
            // if any error signing in we are going to show error
            toast.error(getError(error));
          }
        }
      } catch (error) {
        toast.error(getError(error));
      }
    } else {
      toast.error('OTP is Not correct');
    }
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    const validateResult = await vaidatingFields();
    if (validateResult) sendOTP();
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
        {/* This is div for Otp */}
        <div
          className={`${showForm ? 'hidden' : 'flex'}  flex-col items-center`}
        >
          <input
            placeholder=" 4 Digit OTP"
            value={otpInput}
            onChange={(e) => sendOtpInput(e.target.value)}
            className=" focus:bg-blue-100 bg-gray-50 border
            border-gray-300  text-sm rounded-lg
             focus:ring-amber-500  
             block w-full p-2.5 dark:bg-gray-400 dark:border-gray-600
              dark:placeholder-gray-400 dark:text-white outline-none"
          ></input>
          <button onClick={register} className="primary-button mt-2 w-fit">
            submit
          </button>
          <p>OTP is sent on your Email.</p>
          <p>Enter OTP to Register.</p>
          {!sendAgainFlag ? (
            <p>you can retry sending OTP in 2 minutes.</p>
          ) : (
            <div className="flex">
              <p>Not received ?</p>
              <button
                onClick={sendOTP}
                className="ml-2 text-blue-500 hover:text-blue-600"
              >
                Send Again
              </button>
            </div>
          )}
          <button
            onClick={() => setShowForm(true)}
            className="bg-gray-100 hover:bg-gray-200
           active:bg-gray-200 px-2 py-1 rounded text-blue-500 hover:text-blue-600"
          >
            {`<< Back`}
          </button>
        </div>
        {/* This is div for form */}
        <form
          className={`${
            showForm ? 'block' : 'hidden'
          } p-4 w-3/4 lg:w-1/2 md:m-auto`}
          onSubmit={(e) => submitHandler(e)}
        >
          {/* fullName input */}
          <div className="mb-2">
            <label
              htmlFor="fullname"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Your Full Name
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
              Your Email
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
              Your Password
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
              placeholder="Password must contain 6 characters"
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
              Confirm Password
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
              placeholder="Confirm Password"
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
