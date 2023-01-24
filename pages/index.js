import Layout from '../components/layout';
import data from '../utils/data';
import ProductItem from '../components/ProductItem';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default function Home() {
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
        {data.products.map((product) => (
          <ProductItem
            product={product}
            toast={toast}
            key={product.slug}
          ></ProductItem>
        ))}
      </div>
    </Layout>
  );
}
