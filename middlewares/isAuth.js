const jwt = require('jsonwebtoken');
require('dotenv').config();

const isAuth = (req, res, next) => {
    const token = req.cookies.token ? req.cookies.token.split(' ')[1] : null;
    if (!token) {
        return res.status(401).json('User not authorized');
    }
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decodedToken;
        next();
    } catch (error) {
        res.status(401).json(`Invalid token, authorization denied`);
    }
};

module.exports = isAuth;
