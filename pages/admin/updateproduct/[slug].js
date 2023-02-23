import axios from 'axios';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import AdminLayout from '../../../components/adminLayout';
import Layout from '../../../components/layout';
import Product from '../../../models/prodcut';
import db from '../../../utils/db';
import 'react-toastify/dist/ReactToastify.css';
export default function UpdateProductScreen({ product }) {
  const router = useRouter();
  const session = useSession();
  const { user } = session.data;
  const [name, setName] = useState(product.name);
  const slug = product.slug;
  const [brand, setBrand] = useState(product.brand);
  const [category, setCategory] = useState(product.category);
  const [stock, setStock] = useState(product.countInStock);
  const [price, setPrice] = useState(product.price);
  const [description, setDescription] = useState(product.description);
  const [colors, setColors] = useState(product.color);
  const [sizes, setSizes] = useState(product.size);
  const [colorField, setColorField] = useState('');
  const [sizeField, setSizeField] = useState('');
  function removeSelectedColor(givenColor) {
    setColors((state) =>
      state.filter((color) => {
        return color !== givenColor;
      })
    );
  }
  function removeSelectedSize(givenSize) {
    setSizes((state) =>
      state.filter((size) => {
        return size !== givenSize;
      })
    );
  }
  // validator function
  const validator = async () => {
    if (name === '') {
      toast.error('Please give a Name..');
      return false;
    } else if (slug === '') {
      toast.error('please Give a slug');
      return false;
    } else if (brand === '') {
      toast.error('brand is empty');
      return false;
    } else if (category === '') {
      toast.error('please Enter Name of Category..');
      return false;
    } else if (stock < 1) {
      toast.error("Stock Can't be less then 1 ");
      return false;
    } else if (price < 1 || price == '') {
      toast.error("Price Can't be less then 1 ");
      return false;
    } else if (description === '') {
      toast.error('Please give discription of product');
      return false;
    } else if (colors.length === 0) {
      toast.error('please add the color(s) of product');
      return false;
    } else if (sizes.length === 0) {
      toast.error('please Enter the size(s) of product');
      return false;
    } else return true;
  };
  async function submitHandler(e) {
    e.preventDefault();
    const noError = await toast.promise(validator(), {
      pending: 'Verifiying information',
      error: 'error occured',
    });

    if (noError) {
      const { data, status } = await toast.promise(
        axios.put('/api/admin/updateproduct', {
          slug: slug,
          name: name,
          category: category,
          price: price,
          brand: brand,
          countInStock: stock,
          description: description,
          size: sizes,
          color: colors,
        }),
        { pending: 'Saving Product please wait...' }
      );
      if (status === 200) {
        console.log('data is ', data);
        toast.success(data);
        toast.onChange((v) => {
          if (v.status === 'removed') {
            router.replace('/admin/products');
          }
        });
      }
      if (status === 400) toast.error(data + ' Retry');
    }
  }

  if (user?.isAdmin) {
    if (!product)
      return (
        <AdminLayout title="product not found">
          <div>product not found</div>
        </AdminLayout>
      );
    return (
      <AdminLayout title="Add New Product">
        <div className="w-full my-2   flex justify-center">
          <ToastContainer
            position="bottom-center"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={true}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
          <form
            className=" w-full md:w-2/3"
            onSubmit={(e) => {
              submitHandler(e);
            }}
          >
            <h1 className="text-lg text-amber-400 font-semibold">
              Add New Product
            </h1>
            {/* name */}
            <label
              htmlFor="name"
              className="block mb-2  mt-2 font-medium text-amber-400 dark:text-gray-300"
            >
              Product Name
            </label>
            <input
              name="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
              className="input-style"
            ></input>

            {/* Brand */}
            <label
              htmlFor="Brand"
              className="block mb-2  mt-2 font-medium text-amber-400 dark:text-gray-300"
            >
              Product Brand
            </label>
            <input
              name="Brand"
              value={brand}
              onChange={(e) => {
                setBrand(e.target.value);
              }}
              className="input-style"
            ></input>

            {/* category */}
            <label
              htmlFor="Category"
              className="block mb-2  mt-2 font-medium text-amber-400 dark:text-gray-300"
            >
              Product Category
            </label>
            <input
              name="Category"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
              }}
              className="input-style"
            ></input>
            {/* Quantity of Stock */}
            <label
              htmlFor="Stock"
              className="block mb-2  mt-2 font-medium text-amber-400 dark:text-gray-300"
            >
              Quantity of Stock
            </label>
            <input
              name="Stock"
              type="text"
              pattern="[0-9]*"
              value={stock}
              onChange={(e) =>
                setStock((v) => (e.target.validity.valid ? e.target.value : v))
              }
              className="input-style"
            ></input>
            {/* Price */}
            <label
              htmlFor="Stock"
              className="block mb-2  mt-2 font-medium text-amber-400 dark:text-gray-300"
            >
              Product Price
            </label>
            <input
              name="Stock"
              type="text"
              pattern="[0-9]*"
              value={price}
              onChange={(e) =>
                setPrice((v) => (e.target.validity.valid ? e.target.value : v))
              }
              className="input-style"
            ></input>
            {/* Description */}
            <label
              htmlFor="Description"
              className="block mb-2   mt-2 font-medium text-amber-400 dark:text-gray-300"
            >
              Product Description
            </label>
            <textarea
              name="Description"
              type="textarea"
              value={description}
              placeholder="Enter the Product description"
              onChange={(e) => setDescription(e.target.value)}
              className="input-style "
            ></textarea>

            {/* Color */}
            <label
              htmlFor="Product Color"
              className="block mb-2  mt-2 font-medium text-amber-400 dark:text-gray-300"
            >
              Product Color(s)
            </label>
            <div>
              <div className="flex">
                <input
                  name="Product Color"
                  value={colorField}
                  onChange={(e) => setColorField(e.target.value)}
                  className="input-style"
                  placeholder="enter text color and press Add Color"
                ></input>
                <button
                  type="button"
                  className="w-fit ml-2 primary-button  text-sm"
                  onClick={(e) => {
                    console.log(e.target.value);
                    if (colorField !== '') {
                      setColors((state) => [...state, colorField]);
                      setColorField('');
                    }
                  }}
                >
                  Add Color
                </button>
              </div>
              {colors.length === 0 ? (
                <p className="py-1 text-red-500">no color selected</p>
              ) : (
                <div>
                  <p className="py-1 text-white"> Selected colors are </p>
                  <div className="flex  flex-wrap">
                    {colors.map((color, index) => (
                      <div key={index} className="p-1 text-white text-lg">
                        <p>{color}</p>
                        <button
                          onClick={() => removeSelectedColor(color)}
                          type="button"
                          className="text-sm text-center 
                      bg-amber-200 w-full px-1 text-black
                       hover:bg-amber-300 acitive:bg-amber-400"
                        >
                          remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Size */}
            <label
              htmlFor="Product Size"
              className="block mb-2  mt-2 font-medium text-amber-400 dark:text-gray-300"
            >
              Product Size
            </label>
            <div>
              <div className="flex">
                <input
                  name="Product Size"
                  value={sizeField}
                  onChange={(e) => {
                    setSizeField(e.target.value);
                  }}
                  placeholder="enter prodcuts sizes and press Add Size"
                  className="input-style"
                ></input>
                <button
                  type="button"
                  className="w-fit ml-2 primary-button  text-sm"
                  onClick={(e) => {
                    console.log(e.target.value);
                    if (sizeField !== '') {
                      setSizes((state) => [...state, sizeField]);
                      setSizeField('');
                    }
                  }}
                >
                  Add Size
                </button>
              </div>
              {sizes.length === 0 ? (
                <p className="py-1 text-red-500">no Size selected</p>
              ) : (
                <div>
                  <p className="mt-1 text-white"> Selected Sizes are </p>
                  <div className="flex  flex-wrap">
                    {sizes.map((size, index) => (
                      <div key={index} className="p-1 text-white text-lg">
                        <p>{size}</p>
                        <button
                          onClick={() => removeSelectedSize(size)}
                          type="button"
                          className="text-sm text-center 
                      bg-amber-200 w-full px-1 text-black
                       hover:bg-amber-300 acitive:bg-amber-400"
                        >
                          remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {/* Button */}
            <button type="submit" className="primary-button mt-4">
              update
            </button>
          </form>
        </div>
      </AdminLayout>
    );
  } else
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
UpdateProductScreen.auth = true;
export async function getServerSideProps(context) {
  const { params } = context;
  const { slug } = params;
  await db.connect();
  const product = await Product.findOne({ slug }).lean();
  await db.disconnect();
  return {
    props: {
      product: product ? db.convertDocToObj(product) : null,
    },
  };
}
