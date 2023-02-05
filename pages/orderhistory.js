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
  }, []);

  return (
    <Layout title="Order History">
      <h1 className="mx-5  mb-2 text-lg text-blue-500 font-semibold">
        Order History
      </h1>
      <div className="mx-5">
        {loading ? (
          <p>please wait loading......</p>
        ) : data.length === 0 ? (
          <div>
            <p className="text-red-400">No Order History Available</p>
            <Link href="/">
              <a>Go to Shopping</a>
            </Link>
          </div>
        ) : (
          <div className="text-sm">
            <div className="flex mb-2 w-full font-semibold p-1 rounded ">
              <p className="w-2/12 ">Items</p>
              <p className="w-3/12 text-center">Date</p>
              <p className="w-3/12 text-center">Shipped</p>
              <p className="w-3/12 text-center">Total</p>
              <p className="w-1/12 text-center"></p>
            </div>
            {data.map((order) => (
              <div
                key={order._id}
                className="flex mb-2 w-full bg-gray-100 p-1 rounded"
              >
                <p className="w-2/12">{order.orderItems.length}</p>
                <p className="w-3/12  text-center">
                  {order.createdAt.substr(0, 10)}
                </p>

                {order.delivered ? (
                  <p className="text-blue-500 w-3/12  text-center">Yes</p>
                ) : (
                  <p className="text-red-500 w-3/12  text-center">No</p>
                )}
                <p className="w-3/12 text-center">Rs.{order.totalPrice}</p>

                <Link href={`order/${order._id} `}>
                  <a className="w-1/12  text-center pl-1">view</a>
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
