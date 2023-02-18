import User from '../../../../models/users';
import db from '../../../../utils/db';
import { getError } from '../../../../utils/getError';

const handler = async (req, res) => {
  try {
    await db.connect();
    const user = await User.findOne({ email: req.query.email });
    if (user) res.status(201).send('User Already Exist!!!');
    else res.status(200).send('User not exist..');
    await db.disconnect();
  } catch (error) {
    res.status('400').send('Error occured!!!', getError(error));
  }
};
export default handler;
