import User from "../models/User.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Register User: /api/user/register



export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.json({ success: false, message: 'Missing Details' })
        }
        const existingUser = await User.findOne({ email })

        if (existingUser)
            return res.json({ success: false, message: 'User already exists' })


        const hashesPassword = await bcrypt.hash(password, 10)

        const user = await User.create({ name, email, password: hashesPassword })
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true, // Prevent Javascript to access cookie
            secure: process.env.NODE_ENV === 'production',   // Use secure cookies in production
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', //CSRF Protection
            maxAge: 7 * 24 * 60 * 60 * 1000, //Cookie expiration time
        })

        return res.json({ success: true, user: { email: user.email, name: user.name, cartItems: user.cartItems } })


    } catch (error) {
        console.log(error.message);

        res.json({ success: false, message: error.message });
    }
}

// Login user : /api/user/login

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password)
            return res.json({ success: false, message: 'Email and Password are required0' });
        const user = await User.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: 'Invalid email or password ' });
        }
        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch)
            return res.json({ success: false, message: 'Invalid email or password' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })

        return res.json({ success: true, user: { email: user.email, name: user.name, cartItems: user.cartItems } })
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });


    }
}

// Check Auth: /api/user/is-auth

export const isAuth = async(req, res) => {
    try {
        const { userId } = req.body;
        const user = await User.findById(userId).select("-password")
        return res.json({ success: true, user })
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });

    }
}

// Logout User : /api/user/logout/

export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
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

// Helper: Send Real SMS using Fast2SMS (India) or Twilio (Global) via native fetch
const sendRealSMS = async (phone, otp) => {
    const message = `Your KiranaKart OTP verification code is ${otp}. Valid for 5 minutes. Please do not share this with anyone.`;
    
    // 1. Try Fast2SMS (Indian Gateway)
    if (process.env.FAST2SMS_API_KEY) {
        try {
            console.log(`[SMS Gateway] Attempting Fast2SMS dispatch to ${phone}...`);
            const cleanPhone = phone.replace(/[^0-9]/g, "").slice(-10); // get last 10 digits
            
            const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
                method: 'POST',
                headers: {
                    'authorization': process.env.FAST2SMS_API_KEY,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    variables_values: otp,
                    route: 'otp',
                    numbers: cleanPhone
                })
            });
            
            const resData = await response.json();
            console.log('[SMS Gateway] Fast2SMS Response:', resData);
            
            if (resData.return === true || resData.status_code === 200) {
                return { success: true, provider: 'fast2sms' };
            } else {
                throw new Error(resData.message || 'Fast2SMS returned error state');
            }
        } catch (error) {
            console.error('[SMS Gateway] Fast2SMS dispatch failed:', error.message);
            return { success: false, error: error.message, provider: 'fast2sms' };
        }
    }
    
    // 2. Try Twilio (Global Gateway)
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER) {
        try {
            console.log(`[SMS Gateway] Attempting Twilio dispatch to ${phone}...`);
            const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;
            const accountSid = process.env.TWILIO_ACCOUNT_SID;
            const authToken = process.env.TWILIO_AUTH_TOKEN;
            
            const authHeader = 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64');
            
            const params = new URLSearchParams();
            params.append('To', formattedPhone);
            params.append('From', process.env.TWILIO_PHONE_NUMBER);
            params.append('Body', message);

            const response = await fetch(
                `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': authHeader,
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: params.toString()
                }
            );
            
            const resData = await response.json();
            console.log('[SMS Gateway] Twilio Response:', resData);
            
            if (response.status === 200 || response.status === 201) {
                return { success: true, provider: 'twilio' };
            } else {
                throw new Error(resData.message || 'Twilio returned error status');
            }
        } catch (error) {
            console.error('[SMS Gateway] Twilio dispatch failed:', error.message);
            return { success: false, error: error.message, provider: 'twilio' };
        }
    }

    // 3. Fallback mock dev logger if no credentials defined
    console.log(`\n============================================`);
    console.log(`[SMS Gateway] MOCK LOG: OTP ${otp} dispatched to mobile ${phone}`);
    console.log(`(Configure FAST2SMS_API_KEY or TWILIO credentials in server/.env for real SMS!)`);
    console.log(`============================================\n`);
    return { success: true, provider: 'mock' };
};

// Send SMS OTP: /api/user/send-otp
export const sendOTP = async (req, res) => {
    try {
        const { phone } = req.body;
        if (!phone) {
            return res.json({ success: false, message: "Mobile number is required" });
        }

        // Generate a secure 4-digit numeric code
        const otp = Math.floor(1000 + Math.random() * 9000).toString();

        // Frictionless auto-signup: Find user or create a new one dynamically
        let user = await User.findOne({ phone });
        if (!user) {
            const email = `${phone}@kiranakart.com`;
            const dummyPassword = await bcrypt.hash(Math.random().toString(), 10);
            user = await User.create({
                name: `User_${phone.slice(-4)}`,
                email,
                password: dummyPassword,
                phone
            });
        }

        user.otpCode = otp;
        user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 min expiry
        await user.save();

        // Dispatch REAL SMS via Gateway
        const dispatch = await sendRealSMS(phone, otp);

        return res.json({ 
            success: true, 
            message: dispatch.provider === 'mock' 
                ? `OTP simulated successfully for +91 ${phone}` 
                : `Verification code sent to +91 ${phone}!`,
            provider: dispatch.provider,
            error: dispatch.error,
            otp
        });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Verify SMS OTP and Login: /api/user/verify-otp
export const verifyOTP = async (req, res) => {
    try {
        const { phone, otp } = req.body;
        if (!phone || !otp) {
            return res.json({ success: false, message: "Mobile number and OTP are required" });
        }

        const user = await User.findOne({ phone });
        if (!user || user.otpCode !== otp || !user.otpExpiry || user.otpExpiry < new Date()) {
            return res.json({ success: false, message: "Invalid or expired OTP code!" });
        }

        // OTP verified successfully - clear columns
        user.otpCode = undefined;
        user.otpExpiry = undefined;
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.json({ 
            success: true, 
            message: "Login successful!",
            user: { email: user.email, name: user.name, phone: user.phone, cartItems: user.cartItems } 
        });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};