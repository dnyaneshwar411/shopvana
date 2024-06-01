import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import database from "./src/database/database.js";
import { auth } from "./src/middlewares/auth.middleware.js";
import authRoutes from "./src/routes/auth.route.js";
import userRoutes from "./src/routes/user.route.js";
import categoryRoutes from "./src/routes/category.route.js";
import itemRoutes from "./src/routes/item.route.js";

dotenv.config();

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(cors({
  credentials: true,
  origin: process.env.FRONTEND_URL,
  methods: ["GET", "POST"],
}));
app.use(express.urlencoded({ extended: false }));

const PORT = process.env.PORT;

app.get("/api/", function (req, res) {
  return res.status(200).json({ payload: `serving requests on port ${PORT}` });
});

app.use("/api/auth", authRoutes); //auth routes
app.use("/api/user", auth, userRoutes); //user routes
app.use("/api/category", auth, categoryRoutes); //category routes
app.use("/api/item", auth, itemRoutes); //item routes

app.listen(PORT, function () {
  database();
  console.log(`application listening on port ${PORT}`);
});