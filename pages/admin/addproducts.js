import { useSession } from 'next-auth/react';
import Link from 'next/link';
import React, { useState } from 'react';
import Layout from '../../components/layout';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { getError } from '../../utils/getError';
import storage from '../../utils/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
export default function ProductsScreen() {
  const session = useSession();
  const { user } = session.data;
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState(1);
  const [price, setPrice] = useState(1);
  const [description, setDescription] = useState('');
  const [imagesUrl, setImagesUrl] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [images, setImages] = useState([]);
  const [colorField, setColorField] = useState('');
  const [sizeField, setSizeField] = useState('');

  const [imageError, setImageError] = useState(false);
  // selecting file
  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImages((state) => [...state, e.target.files[0]]);
    }
  };

  //function to remove images selected for upload
  function removeSelectedImage(givenImage) {
    setImages((state) =>
      state.filter((image) => {
        return image.name !== givenImage.name;
      })
    );
  }
  //function to remove selected colors
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
    if (slug !== '') {
      try {
        var { data } = await axios.get(`/api/products/slug/${slug}`);
      } catch (error) {
        toast.error('network error retry ' + getError(error));
        return false;
      }
    }
    if (name === '') {
      toast.error('Please give a Name..');
      return false;
    } else if (slug === '') {
      toast.error('please Give a slug');
      return false;
    } else if (data) {
      toast.error('Error Slug Already exists. Try different Slug');
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
    } else if (images.length === 0) {
      toast.error('please add the images(s) of product');
      return false;
    } else if (colors.length === 0) {
      toast.error('please add the color(s) of product');
      return false;
    } else if (sizes.length === 0) {
      toast.error('please Enter the size(s) of product');
      return false;
    } else return true;
  };

  async function handleUpload(image, index) {
    const storageRef = ref(storage, `/products/${slug + index}`);
    // waiting the uploadToComplete
    await uploadBytesResumable(storageRef, image).then(
      () => {
        // do noting
      },
      (error) => {
        toast.error('uploading images error ', error);
        setImageError(true);
      }
    );
    // getting the downloadUrl
    const downloadURL = await getDownloadURL(storageRef);
    console.log('generated urls are ', downloadURL);
    setImagesUrl((state) => {
      return state.concat(downloadURL);
    });
  }

  // submitHandler function
  async function submitHandler(e) {
    e.preventDefault();
    const noError = await toast.promise(validator(), {
      pending: 'Verifiying information',
      error: 'error occured',
    });

    if (noError) {
      setImagesUrl([]);
      await toast.promise(
        Promise.all(
          images.map(async (image, index) => {
            await handleUpload(image, index);
          })
        ),
        { pending: 'uploading Images...' }
      );

      if (imageError) {
        toast.error('image uploading failed try Again');
        setImageError(false);
      } else {
        const { data, status } = await toast.promise(
          axios.post('/api/products/add/product', {
            name: name,
            slug: slug,
            category: category,
            image: imagesUrl,
            price: price,
            brand: brand,
            countInStock: stock,
            description: description,
            size: sizes,
            color: colors,
          }),
          { pending: 'Saving Product please wait...' }
        );
        if (status === 200) toast.success(data);
        if (status === 400) toast.error(data);
      }
    }
  }

  if (user?.isAdmin)
    return (
      <div className="w-full my-8   flex justify-center">
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
          className="mx-3 grow max-w-md mx-6 sm:mx-0 p-4 shadow-md shadow-amber-400 rounded-lg "
          onSubmit={(e) => {
            submitHandler(e);
          }}
        >
          <h1 className="text-lg text-blue-500 font-semibold">
            Add New Product
          </h1>
          {/* name */}
          <label
            for="name"
            className="block mb-2  mt-2 font-medium text-blue-500 dark:text-gray-300"
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
          {/* Slug */}
          <label
            for="Slug"
            className="block mb-2  mt-2 font-medium text-blue-500 dark:text-gray-300"
          >
            Product Slug
          </label>
          <input
            name="Slug"
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
            }}
            className="input-style"
          ></input>
          {/* Brand */}
          <label
            for="Brand"
            className="block mb-2  mt-2 font-medium text-blue-500 dark:text-gray-300"
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
            for="Category"
            className="block mb-2  mt-2 font-medium text-blue-500 dark:text-gray-300"
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
            for="Stock"
            className="block mb-2  mt-2 font-medium text-blue-500 dark:text-gray-300"
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
            for="Stock"
            className="block mb-2  mt-2 font-medium text-blue-500 dark:text-gray-300"
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
            for="Description"
            className="block mb-2   mt-2 font-medium text-blue-500 dark:text-gray-300"
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
          {/* Image */}
          <label
            for="Product Image"
            className="block mb-2  mt-2 font-medium text-blue-500 dark:text-gray-300"
          >
            Product Image(s)
          </label>
          <div className="">
            <div className="flex">
              <input type="file" onChange={handleChange} accept="image/*" />
            </div>
            <div className="flex">
              {images.length === 0 ? (
                <p className="py-1 text-red-500">no images selected</p>
              ) : (
                <div>
                  <p> Selected Product Images are </p>
                  <div className="flex  flex-wrap">
                    {images.map((image, index) => (
                      <div key={index} className="p-1">
                        <img
                          className="w-16  h-16"
                          key={index}
                          src={URL.createObjectURL(image)}
                          alt={image.name}
                        ></img>
                        <button
                          onClick={() => removeSelectedImage(image)}
                          type="button"
                          className="text-sm text-center 
                        bg-amber-200 w-full
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
          </div>
          {/* Color */}
          <label
            for="Product Color"
            className="block mb-2  mt-2 font-medium text-blue-500 dark:text-gray-300"
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
                <p> Selected colors are </p>
                <div className="flex  flex-wrap">
                  {colors.map((color, index) => (
                    <div key={index} className="p-1">
                      <p>{color}</p>
                      <button
                        onClick={() => removeSelectedColor(color)}
                        type="button"
                        className="text-sm text-center 
                        bg-amber-200 w-full px-1
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
            className="block mb-2  mt-2 font-medium text-blue-500 dark:text-gray-300"
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
                <p className="mt-1"> Selected Sizes are </p>
                <div className="flex  flex-wrap">
                  {sizes.map((size, index) => (
                    <div key={index} className="p-1">
                      <p>{size}</p>
                      <button
                        onClick={() => removeSelectedSize(size)}
                        type="button"
                        className="text-sm text-center 
                        bg-amber-200 w-full px-1
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
            Add Product
          </button>
        </form>
      </div>
    );
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
ProductsScreen.auth = true;
