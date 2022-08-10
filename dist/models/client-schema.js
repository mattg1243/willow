const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const numberGetter = (num) => {
    return `${Number.parseFloat(`${num}`).toFixed(2)}`;
};
const ClientSchema = new Schema({
    ownerID: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    fname: { type: String, required: true, maxLength: 100 },
    lname: { type: String, required: true, maxLength: 100 },
    phonenumber: { type: String, required: false, maxLength: 100 },
    email: { type: String, required: false, maxLength: 100 },
    sessions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'events' }],
    balance: { type: mongoose.Schema.Types.Decimal128, get: numberGetter },
    rate: { type: mongoose.Schema.Types.Decimal128, get: numberGetter },
    isArchived: { type: Boolean, default: false }
}, { toObject: { getters: true, setters: true }, toJSON: { getters: true, setters: true }, runSettersOnQuery: true });
module.exports = mongoose.model('Client', ClientSchema, 'clients');
