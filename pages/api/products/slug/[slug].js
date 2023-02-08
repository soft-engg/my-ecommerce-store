import Product from '../../../../models/prodcut';
import db from '../../../../utils/db';

const handler = async (req, res) => {
  await db.connect();
  const product = await Product.findOne({ slug: req.query.slug.trim() });
  await db.disconnect();
  if (product) res.send(true);
  else res.send(false);
};
export default handler;
