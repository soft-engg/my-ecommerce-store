import Product from '../../../models/prodcut';
import db from '../../../utils/db';

const handler = async (req, res) => {
  const data = req.body;
  await db.connect();
  const response = await Product.updateOne(
    { slug: data.slug },
    {
      $set: {
        name: data.name,
        category: data.category,
        price: data.price,
        brand: data.brand,
        countInStock: data.countInStock,
        size: data.size,
        color: data.color,
      },
    },
    (err) => {
      if (err) {
        res.status(400).send('error');
      }
    }
  ).clone();
  if (response.modifiedCount === 1)
    res.status(200).send('Updated Successfully');
  if (response.matchedCount === 0)
    res.status(400).send('No matched record in DB');
  if (response.acknowledged === false)
    res.status(400).send('Error updating the record');
  await db.disconnect();
};
export default handler;
