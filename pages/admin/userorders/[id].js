import axios from 'axios';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import AdminLayout from '../../../components/adminLayout';
import { getError } from '../../../utils/getError';

export default function OrderHistoryScreen() {
  const router = useRouter();
  const { id: userId } = router.query;
  const session = useSession();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function getData() {
      try {
        const { data } = await axios.get(`/api/order/user/${userId}`);
        setData(data.reverse());
        setLoading(false);
      } catch (error) {
        toast.error(getError(error));
      }
    }
    getData();
  }, [session.data.user, userId]);

  return (
    <AdminLayout title="Order History">
      <div className="flex mb-2 justify-between font-semibold underline items-center">
        <h1 className="   text-lg text-amber-400 font-bold">Order History</h1>
        <Link href={'/'}>
          <a className="text-amber-400 hover:text-white ">Go to Shopping</a>
        </Link>
      </div>
      <div className="">
        {loading ? (
          <p className="text-white">please wait loading......</p>
        ) : data.length === 0 ? (
          <div>
            <p className="text-red-400">No Order History Available</p>
          </div>
        ) : (
          <div className=" bg-gray-500 min-h-[70vh] rounded ">
            <div className="flex mb-1 w-full bg-black border-t-2 border-gray-600 border-x-2 rounded   font-semibold p-1">
              <p className="w-2/12 text-amber-400 font-bold text-center ">
                Items
              </p>
              <p className="w-3/12 text-center text-amber-400 font-bold">
                Date
              </p>
              <p className="w-2/12 sm:hidden block text-center text-amber-400 font-bold">
                deliv.
              </p>
              <p className="w-2/12 hidden sm:block text-center text-amber-400 font-bold">
                delivered
              </p>
              <p className="w-4/12 text-center text-amber-400 font-bold">
                Total
              </p>
              <p className="w-1/12 text-center text-amber-400 font-bold"></p>
            </div>
            {data.map((order) => (
              <div
                key={order._id}
                className="flex flex-wrap mb-2 text-[14px] 
                font-bold  w-full bg-gray-100 py-1
                 "
              >
                <div className="w-2/12 text-center">
                  <p>{order.orderItems.length}</p>
                </div>
                <div className="w-3/12 text-center">
                  {order.createdAt.substr(0, 10)}
                </div>

                {order.delivered ? (
                  <div className="w-2/12 text-center">Yes</div>
                ) : (
                  <div className="w-2/12 text-center">No</div>
                )}
                <p className="w-4/12 text-center">Rs.{order.totalPrice}</p>

                <div
                  className="w-1/12  item-center hover:cursor-pointer 
                transition-all hover:scale-105"
                >
                  <Link href={`/admin/order/${order._id} `}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/icons/external-link.png"
                      className="h-6 w-6"
                      alt="view"
                    />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
OrderHistoryScreen.auth = true;
