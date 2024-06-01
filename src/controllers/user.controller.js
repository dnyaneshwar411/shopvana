import { User } from "../models/user.model.js";

export async function find(req, res) {
  try {
    const user = await User.findOne({ _id: req.user._id }, { password: 0, _id: 0, __v: 0 });
    if (!user) return res.status(400).json({ payload: "Error finding you account" });
    return res.status(200).json({ payload: user });
  } catch (error) {
    return res.status(500).json({ payload: error.message });
  }
}