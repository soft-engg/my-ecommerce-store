import Link from 'next/link';
import { useEffect, useState } from 'react';
import Layout from '../components/layout';
import { signIn, useSession } from 'next-auth/react';
import { toast, ToastContainer } from 'react-toastify';
import { useRouter } from 'next/router';
import 'react-toastify/dist/ReactToastify.css';

export default function Login() {
  const pattern = new RegExp(
    "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?"
  );
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const { data: session } = useSession();

  const { redirect } = router.query;

  useEffect(() => {
    if (session?.user) {
      if (session?.user.isAdmin === true) {
        router.push('/admin');
        return;
      }
      router.push(redirect || '/');
    }
  }, [router, session, redirect]);

  // the function that handle login
  async function loginHandler(e) {
    e.preventDefault();
    // this is pattern to check email

    if (pattern.test(email)) {
      if (password.length >= 6) {
        // here we are signing in the user using credentials
        try {
          const result = await toast.promise(
            signIn('credentials', {
              redirect: false,
              email,
              password,
            }),
            {
              pending: 'Logging in....',

              error: 'Unable to Login...',
            }
          );
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
      else toast.error(password.length);
    }
    // this triggers if the password is greater than 6 characters
    else toast.error('enter the valid email');
  }
  // here we are returning the actual page
  return (
    <Layout title={'Login'}>
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
      <form
        className="p-4 md:w-1/2 md:m-auto"
        onSubmit={(e) => loginHandler(e)}
      >
        <div className="mb-2">
          <label
            htmlFor="email"
            className="block mb-2 font-medium text-amber-400"
          >
            Your Email
          </label>
          <input
            type="email"
            id="email"
            pattern="[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className=" peer input-style
              "
            placeholder="example@gmail.com"
            required
          />
          {email === '' ? (
            <p className="text-white mt-1 text-sm peer-valid:hidden peer-invalid:visible">
              please enter an email !!!
            </p>
          ) : pattern.test(email) ? null : (
            <p className="text-red-500 mt-1 text-sm peer-valid:hidden peer-invalid:visible">
              enter a valid email !!1
            </p>
          )}
        </div>
        <div className="mb-2">
          <label
            htmlFor="password"
            className="block mb-2 font-medium text-amber-400"
          >
            Your Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="peer input-style"
            placeholder="enter your password"
            required
          />
          {password === '' ? (
            <div className="text-white mt-1 text-sm">
              please enter the password
            </div>
          ) : password.length < 6 ? (
            <p className="text-red-500 mt-1 text-sm">
              password must be of six characters
            </p>
          ) : null}
        </div>

        <p className="mb-2 text-white">
          Dont have a account yet?
          <Link href={`/register?redirect=${redirect || '/'}`}>
            <a
              className="text-amber-400 ml-2 italic hover:text-white
             font-semibold hover:underline"
            >
              Register now
            </a>
          </Link>
        </p>
        <button
          type="submit"
          className=" font-bold bg-amber-400 hover:bg-amber-500
           focus:ring-4 focus:outline-none focus:ring-white
           rounded-lg w-full sm:w-auto px-5 py-2 text-center
            dark:bg-amber-300 "
        >
          Login
        </button>
      </form>
    </Layout>
  );
}
