import axios from 'axios';
import Link from 'next/link';
import { useState } from 'react';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import storage from '../utils/firebase';
import { deleteObject, ref } from 'firebase/storage';
import { getError } from '../utils/getError';

function Pagination({ items, toast, router }) {
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  let imageDeleteError = false;
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
  // function to delete one image
  async function deleteImage(slug, i) {
    const storageRef = ref(storage, `/products/${slug + i}`);
    await deleteObject(storageRef).catch((error) => {
      toast.error('error Deleting Image', getError(error));
      imageDeleteError = true;
    });
  }
  // confirmed the image delete now deleting data here
  const deleteConfirmed = async (product) => {
    for (let i = 0; i < product.image.length; i++) {
      await deleteImage(product.slug, i);
    }
    if (!imageDeleteError) {
      const { status, data } = await axios.delete(
        `/api/products/delete/${product._id}`
      );
      if (status == 204) {
        toast.success('record deleted successfuly!!');
        refreshData();
      }
      if (status == 300) {
        toast.error(data);
      }
    }
  };
  // function to confirm delete in advance
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

  return (
    <div className="">
      {/* Render current items */}
      {/* div for all orders */}
      <div id="item-container mb-2 border-2 border-amber-400 p-2-2">
        {currentItems.map((product, index) => (
          <div
            key={index}
            className="shadow-lg  font-bold
         bg-gray-700 text-white rounded-lg  py-3 mb-2 text-sm"
          >
            <div className="grid mt-4 grid-cols-4 grid-flow-row">
              <div className="text-center">
                <p className="text-amber-300 bg-black/80 mb-1 font-semibold ">
                  Name
                </p>
                <p> {product.name}</p>
              </div>
              <div className="text-center">
                <p className="text-amber-300 bg-black/80 mb-1 font-semibold ">
                  Slug
                </p>
                {product.slug}
              </div>
              <div className="text-center">
                <p className="text-amber-300 bg-black/80 mb-1 font-semibold ">
                  Price
                </p>
                {product.price}
              </div>
              <div className="text-center">
                <p className="text-amber-300 bg-black/80 mb-1 font-semibold text-center ">
                  Stock
                </p>
                {product.countInStock}
              </div>
              {/* div for colors */}
              <div>
                <p className="text-amber-300 bg-black/80 mb-1 font-semibold text-center ">
                  Color
                </p>
                <div className="flex text-center justify-center flex-wrap">
                  {product.color.map((color, index) => (
                    <p key={color}>
                      {color} {index < product.color.length - 1 ? ' ,' : null}
                    </p>
                  ))}
                </div>
              </div>
              {/* div for sizes */}
              <div>
                <p className="text-amber-300 bg-black/80 mb-1 font-semibold text-center ">
                  Size
                </p>
                <div className="flex text-center justify-center flex-wrap">
                  {product.size.map((size, index) => (
                    <div key={size} className="flex flex-wrap">
                      {size} {index < product.size.length - 1 ? ' ,' : null}
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-center col-span-2">
                <p className="text-amber-300 bg-black/80 mb-1 font-semibold ">
                  Created At
                </p>
                <p> {product.createdAt.slice(0, 16)}</p>
              </div>
            </div>
            {/* div for buttons */}
            <div className="flex mt-1 mx-2">
              <button
                onClick={() => deleteHandler(product)}
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
              <Link href={`/admin/updateproduct/${product.slug}`}>
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
