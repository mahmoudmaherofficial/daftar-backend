// controllers/report.controller.js
import InventoryTransaction from "../models/InventoryTransaction.js";
import Invoice from "../models/Invoice.js";
import Product from "../models/Product.js";

export const getTotalSales = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const sales = await Invoice.aggregate([
      {
        $match: {
          status: "paid",
          createdAt: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          },
        },
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$totalAmount" },
          totalInvoices: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      message: "Total sales fetched successfully",
      data: sales[0] || { totalSales: 0, totalInvoices: 0 },
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to get total sales", error });
  }
};

export const getInvoiceStatusSummary = async (req, res) => {
  try {
    const result = await Invoice.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const formatted = {};
    result.forEach(r => {
      formatted[r._id] = r.count;
    });

    res.status(200).json({
      success: true,
      data: formatted,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get invoice status summary",
      error,
    });
  }
};

export const getTopSellingProducts = async (req, res) => {
  try {
    const topProducts = await Invoice.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          totalSold: { $sum: "$items.quantity" }
        }
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product"
        }
      },
      { $unwind: "$product" },
      { $sort: { totalSold: -1 } },
      { $limit: 5 } // ممكن تغير العدد حسب الحاجة
    ]);

    res.status(200).json({
      success: true,
      message: "Top selling products fetched successfully",
      data: topProducts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch top selling products",
      error: error.message,
    });
  }
};

export const getTopCustomers = async (req, res) => {
  try {
    const topCustomers = await Invoice.aggregate([
      {
        $group: {
          _id: "$customer",
          totalSpent: { $sum: "$totalAmount" },
        },
      },
      {
        $lookup: {
          from: "customers",
          localField: "_id",
          foreignField: "_id",
          as: "customer",
        },
      },
      { $unwind: "$customer" },
      { $sort: { totalSpent: -1 } },
      { $limit: 5 }, // عدد العملاء اللي عايز تعرضهم
    ]);

    res.status(200).json({
      success: true,
      message: "Top customers fetched successfully",
      data: topCustomers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch top customers",
      error: error.message,
    });
  }
};

export const getDailyRevenue = async (req, res) => {
  try {
    const result = await Invoice.aggregate([
      {
        $match: { status: "paid" },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          total: { $sum: "$totalAmount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Error fetching daily revenue", err });
  }
};

// 2. المنتجات منخفضة المخزون
export const getLowStockProducts = async (req, res) => {
  try {
    const result = await Product.find({ stock: { $lt: 5 } });
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Error fetching low stock products", err });
  }
};

// 3. المبيعات حسب المنتج
export const getSalesByProduct = async (req, res) => {
  try {
    const result = await Invoice.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          totalSold: { $sum: "$items.quantity" },
          revenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } },
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
    ]);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Error fetching sales by product", err });
  }
};

// 4. الفواتير غير المدفوعة
export const getUnpaidInvoices = async (req, res) => {
  try {
    const result = await Invoice.find({ status: "unpaid" }).populate("customer");
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Error fetching unpaid invoices", err });
  }
};

// 5. الإيرادات حسب العميل
export const getRevenueByCustomer = async (req, res) => {
  try {
    const result = await Invoice.aggregate([
      { $match: { status: "paid" } },
      {
        $group: {
          _id: "$customer",
          totalPaid: { $sum: "$totalAmount" },
        },
      },
      {
        $lookup: {
          from: "customers",
          localField: "_id",
          foreignField: "_id",
          as: "customer",
        },
      },
      { $unwind: "$customer" },
    ]);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Error fetching revenue by customer", err });
  }
};

// 6. حركة المخزون
export const getInventoryMovement = async (req, res) => {
  try {
    const result = await InventoryTransaction.find()
      .populate("product")
      .sort({ createdAt: -1 });
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Error fetching inventory movement", err });
  }
};

// 7. المبيعات الشهرية
export const getMonthlySales = async (req, res) => {
  try {
    const result = await Invoice.aggregate([
      {
        $match: { status: "paid" },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          totalSales: { $sum: "$totalAmount" },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Error fetching monthly sales", err });
  }
};