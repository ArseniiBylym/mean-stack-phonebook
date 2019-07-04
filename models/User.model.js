const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    contacts: [{type: Schema.Types.ObjectId, ref: 'contact'}],
    history: [{
        contact: {type: Schema.Types.ObjectId, ref: 'contact'},
        date: {type: Date, required: true, default: Date.now}
    }],
})

userSchema.methods.toWeb = function() {
    const user = this.toJSON(); 
    delete user.password;
    delete user.contacts;
    delete user.history;
    delete user.__v;
    return user;
}

module.exports = model('user', userSchema);