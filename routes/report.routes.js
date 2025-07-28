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

const router = express.Router();

router.get("/total-sales", getTotalSales);
router.get("/invoice-status-summary", getInvoiceStatusSummary);
router.get("/top-products", getTopSellingProducts);
router.get("/top-customers", getTopCustomers);
router.get("/daily-revenue", getDailyRevenue);
router.get("/low-stock", getLowStockProducts);
router.get("/sales-by-product", getSalesByProduct);
router.get("/unpaid-invoices", getUnpaidInvoices);
router.get("/revenue-by-customer", getRevenueByCustomer);
router.get("/inventory-movement", getInventoryMovement);
router.get("/monthly-sales", getMonthlySales);

export default router;
