import express from "express";
import { find } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/profile", find);

export default router;