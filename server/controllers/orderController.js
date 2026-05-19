import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js"


// Place Order COD :  /api/order/cod

export const placeOrderCOD = async (req, res) => {
    try {
        const { userId, items, address, discount } = req.body;
        if (!address || items.length === 0) {
            return res.json({ success: false, message: "Invalid Data" })
        }

        // Calculate Amount Using Items
        let amount = await items.reduce(async (acc, item) => {
            const product = await Product.findById(item.product);
            return (await acc) + product.offerPrice * item.quantity;
        }, 0)

        // Add Tax Charge (2%)
        amount += Math.floor(amount * 0.02);

        if (discount) {
            amount = Math.max(0, amount - Number(discount));
        }

        await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: "COD"
        });
        return res.json({ success: true, message: "Order Placed Successfully" });


    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}




// Place Order Mock UPI :  /api/order/mock-upi
export const placeOrderMockUPI = async (req, res) => {
    try {
        const { userId, items, address, discount } = req.body;
        if (!address || items.length === 0) {
            return res.json({ success: false, message: "Invalid Data" })
        }

        let productData = []
        // Calculate Amount Using Items
        let amount = await items.reduce(async (acc, item) => {
            const product = await Product.findById(item.product);
            productData.push({
                name: product.name,
                price: product.offerPrice,
                quantity: item.quantity
            })
            return (await acc) + product.offerPrice * item.quantity;
        }, 0)

        // Add Tax Charge (2%)
        amount += Math.floor(amount * 0.02);

        if (discount) {
            amount = Math.max(0, amount - Number(discount));
        }

        const order = await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: "Online",
            isPaid: false // Set to false until verified by mock
        });

        // Mock Order Creation (No external API call)
        return res.json({ 
            success: true, 
            order_id: order._id.toString(),
            amount: amount
        });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

// Verify Mock UPI Payment : /api/order/verify-mock-upi
export const verifyMockUPI = async (req, res) => {
    try {
        const { order_id, status } = req.body;

        if (status === "SUCCESS") {
            // Mark Payment as Paid
            const order = await Order.findByIdAndUpdate(order_id, { isPaid: true });
            if (order) {
                // Clear User cart
                await User.findByIdAndUpdate(order.userId, { cartItems: {} });
            }
            res.json({ success: true, message: "Payment Verified" });
        } else {
            // Payment failed or incomplete
            await Order.findByIdAndDelete(order_id);
            res.json({ success: false, message: "Payment Failed" });
        }
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// Get Orders by User ID : /api/order/user

export const getUserOrders = async (req, res) => {
    try {
        const { userId } = req.body;
        const orders = await Order.find({
            userId,
            $or: [{ paymentType: "COD" }, { isPaid: true }]
        }).populate("items.product address").sort({ createdAt: -1 });
        res.json({ success: true, orders });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Get All Orders (for seller / admin): /api/order/seller

export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            $or: [{ paymentType: "COD" }, { isPaid: true }]
        }).populate("items.product address")
        res.json({ success: true, orders });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Cancel Order: /api/order/cancel
export const cancelOrder = async (req, res) => {
    try {
        const { orderId } = req.body;
        const order = await Order.findByIdAndUpdate(orderId, { status: 'Cancelled' }, { new: true });
        if (!order) {
            return res.json({ success: false, message: "Order not found" });
        }
        res.json({ success: true, message: "Order Cancelled Successfully", order });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}
