import express from "express";

import { readAll, create, read, update, del } from "../controllers/item.controller.js";

const router = express.Router();
router.get("/read-all", readAll);

router.put("/create", create);
router.get("/:itemId/read", read);
router.put("/update", update);
router.delete("/delete", del);

export default router;