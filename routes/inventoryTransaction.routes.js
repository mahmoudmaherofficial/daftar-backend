// routes/inventoryTransaction.routes.js
import express from "express";
import {
  createInventoryTransaction,
  getAllInventoryTransactions,
  getInventoryTransactionById,
  deleteInventoryTransaction,
} from "../controllers/inventoryTransaction.controller.js";
import { isAdmin, verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/",verifyToken, isAdmin, createInventoryTransaction);
router.get("/",verifyToken, isAdmin, getAllInventoryTransactions);
router.get("/:id",verifyToken, isAdmin, getInventoryTransactionById);
router.delete("/:id",verifyToken, isAdmin, deleteInventoryTransaction);

export default router;
