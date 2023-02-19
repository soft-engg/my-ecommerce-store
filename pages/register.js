import axios from 'axios';
import { signIn, useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import Layout from '../components/layout';
import { getError } from '../utils/getError';
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';
import { useRouter } from 'next/router';
import Link from 'next/link';

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
  const [sendAgainFlag] = useState(true);

  const pattern = new RegExp(
    "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?"
  );

  useEffect(() => {
    if (session?.user) {
      router.push(redirect || '/');
    }
  }, [redirect, session, router]);

  async function RegisterUser() {
    if (otpInput === '') {
      toast.error('please enter an OTP...');
      return false;
    } else {
      try {
        {
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
              toast.success('User Registered Successfully!!');
              return true;
            }
            if (result.error) {
              toast.error(result.error);
              return false;
            }
          } catch (error) {
            // if any error signing in we are going to show error
            toast.error(getError(error));
            return false;
          }
        }
      } catch (error) {
        toast.error(getError(error));
        return false;
      }
    }
  }
  //this function is used to signin user
  const signInUser = async () => {
    if (otp == otpInput) {
      try {
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
      } catch (error) {
        toast.error(getError(error));
      }
    } else {
      toast.error('OTP is Not correct');
    }
  };
  const submitOtpHandler = async () => {
    const userRegistered = await RegisterUser();
    if (userRegistered) {
      signInUser();
    }
  };
  // this function send the otp
  async function sendOTP() {
    try {
      const { data, status } = await toast.promise(
        axios.post(`/api/email/${email}`),
        {
          pending: 'Sending OTP...',
        }
      );

      if (status === 422) {
        toast.error(data);
        return false;
      }
      if (status === 400) {
        toast.error(data);
        return false;
      }
      if (status == 200) {
        toast.success('OTP Sent Successfully!!');
        setOtp(data);
        setShowForm(false);
        return true;
      }
    } catch (error) {
      toast.error(getError(error));
      return false;
    }
    // setSendAgainFlag(false);
    // await new Promise((resolve) => {
    //   setTimeout(() => {
    //     setSendAgainFlag(true);
    //     resolve('send again');
    //   }, 100000);
    // });
  }

  const checkingForExisitingUser = async () => {
    const { data, status } = await toast.promise(
      axios.get(`/api/auth/check/${email}`),
      { pending: 'checking for existing Account' }
    );
    if (status == 201) {
      toast.error(data);
      return true;
    }
    if (status === 200) return false; //user exist
  };
  // handling submit
  const submitHandler = async (e) => {
    e.preventDefault();
    const userExist = await checkingForExisitingUser();
    if (!userExist) {
      await sendOTP();
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
        {/* This is div for Otp */}
        <div
          className={`${
            showForm ? 'hidden' : 'flex'
          } text-white flex-col items-center`}
        >
          <h1 className="text-center font-bold text-xl mb-2 text-amber-400">
            Enter OTP{' '}
          </h1>
          <input
            placeholder=" 4 Digit OTP"
            value={otpInput}
            onChange={(e) => sendOtpInput(e.target.value)}
            className=" focus:bg-blue-100 bg-gray-50 border
            border-gray-300 text-2xl w-48 text-center rounded-lg
             text-black  tracking-widest
             focus:ring-amber-500  placeholder:font-normal 
             block  p-2 outline-none"
          ></input>
          <button
            onClick={() => submitOtpHandler()}
            className="primary-button text-black hover:bg-amber-500 transition-all mt-2 w-fit"
          >
            submit
          </button>
          <p>OTP is sent on your Email.</p>
          <p>Enter OTP to Register.</p>
          {!sendAgainFlag ? (
            <p className="text-white">
              you can retry sending OTP in 2 minutes.
            </p>
          ) : (
            <div className="flex">
              <p className="text-white">Not received ?</p>
              <button
                onClick={sendOTP}
                className="ml-2 text-amber-400 hover:text-amber-500 active:text-amber-600"
              >
                Send Again
              </button>
            </div>
          )}
          <button
            onClick={() => setShowForm(true)}
            className="bg-gray-100 hover:bg-gray-200
           active:bg-gray-200 px-2 text-amber-400 py-1 rounded  
           text-black active:-bg-gray-400 "
          >
            {`Go Back`}
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
              className="block mb-2  font-medium text-amber-400 dark:text-amber-500"
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
              <p className="text-white text-sm peer-valid:hidden peer-invalid:visible">
                please enter your FullName !!!
              </p>
            ) : null}
          </div>

          {/* email input */}
          <div className="mb-2">
            <label
              htmlFor="email"
              className="block mb-2  font-medium text-amber-400 dark:text-amber-500"
            >
              Your Email
            </label>
            <input
              type="email"
              id="email"
              pattern="[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?"
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
              <p className="text-white text-sm peer-valid:hidden peer-invalid:visible">
                please enter an email !!!
              </p>
            ) : pattern.test(email) ? null : (
              <p className="text-white text-sm peer-valid:hidden peer-invalid:visible">
                enter a valid email !!
              </p>
            )}
          </div>
          {/* password input */}
          <div className="mb-2">
            <label
              htmlFor="password"
              className="block mb-2  font-medium text-amber-400 dark:text-amber-500"
            >
              Your Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className=" peer focus:bg-blue-100 bg-gray-50 border
              border-gray-300  text-sm rounded-lg
               focus:ring-amber-500  font-bold
               block w-full p-2.5 dark:bg-gray-400 dark:border-gray-600
                dark:placeholder-gray-400 dark:text-white outline-none
                 "
              required
              placeholder="Password must contain 6 characters"
            />
            {password === '' ? (
              <div className="text-white text-sm">
                please enter the password
              </div>
            ) : password.length < 6 ? (
              <p className="text-white text-sm">
                password must be of six characters
              </p>
            ) : null}
          </div>
          {/* Confirm password input */}
          <div className="mb-2">
            <label
              htmlFor="text"
              className="block mb-2  font-medium text-amber-400 dark:text-amber-500"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmpassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className=" peer focus:bg-blue-100 bg-gray-50 border
              border-gray-300 font-bold  text-sm rounded-lg
               focus:ring-amber-500  
               block w-full p-2.5 dark:bg-gray-400 dark:border-gray-600
                dark:placeholder-gray-400 dark:text-white outline-none
                 "
              placeholder="Confirm Password"
              required
            />
            {confirmPassword === '' ? (
              <div className="text-white text-sm">
                please enter the password to confirm
              </div>
            ) : confirmPassword !== password ? (
              <p className="text-white text-sm">password does match..</p>
            ) : null}
          </div>
          <p className="mb-2 text-white">
            Already have an Account ?
            <Link href={`/login?redirect=${redirect || '/'}`}>
              <a
                className="text-amber-400 ml-2 italic hover:text-white
             font-semibold hover:underline"
              >
                Log In
              </a>
            </Link>
          </p>
          <button
            type="submit"
            className=" font-semibold bg-amber-400 hover:bg-amber-500 
            active focus:outline-none focus:ring-amber-300 active:bg-amber-300
            rounded-lg  w-1/2
             sm:w-auto px-5 py-2 text-center
              dark:bg-amber-600 dark:hover:bg-amber-400 dark:focus:ring-amber-500"
          >
            Register
          </button>
        </form>
      </div>
    </Layout>
  );
}
