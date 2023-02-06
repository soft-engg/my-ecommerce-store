import Product from '../../../../models/prodcut';
import db from '../../../../utils/db';

const handler = async (req, res) => {
  await db.connect();
  const products = await Product.find({
    name: new RegExp('.*' + req.query.search + '*.', 'gi'),
  });
  await db.disconnect();

  res.send(products);
};
export default handler;
