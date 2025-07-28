// controllers/invoice.controller.js

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

    // عامل بحث على اسم العميل أو رقم الموبايل
    const searchRegex = new RegExp(search, 'i');

    const query = search
      ? {
        $or: [
          { notes: searchRegex },
          { status: searchRegex },
        ],
      }
      : {};

    const invoices = await Invoice.find(query)
      .populate({
        path: 'customer',
        select: 'name phone',
        match: {
          $or: [
            { name: searchRegex },
            { phone: searchRegex },
          ],
        },
      })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    // حذف الفواتير اللي مالهاش customer مطابق للبحث
    const filteredInvoices = invoices.filter(inv => inv.customer);

    const total = await Invoice.countDocuments(query);

    res.status(200).json({
      invoices: filteredInvoices,
      total: filteredInvoices.length,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(filteredInvoices.length / limit),
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch invoices', error });
  }
};


// Get single invoice
export const getInvoiceById = async (req, res) => {
  try {
    const { id } = req.params;

    const invoice = await Invoice.findById(id).populate('customer', 'name phone');

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
  try {
    const { id } = req.params;

    const deleted = await Invoice.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    res.status(200).json({ message: 'Invoice deleted successfully', invoice: deleted });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete invoice', error });
  }
};
