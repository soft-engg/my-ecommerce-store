import User from '../../../../models/users';
import db from '../../../../utils/db';
import { getError } from '../../../../utils/getError';

const handler = async (req, res) => {
  console.log('getting this id', req.query.id);
  try {
    await db.connect();
    const { acknowledged } = await User.deleteOne({ _id: req.query.id });
    if (acknowledged) {
      res.status(204);
      res.send('User Deleted Successfully!!');
    }
    if (!acknowledged) {
      res.status(400).send('User not deleted!!');
    }
    await db.disconnect();
  } catch (error) {
    res.status(400).send(getError());
  }
};
export default handler;
