import InventoryTransaction from "../models/InventoryTransaction.js";
import Product from "../models/Product.js";

// إنشاء حركة جديدة يدويًا
export const createInventoryTransaction = async (req, res) => {
  try {
    const { product, type, amount, notes, source } = req.body;

    // تأكد من وجود المنتج
    const productDoc = await Product.findById(product);
    if (!productDoc) return res.status(404).json({ message: "Product not found" });

    // إنشاء الحركة
    const newTransaction = await InventoryTransaction.create({
      product,
      type,
      amount,
      notes,
      source: source || "manual",
    });

    // تحديث المخزون تلقائيًا
    if (type === "in") {
      productDoc.stock += Number(amount);
    } else if (type === "out") {
      if (productDoc.stock < amount)
        return res.status(400).json({ message: "Insufficient stock" });
      productDoc.stock -= Number(amount);
    }
    await productDoc.save();

    res.status(201).json({ message: "Inventory transaction created", transaction: newTransaction });
  } catch (error) {
    res.status(500).json({ message: "Failed to create transaction", error });
  }
};

// عرض كل الحركات
export const getAllInventoryTransactions = async (req, res) => {
  try {
    const transactions = await InventoryTransaction.find()
      .populate("product", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({ message: "Transactions fetched", transactions });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch transactions", error });
  }
};

// عرض حركة واحدة
export const getInventoryTransactionById = async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = await InventoryTransaction.findById(id).populate("product", "name");
    if (!transaction) return res.status(404).json({ message: "Transaction not found" });

    res.status(200).json({ message: "Transaction fetched", transaction });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch transaction", error });
  }
};

// حذف حركة
export const deleteInventoryTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = await InventoryTransaction.findById(id);
    if (!transaction) return res.status(404).json({ message: "Transaction not found" });

    // ممكن تعمل هنا "عكس" التأثير لو عايز ترجع الستوك (اختياري)
    const product = await Product.findById(transaction.product);
    if (product) {
      if (transaction.type === "in") {
        product.stock -= transaction.amount;
      } else if (transaction.type === "out") {
        product.stock += transaction.amount;
      }
      await product.save();
    }

    await InventoryTransaction.findByIdAndDelete(id);

    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete transaction", error });
  }
};
