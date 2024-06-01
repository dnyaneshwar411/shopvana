import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export async function auth(req, res, next) {
  try {
    const token = req.cookies["Auth-Token"];
    if (!token) return res.status(400).json({ payload: "Kindly login" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded._id }, { password: 0, createdAt: 0, updatedAt: 0 });
    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({ payload: error.message });
  }
}