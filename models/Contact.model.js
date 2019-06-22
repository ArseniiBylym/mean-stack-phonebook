const { Schema, model } = require('mongoose');

const contactSchema = new Schema({
    name: {type: String, required: true},
    phone: {type: String, required: true},
    email: String,
    company: String,
    avatar: {type:String, default: '/static/images/avatar.png'}
})

contactSchema.methods.short = function() {
    const {_id, name, avatar} = this.toJSON();
    return {_id, name, avatar};
}

module.exports = model('contact', contactSchema);