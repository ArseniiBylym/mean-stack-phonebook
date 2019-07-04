const Contact = require('../models/Contact.model');
const User = require('../models/User.model');

exports.getHistory = async(req, res, next) => {
    const {_id} = req.user;
    const {limit = 5} = req.query;
    try {
        const user = await User.findById(_id).populate('history.contact', 'name avatar _id').exec();
        if (!user) {
            return res.status(400).json('User not found');
        }
        const lastContacts = user.history.reverse().slice(0, +limit + 1);
        return res.status(200).json(lastContacts)
    } catch (error) {
        next(error);
    }
}

exports.addToHistory = async(req, res, next) => {
    const {id} = req.body;
    const {_id} = req.user;
    try {
        const user = await User.findOne({$and: [{_id: _id}, {'history.contact': id}]});
        let updatedUser;
        if (user) {
            updatedUser = await User.findOneAndUpdate(
                {$and: [{_id: _id, }, {'history.contact': id}]},
                {$set: {"history.$.date": Date.now()}},
                {new: true}
            ).exec(); 
        } else {
            updatedUser = await User.findOneAndUpdate(
                {_id: _id},
                {$push: {history: {contact: id, date: Date.now()}}},
                {new: true}
            ).exec();
        }
        return res.status(200).json(updatedUser.toWeb());
    } catch(error) {
        next(error);
    }
}