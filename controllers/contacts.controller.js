const Contact = require('../models/Contact.model');
const User = require('../models/User.model');
const {validationResult} = require('express-validator');


exports.getContacts = async(req, res, next) => {
    const {_id} = req.user;
    const {limit, sortOrder} = req.query;
    try {
        const user = await User.findById(_id).populate({
            path: 'contacts',
            select: '_id name phone avatar',
            options: {
                sort: {name: 'asc'}
            }
        }).exec();
        if (!user) {
            return res.status(400).json('User not found');
        }
        return res.status(200).json(user.contacts);
    } catch (error) {
        next(error);
    }
};

exports.getContactDetails = async(req, res, next) => {
    const {id} = req.params;
    try {
        const contact = await Contact.findById(id);
        if (!contact) {
            return res.status(400).json('Contact details not found');
        }
        return res.status(200).json(contact);
    } catch (error) {
        next(error)
    }
};

exports.createContact = async(req, res, next) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        return res.status(400).json(validationErrors.array());
    }
    try {
        const {_id} = req.user;
        const contact = await new Contact({...req.body}).save();
        await User.findOneAndUpdate(
            {_id: _id}, 
            {$push: {contacts: contact._id}}
        );
        return res.status(200).json(contact.short());
    } catch (error) {
        next(error);
    }
};

exports.updateContact = async(req, res, next) => {
    const {id} = req.params;
    try {
        const contact = await Contact.findOneAndUpdate(
            {_id: id}, 
            {$set: {...req.body}},
            {new: true}
        );
        return res.status(200).json(contact);
    } catch (error) {
        next(error);
    }
};

exports.deleteContact = async(req, res, next) => {
    const {id} = req.params;
    const {_id} = req.user;
    try {
        await Contact.findByIdAndDelete(id);
        await User.findOneAndUpdate(
            {_id: _id},
            {$pull: {contacts: id}},
            {new: true}
        )
        return res.status(200).json(id);
    } catch (error) {
        next(error)
    }
};