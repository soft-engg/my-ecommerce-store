import Order from '../../../models/Order';
import db from '../../../utils/db';

const handler = async (req, res) => {
  const data = req.body;
  const { state, id } = data;

  await db.connect();
  const response = await Order.updateOne(
    { _id: id },
    {
      $set: {
        isPaid: state,
      },
    },
    (err) => {
      if (err) {
        res.status(400).send('error');
      }
    }
  ).clone();
  if (response.matchedCount === 1)
    res.status(200).send('Paid state Updated Successfully');
  if (response.matchedCount === 0)
    res.status(400).send('No matched record in DB');
  if (response.acknowledged === false)
    res.status(400).send('Error updating the record');
  await db.disconnect();
};
export default handler;
