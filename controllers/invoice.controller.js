// controllers/invoice.controller.js

import mongoose from 'mongoose';
import Invoice from '../models/Invoice.js';
import Product from '../models/Product.js';

// Create new invoice

export const createInvoice = async (req, res) => {
  try {
    const { customer, items, notes, status = "unpaid" } = req.body;

    let totalAmount = 0;

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) return res.status(404).json({ message: `Product not found: ${item.product}` });

      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for product: ${product.name}` });
      }

      // Update stock
      product.stock -= item.quantity;
      await product.save();

      totalAmount += product.price * item.quantity;
      item.price = product.price; // store current price in invoice
    }

    const invoice = new Invoice({
      customer,
      items,
      notes,
      status,
      totalAmount,
    });

    await invoice.save();

    res.status(201).json({ message: "Invoice created successfully", invoice });
  } catch (error) {
    res.status(500).json({ message: "Failed to create invoice", error });
  }
};

// Get all invoices with optional pagination
export const getInvoices = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;

    // البحث فقط حسب حالة الدفع (status)
    const query = search ? { status: search } : {};

    const allInvoices = await Invoice.find(query)
      .populate({
        path: 'customer',
        select: 'name phone', // هنحتفظ بعرض بيانات العميل بس من غير فلترة
      })
      .sort({ createdAt: -1 });

    // pagination
    const paginatedInvoices = allInvoices.slice(
      (page - 1) * limit,
      page * limit
    );

    res.status(200).json({
      invoices: paginatedInvoices,
      total: allInvoices.length,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(allInvoices.length / limit),
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch invoices', error });
  }
};

// Get single invoice
export const getInvoiceById = async (req, res) => {
  try {
    const { id } = req.params;

    const invoice = await Invoice.findById(id).populate('customer', 'name phone').populate('items.product', 'name');

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    res.status(200).json(invoice);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch invoice', error });
  }
};

// Update invoice
export const updateInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const { items, status, notes } = req.body;

    const total = items?.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const invoice = await Invoice.findByIdAndUpdate(
      id,
      { items, status, notes, total },
      { new: true }
    );

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    res.status(200).json(invoice);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update invoice', error });
  }
};

// Delete invoice
export const deleteInvoice = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;

    // Fetch the invoice to get its items
    const invoice = await Invoice.findById(id).session(session);
    if (!invoice) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'Invoice not found' });
    }

    // Update stock for each product in the invoice's items
    for (const item of invoice.items) {
      const product = await Product.findById(item.product._id).session(session);
      if (!product) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({ message: `Product ${item.product._id} not found` });
      }

      // Increase stock by the item's quantity
      product.stock = (product.stock || 0) + item.quantity;
      await product.save({ session });
    }

    // Delete the invoice
    const deleted = await Invoice.findByIdAndDelete(id).session(session);
    if (!deleted) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'Invoice not found' });
    }

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ message: 'Invoice deleted successfully and stock updated', invoice: deleted });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: 'Failed to delete invoice or update stock', error: error.message });
  }
};