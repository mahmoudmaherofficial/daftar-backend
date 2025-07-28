// routes/inventoryTransaction.routes.js
import express from "express";
import {
  createInventoryTransaction,
  getAllInventoryTransactions,
  getInventoryTransactionById,
  deleteInventoryTransaction,
} from "../controllers/inventoryTransaction.controller.js";

const router = express.Router();

router.post("/", createInventoryTransaction);
router.get("/", getAllInventoryTransactions);
router.get("/:id", getInventoryTransactionById);
router.delete("/:id", deleteInventoryTransaction);

export default router;
