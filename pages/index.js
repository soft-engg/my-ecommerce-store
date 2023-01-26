import Layout from '../components/layout';
import ProductItem from '../components/ProductItem';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import db from '../utils/db';
import Product from '../models/prodcut';

export default function Home({ products }) {
  return (
    <Layout title={'Home'}>
      <ToastContainer
        position="bottom-center"
        autoClose={500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <div className="grid grid-cols-1 md:gap-4 md:grid-cols-4 lg:grid-col-4">
        {products.map((product) => (
          <ProductItem
            product={product}
            toast={toast}
            key={product.slug + product.color + product.size}
          ></ProductItem>
        ))}
      </div>
    </Layout>
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
