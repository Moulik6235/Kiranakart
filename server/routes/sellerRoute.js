import express from 'express';
import { isSellerAuth, sellerLogin, sellerLogout, getNotifications, markNotificationRead } from '../controllers/sellerController.js';
import authSeller from '../middlewares/authSeller.js';

const sellerRouter = express.Router();

sellerRouter.post('/login', sellerLogin);
sellerRouter.post('/is-auth',authSeller, isSellerAuth);
sellerRouter.post('/logout', sellerLogout);
sellerRouter.get('/notifications', authSeller, getNotifications);
sellerRouter.post('/notifications/read', authSeller, markNotificationRead);

export default sellerRouter;