import axios from 'axios';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Layout from '../components/layout';
import { getError } from '../utils/getError';

export default function OrderHistoryScreen() {
  const session = useSession();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function getData() {
      try {
        const { data } = await axios.get(
          `/api/order/user/${session.data.user._id}`
        );
        setData(data.reverse());
        setLoading(false);
      } catch (error) {
        toast.error(getError(error));
      }
    }
    getData();
  }, [session.data.user]);

  return (
    <Layout title="Order History">
      <h1 className="mx-5  mb-2 text-lg text-amber-400 font-bold">
        Order History
      </h1>
      <div className="mx-5">
        {loading ? (
          <p className="text-white">please wait loading......</p>
        ) : data.length === 0 ? (
          <div>
            <p className="text-red-400">No Order History Available</p>
            <Link href="/">
              <a className="text-amber-400">Go to Shopping</a>
            </Link>
          </div>
        ) : (
          <div className=" bg-gray-500 min-h-[70vh] rounded ">
            <div className="flex mb-1 w-full font-semibold p-1">
              <p className="w-2/12 text-amber-400 font-bold text-center ">
                Items
              </p>
              <p className="w-3/12 text-center text-amber-400 font-bold">
                Date
              </p>
              <p className="w-2/12 text-center text-amber-400 font-bold">
                Shipped
              </p>
              <p className="w-3/12 text-center text-amber-400 font-bold">
                Total
              </p>
              <p className="w-1/12 text-center text-amber-400 font-bold"></p>
            </div>
            {data.map((order) => (
              <div
                key={order._id}
                className="flex flex-wrap mb-2 text-[14px] 
                font-bold  w-full bg-gray-100 p-1
                 "
              >
                <p className="w-2/12 text-center">{order.orderItems.length}</p>
                <p className="w-3/12  text-center">
                  {order.createdAt.substr(0, 10)}
                </p>

                {order.delivered ? (
                  <p className="text-blue-500 w-2/12  text-center">Yes</p>
                ) : (
                  <p className="text-red-500 w-2/12  text-center">No</p>
                )}
                <p className="w-3/12 text-center">Rs.{order.totalPrice}</p>

                <Link href={`order/${order._id} `}>
                  <a className="w-1/12  text-center ">view</a>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
OrderHistoryScreen.auth = true;
