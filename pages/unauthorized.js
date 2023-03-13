import { useRouter } from 'next/router';
import React from 'react';
import Layout from '../components/layout';

export default function Unauthorized() {
  const router = useRouter();
  const { message } = router.query;
  return (
    <Layout title="Unauthorized page">
      <div className="mx-auto w-full">
        <h1 className="text-xl text-center text-red-600 font-semibold">
          Access Denied
        </h1>
        {message && (
          <div className="mb-4 text-base font-bold text-red-500 text-center text-white ">
            {message}
          </div>
        )}
      </div>
    </Layout>
  );
}
