import axios from 'axios';
import Link from 'next/link';
import { useState } from 'react';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

function Pagination({ items, toast, router }) {
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate the total number of pages
  const totalPages = Math.ceil(items.length / itemsPerPage);

  // Get the current items to display
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Render page numbers
  const renderPageNumbers = () => {
    const pageNumbers = [];

    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <p
          className={`hover:text-white ${
            currentPage === i ? 'text-blue-200' : 'text-amber-400'
          } cursor-pointer text-lg`}
          key={i}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </p>
      );
    }

    return pageNumbers;
  };
  // rerunning the getserversideprops
  const refreshData = () => {
    router.replace(router.asPath);
  };
  // change confirm status
  async function changeConfirmStatus(state, id) {
    const { status, data } = await toast.promise(
      axios.put('/api/admin/updateconfirm', { state: state, id }),
      { pending: 'changing confirm status of order...' }
    );
    if (status == 200) {
      toast.success(data);
      refreshData();
    }
    if (status === 400) toast.error(data);
  }
  // change delivered status
  async function changeDeliveredStatus(state, id) {
    const { status, data } = await toast.promise(
      axios.put('/api/admin/updatedeliver', { state: state, id }),
      { pending: 'changing Delivered status of order...' }
    );
    if (status == 200) {
      toast.success(data);
      refreshData();
    }
    if (status === 400) toast.error(data);
  }
  async function changePaidStatus(state, id) {
    const { status, data } = await toast.promise(
      axios.put('/api/admin/updatepaid', { state: state, id }),
      { pending: 'changing Paid status of order...' }
    );
    if (status == 200) {
      toast.success(data);
      refreshData();
    }
    if (status === 400) toast.error(data);
  }
  const deleteHandler = async (product) => {
    confirmAlert({
      title: 'Confirm to Delete',
      message: `Are you sure you want to delete ${product.name} ?`,
      buttons: [
        {
          label: 'confirm delete',
          onClick: async () => {
            await toast.promise(deleteConfirmed(product), {
              pending: 'Deleting product Information',
              error: 'unable to delete the record',
            });
          },
        },
        {
          label: 'No',
          onClick: () => {},
        },
      ],
    });
  };
  // confirmed the image delete now deleting data here
  const deleteConfirmed = async (product) => {
    const { status, data } = await axios.delete(
      `/api/admin/deleteorder/${product._id}`
    );
    if (status == 204) {
      toast.success('record deleted successfuly!!');
      router.replace('/admin/orders');
    }
    if (status == 300) {
      toast.error(data);
    }
  };
  return (
    <div className="">
      {/* Render current items */}
      {/* div for all orders */}
      <div id="item-container mb-2 border-2 border-amber-400 p-2-2">
        {currentItems.map((order, index) => (
          // div for one order
          <div
            key={index}
            className="grid grid-cols-2 md:grid-cols-4 gap-2 text-center
             bg-gray-700 p-4 rounded-lg
             mb-2 text-white"
          >
            <div className=" text-center col-span-2 md:col-span-1 ">
              <h2 className="text-amber-400 font-bold">Order Id</h2>
              <Link href={`/admin/order/${order._id}`}>
                <a
                  className="text-blue-200 
                hover:text-white active:text-amber-400 font-semibold"
                >
                  {order._id}
                </a>
              </Link>
            </div>
            <div>
              <h2 className="text-amber-400 font-bold">Items</h2>
              <p>{order.orderItems.length}</p>
            </div>
            {/* confirm button */}
            <div>
              <h2 className="text-amber-400 font-bold">Confirmed</h2>
              <button
                onClick={async () => {
                  await changeConfirmStatus(!order.isConfirmed, order._id);
                }}
                className={`bg-white px-2 rounded font-bold w-12 hover-gray-400 active-gray-500 ${
                  order.isConfirmed ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {order.isConfirmed ? 'yes' : 'No'}
              </button>
            </div>
            <div>
              <h2 className="text-amber-400 font-bold">Paid</h2>
              <button
                onClick={async () => {
                  await changePaidStatus(!order.isPaid, order._id);
                }}
                className={`bg-white px-2 rounded font-bold w-12 hover-gray-400 active-gray-500 ${
                  order.isPaid ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {order.isPaid ? 'yes' : 'no'}
              </button>
            </div>
            {/* deliver button */}
            <div>
              <h2 className="text-amber-400 font-bold">Delivered</h2>
              <button
                onClick={async () => {
                  await changeDeliveredStatus(!order.isDelivered, order._id);
                }}
                className={`bg-white px-2 rounded font-bold w-12 hover-gray-400 active-gray-500 ${
                  order.isDelivered ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {order.isDelivered ? 'yes' : 'no'}
              </button>
            </div>
            <div>
              <h2 className="text-amber-400 font-bold">Dated</h2>
              <p>{order.createdAt.substr(3, 13)}</p>
            </div>
            <div>
              <h2 className="text-amber-400 font-bold">Delivery</h2>
              <p>{order.shippingPrice}</p>
            </div>
            <div>
              <h2 className="text-amber-400 font-bold">Total</h2>
              <p>{order.totalPrice}</p>
            </div>
            <div className="col-span-2 md:col-span-4 justify-center md:justify-start flex mt-1 mx-2">
              {/* delete button */}
              <button
                onClick={() => deleteHandler(order)}
                className="border-gray-300 border-2 bg-black text-white rounded-lg
                  flex items-center px-3 mr-2 py-2 hover:bg-gray-700 transition-all"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt=""
                  src="/icons/bin.png"
                  className="h-5 mr-1"
                ></img>{' '}
                Delete
              </button>
              {/* update order */}
              <Link href={`/admin/order/${order._id}`}>
                <button
                  className="border-gray-300 border-2 bg-black text-white rounded-lg
                    flex items-center px-3 py-2 hover:bg-gray-700 transition-all"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt=""
                    src="/icons/update.png"
                    className="h-5 mr-1"
                  ></img>{' '}
                  update
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Render pagination */}
      <div
        id="pagination"
        className="flex  text-amber-400 gap-2  justify-center "
      >
        <span className="text-xl text-white">Pages #</span>{' '}
        {renderPageNumbers()}
      </div>
    </div>
  );
}

export default Pagination;
