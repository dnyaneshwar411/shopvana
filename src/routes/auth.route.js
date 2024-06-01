import express from "express";

import { create, login, logout } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/create", create);
router.post("/login", login);
router.post("/logout", logout);

export default router;