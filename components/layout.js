import Head from 'next/head';
import Link from 'next/link';

export default function Layout({ title, children }) {
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
              <a className="text-xl font-extrabold bg-clip-text text-amber-400 ">
                MyECommerceApp
              </a>
            </Link>
            <div className=" text-lg font-semibold">
              <Link href={'/cart'}>
                <a className="p-2 hover:underline hover:decoration-amber-400  ">
                  Cart
                </a>
              </Link>

              <Link href={'/Login'}>
                <a className="p-2 hover:underline hover:decoration-amber-400">
                  Login
                </a>
              </Link>
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
