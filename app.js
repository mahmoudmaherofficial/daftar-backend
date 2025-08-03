// app.js
import express from 'express';
import cors from 'cors';
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from 'cookie-parser';


import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import customerRoutes from './routes/customer.routes.js';
import invoiceRoutes from './routes/invoice.routes.js';
import productRoutes from './routes/product.routes.js';
import inventoryRoutes from "./routes/inventory.routes.js";
import inventoryTransactionRoutes from "./routes/inventoryTransaction.routes.js";
import reportRoutes from "./routes/report.routes.js";

const app = express();

// Get __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors({
  origin: "http://localhost:3000", // عدل حسب رابط الفرونت
  credentials: true, // ده ضروري عشان تسمح بالكوكيز
}));
app.use(express.json());
app.use(cookieParser());

// Serve static files from 'public' folder
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/products', productRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/inventory-transactions", inventoryTransactionRoutes);
app.use("/api/reports", reportRoutes);


export default app;
