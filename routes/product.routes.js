import express from 'express';
import {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  getProductById,
} from '../controllers/product.controller.js';
import { verifyToken, isAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', verifyToken, isAdmin, createProduct); // أو استخدم isAdmin لو هتخليها فقط للإدمن
router.get('/', verifyToken, isAdmin, getProducts);
router.get('/:id', verifyToken, isAdmin, getProductById);
router.put('/:id', verifyToken, isAdmin, updateProduct);
router.delete('/:id', verifyToken, isAdmin, deleteProduct);

export default router;
