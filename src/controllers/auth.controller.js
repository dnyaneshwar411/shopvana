import jwt from "jsonwebtoken";

import { User } from "../models/user.model.js";
import { checkCreds, comparePassword, hashPassword } from "../utils/auth.js";

export async function create(req, res) {
  try {
    const { username, name, email, password, cpassword } = req.body;

    const correct = checkCreds(username, name, email, password, cpassword);
    if (!correct.ok) return res.status(400).json({ payload: correct.payload });

    // hash password
    const hashedPassword = await hashPassword(password);

    // create new user
    const user = new User({ username, name, email, password: hashedPassword });
    await user.save();
  } catch (error) {
    const creds = JSON.stringify(error.keyValue);
    res.status(500).json({ payload: `User already exists with ${creds}, try using other credentials` });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ payload: "Kindly provide email and password" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ payload: "No account exists with this email" });

    const match = await comparePassword(password, user.password);
    if (!match.status) return res.status(400).json({ payload: match.payload });

    const token = jwt.sign({ email, _id: user._id, name: user.name }, process.env.JWT_SECRET, { expiresIn: 86400000 });

    res.cookie("Auth-Token", token, {
      maxAge: 86400000,
      httpOnly: false
    });

    return res.status(200).json({ payload: { email, name: user.name, username: user.username } });
  } catch (error) {
    res.status(500).json({ payload: error.message });
  }
}

export async function logout(req, res) {
  try {
    res.cookie("Auth-Token", "", { maxAge: 0 });
    return res.status(200).json({ payload: "You have successfully logged out" });
  } catch (error) {
    res.status(500).json({ payload: error.message });
  }
}