import express from 'express'
import { deleteUser, getUserById, getUsers, updateUser } from '../controllers/user.controller.js'
import { isAdmin, verifyToken } from '../middlewares/auth.middleware.js'

const router = express.Router()

router.get('/', verifyToken, isAdmin, getUsers)
router.get('/:id', verifyToken, isAdmin, getUserById)
router.put('/:id', verifyToken, isAdmin, updateUser)
router.delete('/:id', verifyToken, isAdmin, deleteUser)

export default router