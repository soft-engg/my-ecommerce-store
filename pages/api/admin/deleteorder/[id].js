import Order from '../../../../models/Order';
import db from '../../../../utils/db';
import { getError } from '../../../../utils/getError';

const handler = async (req, res) => {
  console.log('getting this id', req.query.id);
  try {
    await db.connect();
    const { acknowledged } = await Order.deleteOne({ _id: req.query.id });
    if (acknowledged) {
      res.status(204);
      res.send('Order Deleted Successfully!!');
    }
    if (!acknowledged) {
      res.status(400).send('Order not deleted');
    }
    await db.disconnect();
  } catch (error) {
    res.status(400).send(getError());
  }
};
export default handler;
