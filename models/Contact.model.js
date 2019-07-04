const { Schema, model } = require('mongoose');

const contactSchema = new Schema({
    name: {type: String, required: true},
    phone: {type: String, required: true},
    email: String,
    company: String,
    avatar: {type:String, default: '/assets/images/avatar.png'}
})

contactSchema.methods.short = function() {
    const {_id, name, phone, avatar} = this.toJSON();
    return {_id, name, phone, avatar};
}

module.exports = model('contact', contactSchema);