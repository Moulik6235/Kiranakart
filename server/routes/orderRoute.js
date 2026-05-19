import express from 'express';
import authUser from '../middlewares/authUser.js';
import { getAllOrders, getUserOrders, placeOrderCOD, placeOrderMockUPI, verifyMockUPI, cancelOrder } from '../controllers/orderController.js';
import authSeller from '../middlewares/authSeller.js';

const orderRouter = express.Router();

orderRouter.post('/cod', authUser, placeOrderCOD)
orderRouter.get('/user', authUser, getUserOrders)
orderRouter.get('/seller', authSeller, getAllOrders)
orderRouter.post('/mock-upi', authUser, placeOrderMockUPI)
orderRouter.post('/verify-mock-upi', authUser, verifyMockUPI)
orderRouter.post('/cancel', authUser, cancelOrder)


export default orderRouter;