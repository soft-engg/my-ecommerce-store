import Order from '../../../../models/Order';
import db from '../../../../utils/db';

const handler = async (req, res) => {
  if (req.query.search.match(/^[0-9a-fA-F]{24}$/)) {
    await db.connect();
    const order = await Order.findById({
      _id: req.query.search,
    });
    await db.disconnect();
    if (order) res.send(order).status(200);
    else res.status(204).send('No Order Found');
  } else res.status(205).send('Invalid Id');
};
export default handler;
