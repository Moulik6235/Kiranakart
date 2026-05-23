import jwt from 'jsonwebtoken';
import SellerNotification from '../models/SellerNotification.js';


// Login Seller : /api/seller/login

export const sellerLogin = async (req, res)=>{
   try {
     const {email, password} = req.body;

    if(password === process.env.SELLER_PASSWORD && email === process.env.SELLER_EMAIL){
        const token = jwt.sign({email}, process.env.JWT_SECRET, {expiresIn: '7d'});

           res.cookie('sellerToken', token, {
            httpOnly: true, // Prevent Javascript to access cookie
            secure: process.env.NODE_ENV === 'production',   // Use secure cookies in production
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', //CSRF Protection
            maxAge: 7 * 24 * 60 * 60 * 1000, //Cookie expiration time
        });

        return res.json({success: true, token, message: "Logged In"})
    }else{
        return res.json({success: false, message: "Invalid Credentials"})
    }
   } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
        
   }
}

// Seller  isAuth: /api/seller/is-auth

export const isSellerAuth = async(req, res) => {
    try {
        return res.json({ success: true})
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });

    }
}

// Logout Seller : /api/seller/logout/

export const sellerLogout = async (req, res) => {
    try {
        res.clearCookie('sellerToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        });
        return res.json({ success: true, message: "Logged Out" })
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });

    }
}

// Get Seller Notifications: /api/seller/notifications
export const getNotifications = async (req, res) => {
    try {
        const notifications = await SellerNotification.find({}).sort({ createdAt: -1 });
        return res.json({ success: true, notifications });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// Mark Notification as Read: /api/seller/notifications/read
export const markNotificationRead = async (req, res) => {
    try {
        const { id } = req.body;
        if (id) {
            await SellerNotification.findByIdAndUpdate(id, { read: true });
        } else {
            await SellerNotification.updateMany({ read: false }, { read: true });
        }
        return res.json({ success: true, message: "Notifications updated" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}