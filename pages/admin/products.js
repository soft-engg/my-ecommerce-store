import Link from 'next/link';
import React from 'react';
import AdminLayout from '../../components/adminLayout';
import Product from '../../models/prodcut';
import db from '../../utils/db';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import storage from '../../utils/firebase';
import { deleteObject, ref } from 'firebase/storage';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useRouter } from 'next/router';
export default function AllProducts({ products }) {
  const router = useRouter();
  let imageDeleteError = false;
  // function to delete one image
  async function deleteImage(slug, i) {
    const storageRef = ref(storage, `/products/${slug + i}`);
    await deleteObject(storageRef).catch((error) => {
      toast.error('error Deleting Image', error);
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
        router.replace('/admin/products');
      }
      if (status == 400) {
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
    <AdminLayout title="AllProducts">
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
      <div className="mx-4 sm:mx-0 ">
        <div className="flex justify-between">
          <h1 className="text-lg font-semibold text-blue-500 mb-2">Products</h1>
          <Link href="/admin/addproducts">
            <a className=" primary-button text-black"> Add new Product</a>
          </Link>
        </div>
        {/* div for products table */}
        <div>
          {/* heading div */}
          <div className="flex mt-3 bg-gray-100 p-1">
            <p className="text-blue-500  font-bold w-1/6">Name</p>
            <p className="text-blue-500  text-center font-bold w-1/6">Slug</p>
            <p className="text-blue-500 text-center font-bold w-1/6">price</p>

            <p className="text-blue-500 text-center font-bold w-1/6">Stock</p>
            <p className="text-blue-500 text-center font-bold w-1/6">Color</p>
            <p className="text-blue-500 text-center font-bold w-1/6">size</p>
          </div>
          {products.map((product) => (
            <div key={product.slug}>
              <div className="flex">
                <p className="mx-2   w-1/6">{product.name}</p>
                <p className="mx-2 text-center  w-1/6">{product.slug}</p>
                <p className="mx-2 text-center  w-1/6">{product.price}</p>
                <p className="mx-2 text-center w-1/6">{product.countInStock}</p>
                <div className="flex text-center items-center w-1/6 flex-col">
                  {product.color.map((color, index) => (
                    <p key={color}>
                      {color} {index < product.color.length - 1 ? ' ,' : null}
                    </p>
                  ))}
                </div>
                <div className="flex text-center items-center w-1/6 flex-col">
                  {product.size.map((size, index) => (
                    <p key={size}>
                      {size}
                      {index < product.size.length - 1 ? ' ,' : null}
                    </p>
                  ))}
                </div>
              </div>
              <div className="flex">
                <button
                  onClick={() => deleteHandler(product)}
                  className="border-gray-400 border-2 
                  flex items-center px-2 py-1 rounded hover:bg-gray-200"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt=""
                    src="/icons/delete.png"
                    className="h-5 mr-1"
                  ></img>{' '}
                  Delete
                </button>

                <button
                  className="border-gray-400 border-2 
                  flex items-center px-2 py-1 ml-6 rounded hover:bg-gray-200"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt=""
                    src="/icons/update.png"
                    className="h-5 mr-1"
                  ></img>{' '}
                  update
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}

export async function getServerSideProps() {
  await db.connect();
  const products = await Product.find().lean();
  await db.disconnect();
  return {
    props: {
      products: products.map((product) => db.convertDocToObj(product)),
    },
  };
}
AllProducts.auth = true;
