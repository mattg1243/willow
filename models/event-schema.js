const { Double } = require('bson');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventSchema = new Schema({

    ownerID: {type: mongoose.Schema.Types.ObjectID},
    clientID: {type: mongoose.Schema.Types.ObjectID},
    date: {type: mongoose.Schema.Types.Date, required: true, maxLength: 100},
    type: {type: String, required: true, maxLength: 100},
    detail: {type: String, required: false, maxLength: 100},
    duration: {type: Number, required: false, maxLength: 100},
    rate: {type: Number, required: false, maxLength: 10},
    amount: {type: mongoose.Schema.Types.Decimal128, required: false,
            get: v => new mongoose.Types.Decimal128(v.toString())},
    newBalance: {type: mongoose.Schema.Types.Decimal128, required: true}
})

module.exports = mongoose.model('EventModel', EventSchema, 'events');