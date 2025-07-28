// controllers/inventory.controller.js
import Product from "../models/Product.js";
import InventoryTransaction from "../models/InventoryTransaction.js";

export const increaseStock = async (req, res) => {
  try {
    const { productId, amount, notes } = req.body;

    const product = await Product.findById(productId);
    if (!product)
      return res.status(404).json({ message: "Product not found" });

    product.stock += Number(amount);
    await product.save();

    // سجل الحركة
    await InventoryTransaction.create({
      product: productId,
      type: "in",
      amount,
      notes,
      source: "manual",
    });

    res.status(200).json({ message: "Stock increased successfully", product });
  } catch (error) {
    res.status(500).json({ message: "Failed to increase stock", error });
  }
};

export const decreaseStock = async (req, res) => {
  try {
    const { productId, amount, notes } = req.body;

    const product = await Product.findById(productId);
    if (!product)
      return res.status(404).json({ message: "Product not found" });

    if (product.stock < amount) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    product.stock -= Number(amount);
    await product.save();

    // سجل الحركة
    await InventoryTransaction.create({
      product: productId,
      type: "out",
      amount,
      notes,
      source: "manual",
    });

    res.status(200).json({ message: "Stock decreased successfully", product });
  } catch (error) {
    res.status(500).json({ message: "Failed to decrease stock", error });
  }
};
