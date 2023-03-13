import { useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from './layout';

export default function AdminLayout({ title, children }) {
  const session = useSession();
  const { user } = session.data;
  if (user?.isAdmin)
    return (
      <>
        <Head>
          <title>
            {title ? title + '-MyECommerceStore' : 'My-ecommerce-store'}
          </title>
          <meta name="description" content="Ecommerce-website" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="flex flex-col min-h-screen justify-between bg-black">
          <header>
            <nav
              className="flex h-10 justify-between bg-amber-400
             shadow-md items-center px-6"
            >
              <div className="flex">
                <h1 className=" text-black font-extrabold">Admin Panel</h1>
              </div>
              <div className="flex items-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/icons/user.png"
                  alt="Admin"
                  className="h-7 w-7 mx-2"
                ></img>
                <p
                  className=" text-black font-sarif
               font-bold flex items-center"
                >
                  {user.name.toUpperCase()}
                </p>
              </div>
            </nav>
          </header>
          <main className="container px-4  md:px-0 m-auto mt-4 ">
            {children}
          </main>
          <footer className="flex justify-center items-center h-10 shadow-inner">
            <p className="text-sm text-white">
              copyright Ⓒ designed and developed by Shahbaz Ali
            </p>
          </footer>
        </div>
      </>
    );
  return (
    <Layout title="only Admin Page">
      <div className="flex flex-col items-center mt-5">
        <h1 className="text-white">
          Only Admin of Website is allowed in this Secion
        </h1>
        <Link href="/">
          <a>Go to Home Page</a>
        </Link>
      </div>
    </Layout>
  );
}
AdminLayout.auth = true;
