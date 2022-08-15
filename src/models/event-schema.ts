import { Schema, model, Model, Document } from 'mongoose';
import { Getters } from './getset';

export interface IEvent extends Document {
    ownerID: string,
    clientID: string,
    date: Date,
    type: string,
    detail?: string,
    duration?: number,
    rate?: number,
    amount: number | string,
    newBalance: number,
}

const EventSchema = new Schema({

    ownerID: {type: Schema.Types.ObjectId},
    clientID: {type: Schema.Types.ObjectId},
    date: {type: Schema.Types.Date, required: true, maxLength: 100},
    type: {type: String, required: true, maxLength: 100},
    detail: {type: String, required: false, maxLength: 100},
    duration: {type: Number, required: false, maxLength: 100},
    rate: {type: Number, required: false, maxLength: 10},
    amount: {type: Schema.Types.Decimal128, required: false, get: Getters.numberGetter },
    newBalance: {type: Schema.Types.Decimal128, required: true, get: Getters.numberGetter }
}, {toObject: { getters: true }, toJSON: { getters: true }})

const Event: Model<IEvent> = model('EventModel', EventSchema, 'events')
export default Event;