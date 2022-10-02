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
              <a className="text-lg font-bold bg-clip-text text-blue-600">
                MyECommerceApp{' '}
              </a>
            </Link>
            <div>
              <Link href={'/cart'}>
                <a className="p-2 text-bold">Cart</a>
              </Link>

              <Link href={'/Login'}>
                <a className="p-2 text-bold">Login</a>
              </Link>
            </div>
          </nav>
        </header>
        <main className="container m-auto mt-4  bg-blue-400">{children}</main>
        <footer className="flex justify-center items-center h-10 shadow-inner">
          <p className="text-sm">copyright Ⓒ 2022 MyECommerceStore</p>
        </footer>
      </div>
    </>
  );
}
