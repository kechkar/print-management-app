const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];

        if (!authHeader) {
            console.log('❌ No authorization header provided');
            return res.status(401).json({ message: 'Access denied. No token provided' });
        }

        const token = authHeader.split(' ')[1]; // Extract token
        if (!token) {
            console.log('❌ Token missing in authorization header');
            return res.status(401).json({ message: 'Access denied. No token found' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded || !decoded.userId) {
            console.log('❌ Invalid token');
            return res.status(401).json({ message: 'Invalid token' });
        }

        const user = await User.findById(decoded.userId);
        if (!user) {
            console.log('❌ User not found for token');
            return res.status(401).json({ message: 'Invalid token: User not found' });
        }

        req.user = user; // ✅ Store user info in `req.user`
        console.log(`✅ Authenticated: ${user.email} (Role: ${user.role})`);
        next();
    } catch (error) {
        console.error('❌ Authentication error:', error);
        res.status(401).json({ message: 'Invalid token' });
    }
};

