const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClientSchema = new Schema({

    fname: {type: String, required: true, maxLength: 100},
    lname: {type: String, required: true, maxLength: 100},
    balance: {type: Number, required: false, maxLength: 100},
    session: {type: Array, required: false}

})

module.exports = mongoose.model('Client', ClientSchema);