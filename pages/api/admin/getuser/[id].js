import User from '../../../../models/users';
import db from '../../../../utils/db';

const handler = async (req, res) => {
  const { id } = req.query;
  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    // Yes, it's a valid ObjectId, proceed with `findById` call.
    await db.connect();
    console.log(req.body);

    const user = await User.findById({ _id: id });
    if (user) res.status(200).json({ name: user.name, email: user?.email });
    else res.status(404).send('user not found');
    await db.disconnect();
  } else res.status(404).send('user not found');
};
export default handler;
