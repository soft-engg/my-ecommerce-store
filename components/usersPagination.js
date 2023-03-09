import axios from 'axios';
import Link from 'next/link';

import { useState } from 'react';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

function Pagination({ users, toast, router }) {
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate the total number of pages
  const totalPages = Math.ceil(users.length / itemsPerPage);

  // Get the current items to display
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = users.slice(indexOfFirstItem, indexOfLastItem);

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

  const deleteHandler = async (user) => {
    confirmAlert({
      title: 'Confirm to Delete',
      message: `Are you sure you want to delete ${user.name} ?`,
      buttons: [
        {
          label: 'confirm delete',
          onClick: async () => {
            await toast.promise(deleteConfirmed(user), {
              pending: 'Deleting User Account...',
              error: 'Unable to delete the Account...',
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
  const deleteConfirmed = async (user) => {
    const { status, data } = await axios.delete(
      `/api/admin/deleteuser/${user._id}`
    );
    if (status == 204) {
      toast.success('user deleted successfuly!!');
      router.replace('/admin/users');
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
        {currentItems.map((user, index) => (
          // div for one order
          <div key={index} className="bg-gray-600 mb-2 px-2 py-3 rounded-lg  ">
            <div
              key={index}
              className=" text-center grid grid-flow-row md:grid-cols-4  "
            >
              <div>
                <h2 className="text-amber-400 font-bold bg-black text-start pl-2 ">
                  Name
                </h2>
                <h3 className="text-white font-semibold text-start pl-2">
                  {user.name}
                </h3>
              </div>
              <div className="col-span-2 md:col-span-2 lg:col-span-1">
                <h2 className="text-amber-400  font-bold bg-black">Email</h2>
                <h3 className="text-white font-semibold">{user?.email}</h3>
              </div>
              <div>
                <h2 className="text-amber-400 font-bold bg-black">Is Admin</h2>
                <h3 className="text-white font-semibold">
                  {user.isAdmin ? 'Yes' : 'No'}
                </h3>
              </div>
              <div>
                <h2 className="text-amber-400 font-bold  bg-black">orders</h2>
                <Link href={`/admin/userorders/${user._id} `}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/icons/external-link.png"
                    className="h-6 w-6"
                    alt="view"
                  />
                </Link>
              </div>
            </div>
            {/* div for delete and update button */}
            <div
              className="col-span-2 md:col-span-4 justify-center
             md:justify-start flex mt-1 "
            >
              {/* delete button */}
              <button
                onClick={() => deleteHandler(user)}
                className="border-gray-300 border-2 bg-transparent
                 text-white rounded-lg
                 flex items-center px-2 mr-2 py-1 mt-1 hover:bg-gray-800
                  transition-all"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img alt="" src="/icons/bin.png" className="h-5 "></img> Delete
              </button>
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
