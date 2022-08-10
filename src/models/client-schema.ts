import { Schema, model, Model, Document } from 'mongoose';
import { Getters } from './getset';

interface IClient extends Document {
    ownerID: string,
    fname: string,
    lname: string,
    phonenumber?: string,
    email?: string,
    sessions?: Array<Object>,
    balance: number,
    rate?: number,
    isArchived: boolean
}

const ClientSchema = new Schema({

    ownerID: {type: Schema.Types.ObjectId, ref: 'users'},
    fname: {type: String, required: true, maxLength: 100},
    lname: {type: String, required: true, maxLength: 100},
    phonenumber: {type: String, required: false, maxLength: 100},
    email: {type: String, required: false, maxLength: 100},
    sessions: [{type: Schema.Types.ObjectId, ref: 'events'}], // this needs to be changed to an array of IDs and refactored to "events"
    balance: {type: Schema.Types.Decimal128, get: Getters.numberGetter },
    rate: {type: Schema.Types.Decimal128, get: Getters.numberGetter },
    isArchived: {type: Boolean, default: false}

}, {toObject: { getters: true }, toJSON: { getters: true }})

const Client: Model<IClient> = model('Client', ClientSchema, 'clients');
export default Client;