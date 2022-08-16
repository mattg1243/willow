import { Schema, model, PassportLocalDocument, PassportLocalModel, PassportLocalSchema, Document } from 'mongoose';
import { Getters } from './getset';
// not sure how to import this package properly without require...
const passportLocalMongoose = require('passport-local-mongoose')
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({path: path.resolve(__dirname, '../../.env')});

mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error'));

// define TS interfaces
export interface IPaymentInfo {
    check: string,
    venmo: string,
    paypal: string,
    zelle: string
}

interface IUser extends PassportLocalDocument {
    username: string,
    fname: string,
    lname: string,
    nameForHeader?: string,
    email: string,
    resetToken?: string,
    expireToken?: string,
    phone?: string,
    street?: string,
    city?: string,
    state?: string,
    zip?: string,
    clients: Array<Object>,        // not sure if this correct
    defaultBalanceNotifyThreshold?: number,
    paymentInfo?: IPaymentInfo,
    license? : string
}

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
    clients: [{type: Schema.Types.ObjectId, ref: 'Client'}],
    defaultBalanceNotifyThreshold: {type: Schema.Types.Decimal128, required: false, get: Getters.numberGetter},
    paymentInfo: {type: Object, required: false, maxLength: 300},
    license: {type: String, required: false, maxLength: 100}
}) as PassportLocalSchema;

interface UserModel <T extends Document> extends PassportLocalModel<T> {}

UserSchema.plugin(passportLocalMongoose);

const User: UserModel<IUser> = model<IUser>('User', UserSchema, 'users');
export default User;