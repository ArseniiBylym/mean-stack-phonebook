const jwt = require('jsonwebtoken');
require('dotenv').config();

const isAuth = (req, res, next) => {
    let token = req.header('Authorization');
    if (token) {
        token = token.split(' ')[1];
    } else {
        return res.status(401).json('User is not authorized');
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
