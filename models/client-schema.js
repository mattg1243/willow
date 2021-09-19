const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClientSchema = new Schema({

    ownerID: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    fname: {type: String, required: true, maxLength: 100},
    lname: {type: String, required: true, maxLength: 100},
    phonenumber: {type: String, required: false, maxLength: 100},
    sessions: {type: Array, required: false}, // this needs to be changed to an array of IDs and refactored to "events"
    balance: {type: mongoose.Schema.Types.Decimal128}

})

module.exports = mongoose.model('Client', ClientSchema, 'clients');