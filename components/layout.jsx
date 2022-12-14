import { useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export default function Layout({ title, children }) {
  const { status, data: session } = useSession();

  const itemsInCart = useSelector((state) => state.cart.cart);
  const [cartItemCount, setCartItemCount] = useState(0);

  useEffect(() => {
    setCartItemCount(itemsInCart.reduce((i, c) => (i += c.quantity), 0));
  }, [itemsInCart]);

  return (
    <>
      <Head>
        <title>
          {title ? title + '-MyECommerceStore' : 'My-ecommerce-store'}
        </title>
        <meta name="description" content="Ecommerce-website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-col min-h-screen justify-between">
        <header>
          <nav className="flex h-12 justify-between shadow-md items-center px-4">
            <Link href={'/'}>
              <a className="text-2xl text-gray-700 font-black bg-clip-text ">
                MyECommerceApp
              </a>
            </Link>
            <div className="flex items-center text-lg font-semibold">
              <Link href={'/cart'}>
                <a className="p-2 pr-0  hover:underline hover:decoration-amber-400  ">
                  Cart
                </a>
              </Link>
              <div className="ml-1 text-base text-center min-w-[25px] px-2 font-mono rounded-full bg-red-500  text-white  ">
                {cartItemCount}
              </div>
              <p className="py-2 px-1 text-gray-300 font-thin">|</p>

              {status === 'loading' ? (
                'loading'
              ) : session?.user ? (
                session.user.name
              ) : (
                <Link href="/login">
                  <a className=" p-2 hover:underline hover:decoration-amber-400">
                    Login
                  </a>
                </Link>
              )}
            </div>
          </nav>
        </header>

        <main className="container m-auto mt-4  ">{children}</main>

        <footer className="flex justify-center items-center h-10 shadow-inner">
          <p className="text-sm">copyright ??? 2022 MyECommerceStore</p>
        </footer>
      </div>
    </>
  );
}
