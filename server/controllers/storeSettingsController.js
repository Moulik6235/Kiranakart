import StoreSettings from '../models/StoreSettings.js';

// Helper: get or create the single settings document
const getSettings = async () => {
    let settings = await StoreSettings.findOne();
    if (!settings) settings = await StoreSettings.create({});
    return settings;
};

// GET /api/store/settings  (public – used by cart)
export const getStoreSettings = async (req, res) => {
    try {
        const settings = await getSettings();
        res.json({ success: true, settings });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// POST /api/store/settings  (seller-only)
export const updateStoreSettings = async (req, res) => {
    try {
        const {
            deliveryCharge, surgeCharge,
            surgeEnabled, deliveryEnabled,
            surgeLabel, deliveryLabel,
            freeDeliveryThreshold, surgeFreeDeliveryThreshold,
            freeDeliveryEnabled, surgeFreeDeliveryEnabled,
        } = req.body;

        let settings = await StoreSettings.findOne();
        if (!settings) settings = new StoreSettings();

        if (deliveryCharge !== undefined) settings.deliveryCharge = Number(deliveryCharge);
        if (surgeCharge !== undefined) settings.surgeCharge = Number(surgeCharge);
        if (surgeEnabled !== undefined) settings.surgeEnabled = Boolean(surgeEnabled);
        if (deliveryEnabled !== undefined) settings.deliveryEnabled = Boolean(deliveryEnabled);
        if (surgeLabel !== undefined) settings.surgeLabel = surgeLabel;
        if (deliveryLabel !== undefined) settings.deliveryLabel = deliveryLabel;
        if (freeDeliveryThreshold !== undefined) settings.freeDeliveryThreshold = Number(freeDeliveryThreshold);
        if (surgeFreeDeliveryThreshold !== undefined) settings.surgeFreeDeliveryThreshold = Number(surgeFreeDeliveryThreshold);
        if (freeDeliveryEnabled !== undefined) settings.freeDeliveryEnabled = Boolean(freeDeliveryEnabled);
        if (surgeFreeDeliveryEnabled !== undefined) settings.surgeFreeDeliveryEnabled = Boolean(surgeFreeDeliveryEnabled);

        await settings.save();
        res.json({ success: true, message: 'Store settings updated!', settings });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};
