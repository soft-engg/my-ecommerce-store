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
        <div className="flex flex-col min-h-screen justify-between">
          <header>
            <nav className="flex h-12 justify-between shadow-md items-center px-4">
              <h1 className="text-lg text-blue-500 font-bold">Admin Panel</h1>
            </nav>
          </header>
          <main className="container m-auto mt-4  ">{children}</main>
          <footer className="flex justify-center items-center h-10 shadow-inner">
            <p className="text-sm">
              copyright Ⓒ designed and developed by Shahbaz Ali
            </p>
          </footer>
        </div>
      </>
    );
  return (
    <Layout title="only Admin Page">
      <div className="flex flex-col items-center mt-5">
        <h1>Only Admin of Website is allowed in this Secion</h1>
        <Link href="/">
          <a>Go to Home Page</a>
        </Link>
      </div>
    </Layout>
  );
}
AdminLayout.auth = true;
