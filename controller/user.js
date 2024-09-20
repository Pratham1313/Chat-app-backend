import User from "../model/usermodel.js";

export default async function getUser(req, res) {
  const logged_user = req.user._id;
  const alluser = await User.find({ _id: { $ne: logged_user } });
  res.json(alluser);
}
