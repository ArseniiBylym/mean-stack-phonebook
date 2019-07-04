const {body} = require('express-validator');
const User = require('../models/User.model');


exports.registerValidator = [
    body('name')
        .not().isEmpty().withMessage('Name is required'),
    body('email')
        .isEmail().withMessage('Email is required and should be a valid email')
        .custom(value => {
            return User.findOne({email: value})
                .then(user => {
                    if (user) {
                        return Promise.reject('User with this email already exists');
                    }
                })
        }),
    body('password')
        .not().isEmpty().withMessage('Password is required'),
    body('passwordConfirm')
        .custom((value, {req}) => {
            if (value !== req.body.password) {
                throw new Error(`Password doesn't match`);
            }
            return true;
        }),
];

exports.createContactValidator = [
    body('name')
        .not().isEmpty().withMessage('Contact name is required'),
    body('phone')
        .isMobilePhone().withMessage('Phone is required and should be a valid mobile phone number'),
    body('email')
        .optional()
        .isEmail().withMessage('Email should be a valid email'),
]