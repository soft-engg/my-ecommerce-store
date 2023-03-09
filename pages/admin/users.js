import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { toast, ToastContainer } from 'react-toastify';
import AdminLayout from '../../components/adminLayout';
import Layout from '../../components/layout';
import Pagination from '../../components/usersPagination';
import User from '../../models/users';
import db from '../../utils/db';
import 'react-toastify/dist/ReactToastify.css';
export default function UsersScreen({ users }) {
  const session = useSession();
  const router = useRouter();
  const { user } = session.data;
  // if user is admin then return this
  if (user?.isAdmin)
    return (
      <AdminLayout title="AllUsers">
        <ToastContainer
          position="bottom-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
        <h1 className="text-amber-400 text-lg  mb-2 font-bold">All Users</h1>
        <Pagination users={users} router={router} toast={toast} />
      </AdminLayout>
    );
  //  if user is not admin then return this page
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

export async function getServerSideProps() {
  await db.connect();
  const users = await User.find().lean();
  await db.disconnect();
  return {
    props: {
      users: users.map((user) => db.convertDocToObj(user)).reverse(),
    },
  };
}
UsersScreen.auth = true;
