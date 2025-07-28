// models/InventoryTransaction.js
import mongoose from "mongoose";

const inventoryTransactionSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    type: {
      type: String,
      enum: ["in", "out"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    notes: String,
    source: {
      type: String,
      enum: ["manual", "invoice"],
      required: true,
      default: "manual",
    },
  },
  { timestamps: true }
);

const InventoryTransaction = mongoose.model("InventoryTransaction", inventoryTransactionSchema);
export default InventoryTransaction;
