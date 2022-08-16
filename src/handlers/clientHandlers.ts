import { Request, Response } from 'express';
import { ParamsDictionary } from "express-serve-static-core";
import async from 'async';
import fs from 'fs';
import { exec } from 'child_process';
import User from '../models/user-model';
import Client from '../models/client-schema';
import Event, { IEvent } from '../models/event-schema';
import DatabaseHelpers from '../utils/databaseHelpers';
import { ISaveEventReqBody, IDeleteEventReqBody, IMakeStatementReqBody } from './reqTypes';

export default class ClientHandlers {
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
      console.log("TIME: ", time);
      console.log("HOURS: ", hours, req.body.hours)
      console.log("MINUTES: ", minutes, req.body.minutes)
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

  static updateEvent = async (req: Request<ParamsDictionary, {}, ISaveEventReqBody>, res: Response): Promise<Response> => {
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

  static deleteEvent = async (req: Request<ParamsDictionary, {}, IDeleteEventReqBody>, res: Response): Promise<Response> => {
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

  static makeStatement = (req: Request<ParamsDictionary, {}, IMakeStatementReqBody>, res: Response) => {
    // interfaces
    interface base {
      fname: string;
      lname: string;
      phonenumber: string;
      email: string;
    }

    interface IClientInfo extends base {
      balance: number | string;
      rate: number | string;
    }

    interface IProviderInfo extends base {
      nameForHeader: string;
      street: string;
      city: string;
      state: string;
      zip: string;
      paymentInfo: any;
      license: string;
    }

    // parse the request
    const start = new Date(req.params.start).toISOString();
    const end = new Date(req.params.end).toISOString();
    const userID = req.params.userid;
    const clientID = req.params.clientid;
    const amountInput = req.body.amount;
    const notesInput = req.body.notes;
    let eventsList: Array<IEvent>;
    // timing labels
    const dbTime = 'Time in database: ';
    const genTime = 'Time in generator script: ';

    // outline argument objects
    let clientInfo: IClientInfo;
    let providerInfo: IProviderInfo;

    // read from the database
    console.time(dbTime);
    async.parallel(
      [
        // populate client object
        (callback) => {
          User.findById(`${userID}`, (err, user) => {
            if (err) {
              return console.error(err);
            }
            // populate the provider obj
            providerInfo = user._doc;
            callback(null);
          })
            .select(['-_id', '-clients', '-username', '-__v'])
            .clone();
        },
        // populate client object
        (callback) => {
          Client.findById(`${clientID}`, (err, client) => {
            if (err) {
              return console.error(err);
            }
            // populate the client obj
            clientInfo = client._doc;
            callback(null);
          })
            .select(['-_id', '-ownerID', '-sessions', '-isArchived', '-__v'])
            .clone();
        },
        // populate the events list
        (callback) => {
          Event.find(
            {
              clientID,
              date: {
                $gte: start,
                $lte: end,
              },
            },
            { clientID: 0, _id: 0 },
            (err, events) => {
              if (err) {
                return console.error(err);
              }
              console.log(`${events.length} events read from database`);
              eventsList = events;

              if (eventsList.length === 0) {
                console.log('There are no events in the given range of dates.');
                res.status(503).send('There are no events in');
                return;
              }
              // sort the events by date
              eventsList.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

              callback(null);
            }
          )
            .select(['-_id', '-clientID'])
            .clone();
        },
      ],
      (err, result) => {
        console.timeEnd(dbTime);
        // catch error
        if (err) {
          throw err;
        }

        const options = {
          mode: 'text',
          args: [JSON.stringify(providerInfo), JSON.stringify(clientInfo), JSON.stringify(eventsList)],
        };
        // run the statement generator script
        console.time(genTime);
        // console.log("+++   EXCLUDE TEST +++")
        // console.dir(providerInfo)
        // console.log("+++ EXCLUDE TEST CLIENT   +++")
        // console.dir(clientInfo)
        // fs.writeFile('user.json', JSON.stringify(providerInfo, null, 2), err => console.error(err));
        // fs.writeFile('client.json', JSON.stringify(clientInfo, null, 2), err => console.error(err));

        console.log(`${JSON.stringify(clientInfo, null, 2)}`);
        exec(
          `moxie/target/release/moxie '${JSON.stringify(clientInfo)}' '${JSON.stringify(eventsList)}' '${JSON.stringify(
            providerInfo
          )}'`,
          { shell: 'true' },
          (error, stdout, stderr) => {
            if (error) {
              console.error(`exec error: ${error}`);
              return;
            }
            if (stdout) {
              console.log(`stdout: ${stdout}`);
            }
            if (stderr) {
              console.error(`stderr: ${stderr}`);
            }
            try {
              res
                .status(200)
                .download(
                  `public/invoices/statementtest.pdf`,
                  `${`${clientInfo.fname}-${clientInfo.lname}`}.pdf`,
                  (err) => {
                    if (err) return console.error(err);
                    // delete the pdf from the server after download
                    fs.unlink(`public/invoices/statementtest.pdf`, (err) => {
                      if (err) return console.error(err);
                    });
                  }
                );
            } catch (err) {
              throw err;
            }
          }
        );
      }
    );

    // PythonShell.run("Python/src/core/main.py", options, (err, result) => {
    //     if (err) return console.error(err)

    //     console.log("+++++++++++++++++ PYTHON OUTPUT +++++++++++++++++ \n")
    //     console.log(result)
    //     console.log("+++++++++++++++ END PYTHON OUTPUT +++++++++++++++ \n")
    //     console.timeEnd(genTime);
    //     console.log('');
    //     try {
    //         res.status(200).download(`public/invoices/${clientInfo.clientname}.pdf`, `${clientInfo.clientname}.pdf`, function (err) {

    //             if (err) return console.error(err);
    //             // delete the pdf from the server after download
    //             fs.unlink(`public/invoices/${clientInfo.clientname}.pdf`, function (err) {
    //                 if (err) return console.error(err)

    //             });
    //         })
    //     }
    //     catch (err) { throw err; }
    // })
  };

  static downloadStatement = async (req: Request, res: Response) => {
    try {
      res.download(
        `public/invoices/${req.params.clientname}.pdf`,
        `${req.params.clientname} ${req.params.start}-${req.params.end}.pdf`,
        (err) => {
          if (err) return console.error(err);
          // delete the pdf from the server after download
          fs.unlink(`public/invoices/${req.params.clientname}.pdf`, (err) => {
            if (err) return console.error(err);
          });
        }
      );
    } catch (err) {
      throw err;
    }
  };
}