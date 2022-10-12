import Layout from '../components/layout';
import ItemInCart from '../components/ItemInCart';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
function Cart() {
  const itemsInCart = useSelector((state) => state.cart.cart);
  const [quantity, setQuantity] = useState(0);
  const [subTotal, setSubtotal] = useState(0);
  const router = useRouter();
  useEffect(() => {
    setQuantity(itemsInCart.reduce((i, c) => (i += c.quantity), 0));
    setSubtotal(itemsInCart.reduce((i, c) => (i += c.quantity * c.price), 0));
  }, [itemsInCart]);

  function checkoutHandler() {
    router.push('/login?redirect=/shipping');
  }

  return (
    <Layout title="Cart ">
      <main>
        <div className="flex flex-col pl-1">
          <Link href={'/'}>
            <div className="p-1 font-bold rounded hover:text-gray-500 hover:ring-amber-300 hover:ring-1 mb-2  text-gray-500 border w-fit tracking-tighter  hover:text-blue-600 active:text-blue-700">
              <Link href="/"> Back to products</Link>
            </div>
          </Link>
          <h1 className="font-semibold text-gray-700 pb-2 text-lg">
            Shopping cart
          </h1>
        </div>
        {/* this is div for cart and  subtotal div */}
        <div className="flex flex-col itemsInCart-center md:flex-row w-full">
          <div className="flex flex-grow flex-col w-full p-1">
            <div className="flex pb-2 font-semibold mr-2 border-b-2 border-gray-300 ">
              <h2 className="w-2/5 ">Item</h2>
              <h2 className="w-1/5 text-center">Quantity</h2>
              <h2 className="w-1/5 text-center">Price</h2>
              <h2 className="w-1/5 text-center">Action</h2>
            </div>
            {itemsInCart.length > 0 ? (
              itemsInCart.map((item) => (
                <ItemInCart key={item.name} item={item}></ItemInCart>
              ))
            ) : (
              <div className="w-full text-center mt-5">
                No Items are added to the Cart
              </div>
            )}
          </div>
          {/* this is subtotal div */}
          <div className="flex h-fit mb-2 flex-grow-0 w-80 flex-col w-fit gap-4 rounded border p-4">
            <div className="flex text-lg">
              Subtotal ( {quantity} ) :
              <span className="tex-lg font-bold pl-1 "> $ {subTotal}</span>
            </div>
            <button
              onClick={checkoutHandler}
              className="bg-amber-400 py-1 px-2 rounded hover:bg-amber-500 active:bg-amber-600"
            >
              Check Out
            </button>
          </div>
        </div>
      </main>
    </Layout>
  );
}
export default dynamic(() => Promise.resolve(Cart), { ssr: false });
