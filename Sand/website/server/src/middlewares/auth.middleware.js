const jwt = require("jsonwebtoken");
const User = require("../models/user.model.js");

const auth = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        
        if (!token) {
            throw new Error('Authentication token missing');
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findOne({ _id: decoded._id });

        if (!user) {
            throw new Error('User not found');
        }

        req.user = user;
        req.token = token;
        next();
    } catch (error) {
        console.error('Auth Error:', error.message);
        res.status(401).json({ 
            success: false, 
            message: 'Please authenticate',
            error: error.message 
        });
    }
};

module.exports = auth;
