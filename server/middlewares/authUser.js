import jwt from 'jsonwebtoken';

const authUser = async (req, res, next) => {
    let token = req.cookies?.token;

    // Fallback to headers if cookies are blocked by browser third-party policies
    if (!token && req.headers.token) {
        token = req.headers.token;
    }
    if (!token && req.headers.authorization) {
        const parts = req.headers.authorization.split(' ');
        if (parts.length === 2 && parts[0] === 'Bearer') {
            token = parts[1];
        }
    }

    if (!token) {
        return res.status(401).json({ success: false, message: 'Not Authorized' });
    }

    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

        if (tokenDecode.id) {
            if (!req.body) req.body = {};
            req.body.userId = tokenDecode.id;
            next();
        } else {
            return res.status(401).json({ success: false, message: 'Not Authorized' });
        }

    } catch (error) {
        res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
};

export default authUser;
