import Event from '../models/event-schema';
import Client from '../models/client-schema';
import DatabaseHelpers from '../utils/databaseHelpers';
import { Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ISaveEventReqBody, IDeleteEventReqBody } from './reqTypes';

export default class EventHandlers {
  static addEvent = async (req: Request<ParamsDictionary, {}, ISaveEventReqBody>, res: Response): Promise<Response> => {
    /* DEBUG LOGS
    console.log("Add event req.body: \n"); 
    console.dir(req.body);
    console.log("----------------------------------------------------------------")
    */
    let { clientID, date, type, detail, hours, minutes, rate, amount, user } = req.body;
    let time: number;
    // determine the effect of the event on clients balance
    if (type === 'Retainer' || type === 'Payment') {
      amount = amount;
    } else if (req.body.type === 'Refund') {
      amount = amount * -1;
    } else {
      time = parseFloat(hours) + parseFloat(minutes);
      amount = -(time * rate);
      console.log('TIME: ', time);
      console.log('HOURS: ', hours, req.body.hours);
      console.log('MINUTES: ', minutes, req.body.minutes);
    }
    // create the new Event
    const event = new Event({
      clientID,
      date,
      type,
      detail,
      duration: time,
      rate,
      amount,
      newBalance: 0,
    });
    // saving event to db
    try {
      await event.save();
      // add the new event to the client documents list of events
      await Client.findOneAndUpdate({ _id: clientID }, { $push: { sessions: event } });
      // get events to recalculate the running balances for each event
      await DatabaseHelpers.recalcBalance(clientID);
      // generate a response for the client and send it
      const response = await DatabaseHelpers.getAllData({ _id: user });
      return res.status(200).json(response);
    } catch (err) {
      console.error(err);
      return res.status(503).json({ error: err });
    }
  };

  static updateEvent = async (
    req: Request<ParamsDictionary, {}, ISaveEventReqBody>,
    res: Response
  ): Promise<Response> => {
    let { clientID, date, type, detail, hours, minutes, rate, amount, user } = req.body;
    let duration: number;
    const eventid: string = req.params.eventid;
    // DEBUG LOGS
    /*
        console.log("Update event req.body: \n"); 
        console.dir(req.body);
        console.log("----------------------------------------------------------------")
        */
    if (req.body.type !== 'Refund' && req.body.type !== 'Retainer' && req.body.type !== 'Payment') {
      duration = parseFloat(hours) + parseFloat(minutes);
      amount = -(duration * rate);
    } else {
      rate = 0;
      if (req.body.type === 'Refund') {
        // ensure amount is always negative if event is a refund
        amount = -Math.abs(amount);
      } else if (type === 'Retainer' || type === 'Payment') {
        // ensure the opposite for a retainer / payment
        amount = Math.abs(amount);
      }
    }

    try {
      await Event.findOneAndUpdate(
        { _id: eventid },
        { type: type, duration: duration, rate: rate, amount: amount, detail: detail, date: date }
      );
      await DatabaseHelpers.recalcBalance(clientID);
      const response = await DatabaseHelpers.getAllData({ _id: user });
      return res.status(200).json(response);
    } catch (err) {
      return res.status(503).json({ error: err });
    }
  };

  static deleteEvent = async (
    req: Request<ParamsDictionary, {}, IDeleteEventReqBody>,
    res: Response
  ): Promise<Response> => {
    try {
      // only using a callback here in order to access the deleted events amount
      Event.findByIdAndDelete(req.body.eventID, async (err, event) => {
        if (err) throw err;
        // update clients balance and remove event from client document
        await Client.findOneAndUpdate({ _id: req.body.clientID }, { $pull: { sessions: { _id: event._id } } });
        await DatabaseHelpers.recalcBalance(req.body.clientID);
        await DatabaseHelpers.deleteOldEvents(req.body.clientID);
        const response = await DatabaseHelpers.getAllData({ _id: req.body.user });
        return res.status(200).json(response);
      });
    } catch (err) {
      return res.status(503).json({ error: err });
    }
  };
}
