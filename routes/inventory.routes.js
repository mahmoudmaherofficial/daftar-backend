import express from "express";
import { increaseStock, decreaseStock } from "../controllers/inventory.controller.js";

const router = express.Router();

router.post("/increase", increaseStock);
router.post("/decrease", decreaseStock);

export default router;