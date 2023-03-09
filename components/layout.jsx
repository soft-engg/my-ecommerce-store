/* eslint-disable @next/next/no-img-element */
import { signOut, useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Menu } from '@headlessui/react';
import { useSelector } from 'react-redux';
import DropdownLink from './DropdownLink';
import Cookies from 'js-cookie';
export default function Layout({ title, children }) {
  const { status, data: session } = useSession();

  const itemsInCart = useSelector((state) => state.cart.cartItems);
  const [cartItemCount, setCartItemCount] = useState(0);
  const logoutClickHandler = () => {
    Cookies.remove('cart');
    signOut({ callbackUrl: '/login' });
  };

  useEffect(() => {
    setCartItemCount(itemsInCart.reduce((i, c) => (i += c.quantity), 0));
  }, [itemsInCart]);

  return (
    <>
      <Head>
        <title>{title ? title + '-M.Sports' : 'M.Sports'}</title>
        <meta name="description" content="Ecommerce-website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-col min-h-screen justify-between bg-black">
        {/* div for header nav bar */}
        <header className="w-full  bg-amber-400">
          <nav
            className="flex mx-auto h-10 max-w-screen-xl
          justify-between shadow shadow-md items-center px-4"
          >
            <div className="flex items-center">
              <img src="/icons/icon.png" alt="" className="h-8 w-9 m-1"></img>
              <Link href={'/'}>
                <a className="text-xl text-black hover:text-white font-bold">
                  M.Sports
                </a>
              </Link>
            </div>

            <div className="flex items-center text-lg font-semibold">
              {/* div for cart bag and  cart count */}
              <div className="relative pr-2 flex items-center">
                <Link href={'/cart'}>
                  <a className="pl-2   hover:underline hover:decoration-amber-400  ">
                    {/* eslint-disable-next-line @next/next/no-img-element, @next/next/no-img-element */}
                    <img
                      src="/icons/bag.png"
                      alt="cart"
                      className="w-8 h-8"
                    ></img>
                  </a>
                </Link>
                <p className="absolute text-black font-mono -top-2 right-0">
                  {cartItemCount}
                </p>
              </div>
              <p className="py-2 px-1  font-thin text-black">|</p>

              {status === 'loading' ? (
                'loading'
              ) : session?.user ? (
                <Menu as="div" className="relative z-20 inline-block ">
                  <Menu.Button className="text-amber-400  hover:text-black mr-2">
                    <div className="flex items-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/icons/user.png"
                        alt=""
                        className="w-7 h-7 m-1 "
                      />
                    </div>
                  </Menu.Button>
                  <Menu.Items
                    className="absolute
                    bg-white text-base  right-0 w-40 rounded-md
                     origin-top-right shadow-lg"
                  >
                    <Menu.Item>
                      <p
                        className="dropdown-link rounded
                        text-lg bg-amber-400 
                        cursor-default"
                      >
                        {session.user.name}
                      </p>
                    </Menu.Item>
                    <Menu.Item>
                      <DropdownLink
                        className="dropdown-link"
                        href="/order-history"
                      >
                        <Link href="/orderhistory">
                          <a>Order History</a>
                        </Link>
                      </DropdownLink>
                    </Menu.Item>
                    <Menu.Item>
                      <a
                        className="dropdown-link"
                        href="#"
                        onClick={logoutClickHandler}
                      >
                        Log out
                      </a>
                    </Menu.Item>
                  </Menu.Items>
                </Menu>
              ) : (
                <Link href="/login">
                  <a
                    className=" p-2 text-black 
                    transition-all text-lg hover:text-white
                    "
                  >
                    LogIn
                  </a>
                </Link>
              )}
            </div>
          </nav>
        </header>

        <main className="container px-4 2xl:px-0 m-auto mt-4 max-w-screen-xl">
          {children}
        </main>

        <footer className="flex justify-center items-center h-10 shadow-inner">
          <p className="text-sm mt-4 text-white">
            copyright Ⓒ 2022 MyECommerceStore
          </p>
        </footer>
      </div>
    </>
  );
}
