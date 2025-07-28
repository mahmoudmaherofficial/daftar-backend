// routes/invoice.routes.js

import express from 'express';
import {
  createInvoice,
  getInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
} from '../controllers/invoice.controller.js';
import { isAdmin, verifyToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', verifyToken, createInvoice); // Create
router.get('/', verifyToken, getInvoices); // Get all
router.get('/:id', verifyToken, getInvoiceById); // Get one
router.put('/:id', verifyToken, updateInvoice); // Update
router.delete('/:id', verifyToken, isAdmin, deleteInvoice); // Delete

export default router;
