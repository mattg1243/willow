const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')
const Schema = mongoose.Schema;

var dburi = 'mongodb+srv://mattg1243:chewyvuitton@main-cluster.5pmmm.mongodb.net/maindb?writeConcern=majority';
mongoose.connect(dburi, { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error'));

const UserSchema = new Schema({
    
    _id: {type: mongoose.Schema.Types.ObjectId},
    username: {type: String, required: true, maxLength: 100},
    fname: {type: String, required: true, maxLength: 100},
    lname: {type: String, required: true, maxLength: 100},
    email: {type: String, required: true, maxLength: 100},
    clients: [{type: mongoose.Schema.Types.ObjectId, ref: 'Client'}]

})

UserSchema.plugin(passportLocalMongoose);

// const User = mongoose.model('User', UserSchema)

module.exports = mongoose.model('User', UserSchema, 'users');