require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User.model')
const {validationResult} = require('express-validator');


exports.getUser = async(req, res, next) => {
    const { _id } = req.user;
    try {
        const user = await User.findById(_id).select('name email _id').exec();
        if (!user) {
            return res.status(400).json('User not found');
        }
        return res.status(200).json(user);
    } catch (error) {
        next(error)
    }
};

exports.loginUser = async(req, res, next) => {
    const {email, password} = req.body;
    try {
        const user = await User.findOne({email})
        if (!user) {
            return res.status(400).json({validation: true, fieldName: 'email', errorMessage: 'Wrong email'});
        }
        const isPasswordMatches = await bcrypt.compare(password, user.password);
        if (!isPasswordMatches) {
            return res.status(400).json({validation: true, fieldName: 'password', errorMessage: 'Wrong password'});
        }
        const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET_KEY, {expiresIn: process.env.JWT_EXPIRATION_TIME});
        res.cookie('token', `Bearer ${token}`, {httpOnly: true});
        delete user.password;
        return res.status(200).json({token, user: user.toWeb()});
    } catch (error) {
        next(error)
    }
};

exports.registerUser = async(req, res, next) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        return res.status(400).json(validationErrors.array());
    }
    try {
        const {name, email, password} = req.body;
        const encryptedPassword = await bcrypt.hash(password, 10);
        const user = await new User({name, email, password: encryptedPassword}).save();
        const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET_KEY, {expiresIn: process.env.JWT_EXPIRATION_TIME});
        res.cookie('token', `Bearer ${token}`, {httpOnly: true});
        return res.status(200).json({token, user: user.toWeb()});
    } catch (error) {
        next(error);
    }
};

// exports.logoutUser = (req, res) => {
//     res.clearCookie('token');
//     res.status(200).json('You successfully loged out');
// }