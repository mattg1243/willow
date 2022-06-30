const { Double } = require('bson');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// this function needs to be defined in a different file...
const numberGetter = (num) => {
    return `${Number.parseFloat(`${num}`).toFixed(2)}`;
}

const EventSchema = new Schema({

    ownerID: {type: mongoose.Schema.Types.ObjectID},
    clientID: {type: mongoose.Schema.Types.ObjectID},
    date: {type: mongoose.Schema.Types.Date, required: true, maxLength: 100},
    type: {type: String, required: true, maxLength: 100},
    detail: {type: String, required: false, maxLength: 100},
    duration: {type: Number, required: false, maxLength: 100},
    rate: {type: Number, required: false, maxLength: 10},
    amount: {type: mongoose.Schema.Types.Decimal128, required: false, get: numberGetter },
    newBalance: {type: mongoose.Schema.Types.Decimal128, required: true, get: numberGetter }
}, {toObject: { getters: true, setters: true }, toJSON: { getters: true, setters: true }, runSettersOnQuery: true})

module.exports = mongoose.model('EventModel', EventSchema, 'events');

// { '$numberDecimal': `${Number.parseFloat(v.toString()).toFixed(2)}`}}