import Layout from '../components/layout';
import ItemInCart from '../components/ItemInCart';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function Cart() {
  const itemsInCart = useSelector((state) => state.cart.cartItems);

  const [quantity, setQuantity] = useState(0);
  const [subTotal, setSubtotal] = useState(0);
  const router = useRouter();
  useEffect(() => {
    setQuantity(itemsInCart.reduce((i, c) => (i += c.quantity), 0));
    setSubtotal(itemsInCart.reduce((i, c) => (i += c.quantity * c.price), 0));
  }, [itemsInCart]);

  function checkoutHandler() {
    if (quantity === 0) toast.error('Please add items in cart ');
    else router.push('/login?redirect=/shipping');
  }

  return (
    <Layout title="Cart ">
      <ToastContainer
        position="bottom-center"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <main>
        <div className="flex flex-col">
          <div className="default-link">
            <Link href="/">
              <a>Back to products</a>
            </Link>
          </div>

          <h1 className="font-semibold text-black pb-2 mx-3 text-lg">
            Shopping cart
          </h1>
        </div>
        {/* this is div for cart and  subtotal div */}
        <div
          className="flex flex-col 
         justify-center items-center sm:flex-row w-full"
        >
          {/* this is div for the item table*/}
          <div className="flex flex-grow sm:w-3/4 flex-shrink-0 flex-col w-full">
            <div
              className="flex pb-2 font-semibold  border-b-2
             border-gray-300 "
            >
              <h2 className="w-4/12 text-center ">Item(s)</h2>
              <h2 className="w-3/12 text-center">Qty.</h2>
              <h2 className="w-3/12 text-center">Price</h2>
              <h2 className="w-2/12 text-center">Action</h2>
            </div>
            {itemsInCart.length > 0 ? (
              itemsInCart.map((item) => (
                <ItemInCart
                  key={item.name + item.color + item.size}
                  item={item}
                  toast={toast}
                />
              ))
            ) : (
              <div className="w-full text-center mt-5">
                cart is empty
                <span className="font-bold">
                  <Link href="/">Go shopping</Link>
                </span>
              </div>
            )}
          </div>
          {/* this is subtotal div */}
          <div
            className="flex self-center sm:self-start justify-center
           sm:w-1/4 mx-2  shadow-lg  max-h-fit items-center sm:ml-3"
          >
            <div
              className="flex h-fit mb-2 flex-grow-0 w-80 flex-col w-full gap-4 
            rounded border p-4"
            >
              <div className="flex text-lg w-full">
                Subtotal ( {quantity} ) :
                <span className="tex-lg  pl-1 ">
                  {' '}
                  Rs <span className="font-bold">{subTotal}</span>{' '}
                </span>
              </div>
              <button
                onClick={checkoutHandler}
                className="bg-amber-400 py-1 px-2 w-50
                rounded hover:bg-amber-500 active:bg-amber-600"
              >
                Check Out
              </button>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
export default dynamic(() => Promise.resolve(Cart), { ssr: false });
