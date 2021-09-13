const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventSchema = new Schema({

    date: {type: Date, required: true, maxLength: 100},
    type: {type: String, required: true, maxLength: 100},
    duration: {type: Number, required: true, maxLength: 100},
    rate: {type: Number, required: true, maxLength: 10},
    amount: {type: Number, required: false}

})

module.exports = mongoose.model('Event', EventSchema);