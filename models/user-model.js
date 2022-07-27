const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')
const Schema = mongoose.Schema;
require('dotenv').config();

mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error'));

const UserSchema = new Schema({
    
    username: {type: String, required: true, maxLength: 100},
    fname: {type: String, required: true, maxLength: 100},
    lname: {type: String, required: true, maxLength: 100},
    nameForHeader: {type: String, required: false, maxLength: 100},
    email: {type: String, required: true, maxLength: 100},
    resetToken: {type: String, required: false},
    expireToken: {type: Date, required: false},
    phone: {type: String, required: false, maxLength: 100},
    street: {type: String, required: false},
    city: {type: String, required: false},
    state: {type: String, required: false, maxLength: 2},
    zip: {type: String, required: false, maxLength: 5},
    clients: [{type: mongoose.Schema.Types.ObjectId, ref: 'Client'}],
    paymentInfo: {type: Object, required: false, maxLength: 300}
})

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema, 'users');