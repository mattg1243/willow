const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    
    fname: {type: String, required: true, maxLength: 100},
    lname: {type: String, required: true, maxLength: 100},
    email: {type: String, required: true, maxLength: 100},
    password: {type: String, required: true, maxLength: 25},
    client: {type: Array, required: false}

})

module.exports = mongoose.model('User', UserSchema);