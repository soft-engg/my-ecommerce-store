import Product from '../../../../models/prodcut';
import db from '../../../../utils/db';
import { getError } from '../../../../utils/getError';

const handler = async (req, res) => {
  try {
    await db.connect();
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(200).send('Product Added successfully..');
    await db.disconnect();
  } catch (error) {
    res.status(400).send('error saving product ', getError(error));
  }
};
export default handler;
