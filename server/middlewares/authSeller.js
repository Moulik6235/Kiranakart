import jwt from 'jsonwebtoken';

const authSeller = async (req, res, next) => {
    let sellerToken = req.cookies?.sellerToken;

    // Fallback to headers if cookies are blocked by browser third-party policies
    if (!sellerToken && req.headers.sellertoken) {
        sellerToken = req.headers.sellertoken;
    }

    if (!sellerToken) {
        return res.json({ success: false, message: 'Not Authorized' });
    }
    try {
        const tokenDecode = jwt.verify(sellerToken, process.env.JWT_SECRET);

        if (tokenDecode.email === process.env.SELLER_EMAIL) {
            next();
        } else {
            return res.status(401).json({ success: false, message: 'Not Authorized' });
        }

    } catch (error) {
        res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
}

export default authSeller;