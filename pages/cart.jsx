import Layout from '../components/layout';
import ItemInCart from '../components/itemInCart';
import { useSelector } from 'react-redux';
import Link from 'next/link';
export default function Cart() {
  const items = useSelector((state) => state.cart.cart);

  const quantity =
    items.length > 1 ? items.reduce((i, c) => (i += c.quantity), 0) : 0;
  const subTotal =
    items.length > 1
      ? items.reduce((i, c) => (i += c.quantity * c.price), 0)
      : 0;
  return (
    <Layout title="Cart">
      <div>
        <Link href={'/'}>
          <h1 className="text-gray-600 cursor-pointer font-bold border w-fit my-2 py-1 px-6 hover:border-black rounded">
            Go to Home
          </h1>
        </Link>
        <h1 className="font-semibold text-gray-700 pb-2 text-lg">
          Shopping cart
        </h1>
        <div className="flex ">
          <div className="flex flex-grow flex-col ">
            <div className="flex pb-2 font-semibold mr-2 border-b-2 border-gray-300 ">
              <h2 className="w-2/5">Item</h2>
              <h2 className="w-1/5">Quantity</h2>
              <h2 className="w-1/5">Price</h2>
              <h2 className="w-1/5">Action</h2>
            </div>
            {items.length > 0 ? (
              items.map((item) => (
                <ItemInCart key={item.name} item={item}></ItemInCart>
              ))
            ) : (
              <div className="w-full text-center mt-5">
                No Items are added to the Cart
              </div>
            )}
          </div>
          <div className="flex flex-grow-0 flex-col w-fit gap-4 rounded border p-4">
            <div className="flex text-lg">
              Subtotal ( {quantity} ) :
              <span className="tex-lg font-bold pl-1 "> $ {subTotal}</span>
            </div>
            <button className="bg-amber-400 py-1 px-2 rounded hover:bg-amber-500 active:bg-amber-600">
              Check Out
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
