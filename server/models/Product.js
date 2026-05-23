import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: Array, required: true },
    price: { type: Number, required: true },
    offerPrice: { type: Number, required: true },
    image: { type: Array, required: true },
    category: { type: String, required: true },
    inStock: { type: Boolean, default: true },
    stock: { type: Number, default: 100 },
    isDeal: { type: Boolean, default: false },
    dealBadge: { type: String },
    dealDescription: { type: String },
    unit: { type: String },
    quantityValue: { type: Number },
}, { timestamps: true })

const Product = mongoose.models.product || mongoose.model('product', productSchema)

export default Product