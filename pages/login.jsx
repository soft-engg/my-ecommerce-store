import Link from 'next/link';
import { useEffect, useState } from 'react';
import Layout from '../components/layout';
import { signIn, useSession } from 'next-auth/react';
import { toast, ToastContainer } from 'react-toastify';

import { useRouter } from 'next/router';
import 'react-toastify/dist/ReactToastify.css';
export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const { data: session } = useSession();

  const { redirect } = router.query;
  console.log(router.query);
  useEffect(() => {
    if (session?.user) {
      router.push(redirect || '/');
    }
  }, [router, session, redirect]);

  // the function that handle login
  async function loginHandler(e) {
    e.preventDefault();
    // this is pattern to check email
    const pattern = new RegExp(
      "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?"
    );

    if (pattern.test(email)) {
      if (password.length > 6) {
        // here we are signing in the user using credentials
        try {
          const result = await signIn('credentials', {
            redirect: false,
            email,
            password,
          });
          // if signin fails we are going to show error
          if (result.error) {
            toast.error(result.error);
          }
        } catch (error) {
          // if any error signing in we are going to show error
          toast.error(error);
        }
      }
      // this triggers when password is less then 6 characters
      else alert('Enter the valid password');
    }
    // this triggers if the password is greater than 6 characters
    else console.log('enter the valid email');
  }
  // here we are returning the actual page
  return (
    <Layout title={'Login'}>
      <ToastContainer position="bottom-center" limit={1}></ToastContainer>
      <form
        className="p-4 md:w-1/2 md:m-auto"
        onSubmit={(e) => loginHandler(e)}
      >
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
            className=" peer bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-amber-500 focus:border-amber-500 block w-full p-2.5 dark:bg-gray-400 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-amber-500 dark:focus:border-amber-500"
            placeholder="example@gmail.com"
            required
          />
          {email === '' ? (
            <p className="text-red-600 text-sm peer-valid:invisible peer-invalid:visible">
              please enter an email !!!
            </p>
          ) : (
            <p className="text-red-600 text-sm peer-valid:invisible peer-invalid:visible">
              enter a valid email !!!
            </p>
          )}
        </div>
        <div className="mb-2">
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            Your password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="peer bg-gray-50 font-bold border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-amber-500 focus:border-amber-500 block w-full p-2.5 dark:bg-gray-400 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-amber-500 dark:focus:border-amber-500"
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
        <div className="flex items-start mb-2">
          <div className="flex items-center h-5">
            <input
              id="remember"
              type="checkbox"
              value=""
              className="w-4 h-4 accent-amber-400 bg-gray-50 rounded border border-gray-300 focus:ring-3 focus:ring-amber-300 dark:bg-gray-400 dark:border-gray-600 dark:focus:ring-amber-600 dark:ring-offset-gray-500"
              required
            />
          </div>
          <label
            htmlFor="remember"
            className="ml-2 text-sm font-medium   text-gray-900 dark:text-gray-300"
          >
            Remember me
          </label>
        </div>
        <p className="mb-2 ">
          Dont have a account yet?
          <Link href={'/register'}>
            <a className="text-blue-700 ml-2 italic font-semibold hover:underline">
              Register now
            </a>
          </Link>
        </p>
        <button
          type="submit"
          className="text-white font-bold bg-amber-400 hover:bg-amber-500 focus:ring-4 focus:outline-none focus:ring-amber-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-amber-600 dark:hover:bg-amber-400 dark:focus:ring-amber-500"
        >
          Login
        </button>
      </form>
    </Layout>
  );
}
