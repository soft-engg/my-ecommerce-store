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
              <a className="text-lg text-blue-500 font-black">MySports</a>
            </Link>
            <div className="flex items-center text-lg font-semibold">
              <Link href={'/cart'}>
                <a className="p-2 pr-0  hover:underline hover:decoration-amber-400  ">
                  <img
                    src="/icons/shoppingCart.png"
                    alt="cart"
                    className="w-8 h-8"
                  ></img>
                </a>
              </Link>
              <div className="ml-1 text-base text-center min-w-[25px] px-2 font-mono rounded-full bg-blue-500  text-white  ">
                {cartItemCount}
              </div>
              <p className="py-2 px-1 text-gray-300 font-thin">|</p>

              {status === 'loading' ? (
                'loading'
              ) : session?.user ? (
                <Menu as="div" className="relative inline-block">
                  <Menu.Button className="text-blue-500 font-bold hover:text-black mr-2">
                    <div className="flex items-center">
                      {' '}
                      <img
                        src="/icons/user.png"
                        alt=""
                        className="w-7 h-7 m-1 "
                      />{' '}
                      {session.user.name}
                    </div>
                  </Menu.Button>
                  <Menu.Items className="absolute bg-white text-base  right-0 w-40 rounded-md origin-top-right shadow-lg">
                    <Menu.Item>
                      <DropdownLink className="dropdown-link" href="/profile">
                        Profile
                      </DropdownLink>
                    </Menu.Item>
                    <Menu.Item>
                      <DropdownLink
                        className="dropdown-link"
                        href="/order-history"
                      >
                        Order History
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
          <p className="text-sm">copyright Ⓒ 2022 MyECommerceStore</p>
        </footer>
      </div>
    </>
  );
}
