import Product from '../../../../models/prodcut';
import db from '../../../../utils/db';
import { getError } from '../../../../utils/getError';

const handler = async (req, res) => {
  try {
    await db.connect();
    const products = await Product.find({
      name: new RegExp('.*' + req.query.search + '*.', 'gi'),
    });
    await db.disconnect();
    if (products) res.status(200).send(products);
    else res.status(204).send('product not found!!');
  } catch (error) {
    res.status(205).send(getError(error));
  }
};
export default handler;
