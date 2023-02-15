import Product from '../../../models/prodcut';
import db from '../../../utils/db';

const handler = async (req, res) => {
  console.log(req.body);
  await db.connect();
  const orderItems = req.body.orderItems;
  for (let i = 0; i < orderItems.length; i++) {
    const product = await Product.findOne({ _id: orderItems[i]._id });
    console.log('product', product);
    let newQuantity;
    newQuantity = product.countInStock - orderItems[i].quantity;
    await Product.updateOne(
      { id: Product._id },
      { $set: { countInStock: newQuantity } },
      (err) => {
        if (err) {
          res.status(400).send('error');
        } else res.status(200).send('sent');
      }
    ).clone();
  }

  await db.disconnect();
};
export default handler;
