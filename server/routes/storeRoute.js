import express from 'express';
import { getStoreSettings, updateStoreSettings } from '../controllers/storeSettingsController.js';
import authSeller from '../middlewares/authSeller.js';

const storeRouter = express.Router();

storeRouter.get('/settings', getStoreSettings);              // public (cart reads this)
storeRouter.post('/settings', authSeller, updateStoreSettings); // seller only

export default storeRouter;
