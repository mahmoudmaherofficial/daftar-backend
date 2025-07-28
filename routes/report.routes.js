import express from "express";
import {
  getTotalSales,
  getInvoiceStatusSummary,
  getTopSellingProducts,
  getTopCustomers,
  getMonthlySales,
  getInventoryMovement,
  getRevenueByCustomer,
  getUnpaidInvoices,
  getSalesByProduct,
  getLowStockProducts,
  getDailyRevenue,
} from "../controllers/report.controller.js";
import { isAdmin, verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/total-sales",verifyToken, isAdmin, getTotalSales);
router.get("/invoice-status-summary",verifyToken, isAdmin, getInvoiceStatusSummary);
router.get("/top-products",verifyToken, isAdmin, getTopSellingProducts);
router.get("/top-customers",verifyToken, isAdmin, getTopCustomers);
router.get("/daily-revenue",verifyToken, isAdmin, getDailyRevenue);
router.get("/low-stock",verifyToken, isAdmin, getLowStockProducts);
router.get("/sales-by-product",verifyToken, isAdmin, getSalesByProduct);
router.get("/unpaid-invoices",verifyToken, isAdmin, getUnpaidInvoices);
router.get("/revenue-by-customer",verifyToken, isAdmin, getRevenueByCustomer);
router.get("/inventory-movement",verifyToken, isAdmin, getInventoryMovement);
router.get("/monthly-sales",verifyToken, isAdmin, getMonthlySales);

export default router;
