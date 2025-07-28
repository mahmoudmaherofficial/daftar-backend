import express from "express";
import { increaseStock, decreaseStock } from "../controllers/inventory.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/increase",verifyToken, increaseStock);
router.post("/decrease",verifyToken, decreaseStock);

export default router;