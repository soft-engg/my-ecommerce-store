import Layout from '../components/layout';
import data from '../utils/data';
import ProductItem from '../components/productItem';
import { useSelector } from 'react-redux';
export default function Home() {
  const cartItems = useSelector((state) => state.cart.cart);
  console.log(cartItems);
  return (
    <Layout title={'Home'}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-col-4">
        {data.products.map((product) => (
          <ProductItem product={product} key={product.slug}></ProductItem>
        ))}
      </div>
    </Layout>
  );
}
