import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const MONGOURL = process.env.DATABASE_URL;

export default async function database() {
  try {
    await mongoose.connect(MONGOURL);
    console.log("database connected successfully");
  } catch (error) {
    console.log(error.message)
  }
}