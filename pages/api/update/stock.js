import Product from '../../../models/prodcut';
import db from '../../../utils/db';

const handler = async (req, res) => {
  await db.connect();
  await req.body.orderItems.forEach(async (item) => {
    const product = await Product.findOne({ _id: item._id });
    let newQuantity;
    if (req.body.order) newQuantity = product.countInStock - item.quantity;
    else newQuantity = product.countInStock + item.quantity;
    await Product.updateOne(
      { id: Product._id },
      { $set: { countInStock: newQuantity } },
      (err) => {
        if (err) {
          res.status(400).send('error');
        } else res.status(200).send('sent');
      }
    ).clone();
  });

  await db.disconnect();
};
export default handler;
