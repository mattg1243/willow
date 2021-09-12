const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const ClientSchema = new Schema({

    fname: {type: String, required: true, maxLength: 100},
    lname: {type: String, required: true, maxLength: 100},
    balance: {type: Number, required: false, maxLength: 100},
    sessions: {type: Array, required: false}

})

ClientSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Client', ClientSchema);