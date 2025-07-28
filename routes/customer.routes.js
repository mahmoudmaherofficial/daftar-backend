import express from 'express';
import {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer
} from '../controllers/customer.controller.js';
import { isAdmin, verifyToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', verifyToken, isAdmin, createCustomer);
router.get('/', verifyToken, isAdmin, getCustomers);
router.get('/:id', verifyToken, isAdmin, getCustomerById);
router.put('/:id', verifyToken, isAdmin, updateCustomer);
router.delete('/:id', verifyToken, isAdmin, deleteCustomer);

export default router;
