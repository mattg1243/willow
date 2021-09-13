const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

var dburi = 'mongodb+srv://mattg1243:chewyvuitton@main-cluster.5pmmm.mongodb.net/maindb?writeConcern=majority';
mongoose.connect(dburi, { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error'));

const ClientSchema = new Schema({

    ownerID: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    fname: {type: String, required: true, maxLength: 100},
    lname: {type: String, required: true, maxLength: 100},
    balance: {type: Number, required: false, maxLength: 100},
    sessions: {type: Array, required: false}

})

module.exports = mongoose.model('Client', ClientSchema, 'clients');