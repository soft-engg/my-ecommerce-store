import Layout from '../../components/layout';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';
import ProductItem from '../../components/ProductItem';
import Product from '../../models/prodcut';
import db from '../../utils/db';

export default function CategoryScreen({ products }) {
  const router = useRouter();
  const { category } = router.query;

  return (
    <Layout title={category}>
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
        theme="dark"
      />
      {/* heading for type */}
      <h1 className="text-white mb-2 font-serif text-lg sm:text-xl">
        Category:
        <span
          className="text-amber-400 mx-2
         tracking-wide font-serif  font-bold "
        >
          {category}
        </span>
      </h1>
      <div className="flex justify-center">
        {/* this is div for products */}
        <div
          className="grid grid-cols-1 sm:grid-col-4 md:gap-4 md:grid-cols-4 
        lg:grid-col-4"
        >
          {products.map((product) => (
            <ProductItem
              product={product}
              toast={toast}
              key={product.slug + product.color + product.size}
            ></ProductItem>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const { params } = context;
  const { category } = params;
  await db.connect();
  const products = await Product.find({ category: category }).lean();
  await db.disconnect();
  return {
    props: {
      products: products.map((product) => db.convertDocToObj(product)),
    },
  };
}
