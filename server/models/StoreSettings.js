import mongoose from 'mongoose';

const storeSettingsSchema = new mongoose.Schema({
    deliveryCharge: { type: Number, default: 30, min: 0 },
    surgeCharge: { type: Number, default: 30, min: 0 },
    surgeEnabled: { type: Boolean, default: true },
    deliveryEnabled: { type: Boolean, default: true },
    surgeLabel: { type: String, default: 'Surge charge' },
    deliveryLabel: { type: String, default: 'Delivery charge' },
    // Free delivery thresholds (0 = no free delivery)
    freeDeliveryThreshold: { type: Number, default: 0, min: 0 },      // e.g. 99 → free delivery on orders ≥ ₹99
    surgeFreeDeliveryThreshold: { type: Number, default: 0, min: 0 }, // e.g. 199 → free delivery during surge on orders ≥ ₹199
    freeDeliveryEnabled: { type: Boolean, default: false },
    surgeFreeDeliveryEnabled: { type: Boolean, default: false },
}, { timestamps: true });

const StoreSettings = mongoose.model('StoreSettings', storeSettingsSchema);
export default StoreSettings;
