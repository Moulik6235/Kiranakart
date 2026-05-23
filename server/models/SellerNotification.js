import mongoose from "mongoose";

const sellerNotificationSchema = new mongoose.Schema({
    message: { type: String, required: true },
    type: { type: String, default: "info" }, // "info", "warning", "success", "error"
    read: { type: Boolean, default: false },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'product' },
}, { timestamps: true });

const SellerNotification = mongoose.models.SellerNotification || mongoose.model('SellerNotification', sellerNotificationSchema);

export default SellerNotification;
