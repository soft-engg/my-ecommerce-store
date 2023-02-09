import Product from '../../../../models/prodcut';
import db from '../../../../utils/db';

const handler = async (req, res) => {
  console.log('getting this id', req.query.id);
  try {
    await db.connect();
    const { acknowledged } = await Product.deleteOne({ _id: req.query.id });
    if (acknowledged) {
      res.status(204);
      res.send('Delete Successfully!!');
    }
    if (!acknowledged) {
      res.status(400).send('Record not deleted');
    }
    await db.disconnect();
  } catch (error) {
    res.status(400).send('error occured in server');
  }
};
export default handler;
