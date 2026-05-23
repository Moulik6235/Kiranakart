import { v2 as cloudinary } from 'cloudinary'
import Product from '../models/Product.js'

// Add Product : /api/product/add

export const addProduct = async (req, res) => {
    try {
        let productData = JSON.parse(req.body.productData)

        const images = req.files

        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path,
                    { resource_type: 'image' });
                return result.secure_url
            })
        )

        await Product.create({ ...productData, image: imagesUrl })

        res.json({ success: true, message: "Product Added" })


    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })

    }
}
// Get Product : /api/product/list

export const productList = async (req, res) => {
    try {
        const products = await Product.find({})
        res.json({ success: true, products })
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })

    }
}
// Get single Product : /api/product/id

export const productById = async (req, res) => {
    try {
        const { id } = req.body
        const product = await Product.findById(id)
        res.json({ success: true, product })
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })

    }
}

// Change Product inStock : /api/product/stock

export const changeStock = async (req, res) => {
    try {
        const { id, inStock, stock } = req.body
        const updateData = {}
        if (inStock !== undefined) updateData.inStock = inStock
        if (stock !== undefined) {
            updateData.stock = Number(stock)
            // If stock becomes zero or less, mark inStock as false, else true
            updateData.inStock = Number(stock) > 0
        }
        await Product.findByIdAndUpdate(id, updateData)
        res.json({ success: true, message: "Stock Updated" })
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })

    }
}

// Update Product Price : /api/product/update-price
export const updatePrice = async (req, res) => {
    try {
        const { id, price, offerPrice } = req.body
        await Product.findByIdAndUpdate(id, { price: Number(price), offerPrice: Number(offerPrice) })
        res.json({ success: true, message: "Price Updated" })
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}