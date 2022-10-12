import Link from 'next/link';
import { useState } from 'react';
import Layout from '../components/layout';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function loginHandler(e) {
    e.preventDefault();
    const pattern = new RegExp(
      "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?"
    );
    pattern.test(email)
      ? password.length > 6
        ? console.log(email, password)
        : alert('Enter the valid password')
      : console.log('enter the valid email');
  }
  return (
    <Layout title={'Login'}>
      <form
        className="p-4 md:w-1/2 md:m-auto"
        onSubmit={(e) => loginHandler(e)}
      >
        <div class="mb-2">
          <label
            for="email"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
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
        <div class="mb-2">
          <label
            for="password"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            Your password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            class="peer bg-gray-50 font-bold border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-amber-500 focus:border-amber-500 block w-full p-2.5 dark:bg-gray-400 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-amber-500 dark:focus:border-amber-500"
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
        <div class="flex items-start mb-2">
          <div class="flex items-center h-5">
            <input
              id="remember"
              type="checkbox"
              value=""
              class="w-4 h-4 accent-amber-400 bg-gray-50 rounded border border-gray-300 focus:ring-3 focus:ring-amber-300 dark:bg-gray-400 dark:border-gray-600 dark:focus:ring-amber-600 dark:ring-offset-gray-500"
              required
            />
          </div>
          <label
            for="remember"
            class="ml-2 text-sm font-medium   text-gray-900 dark:text-gray-300"
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
          class="text-white font-bold bg-amber-400 hover:bg-amber-500 focus:ring-4 focus:outline-none focus:ring-amber-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-amber-600 dark:hover:bg-amber-400 dark:focus:ring-amber-500"
        >
          Login
        </button>
      </form>
    </Layout>
  );
}
