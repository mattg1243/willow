import { Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import async from 'async';
import fs from 'fs';
import { ObjectId } from 'mongodb';
import User from '../models/user-model';
import Client from '../models/client-schema';
import Event, { IEvent } from '../models/event-schema';
import Generator from '../utils/Generator';
import { IMakeStatementReqBody } from './reqTypes';
import { IFormatStringArg } from '../utils/Generator';

// TODO: seperate this into a ClientHandler class and an EventHandler class
export default class ClientHandlers {
  static getClient = async (req: Request, res: Response) => {
    const id = req.query.id;
    const isValidObjectID = ObjectId.isValid(id as string);
    if (!id) {
      return res.status(400).json({ message: 'No client id provided with request' });
    } else if (!isValidObjectID) {
      return res.status(402).json({ message: 'Client id param is not valid type ObjectID' });
    }
    try {
      const clientQuery = await Client.findOne({ _id: id });
      console.log(clientQuery);
      return res.status(200).json({ client: clientQuery.toJSON() });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'An error occurred getting client data', err });
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
      balance: string;
      rate: number | string;
    }

    interface IProviderInfo extends base {
      nameForHeader: string;
      street?: string;
      city?: string;
      state?: string;
      zip?: string;
      phone: string;
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
    // outline argument objects
    let clientInfo: IClientInfo;
    let providerInfo: IProviderInfo;
    // read from the database
    console.time(dbTime);
    console.log(req.body);
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
      async (err, result) => {
        console.timeEnd(dbTime);
        // catch error
        if (err) {
          throw err;
        }
        // check if user is displaying their address
        let address: string = '';
        let cityStateZip: string = '';
        if (providerInfo.city && providerInfo.state && providerInfo.zip) {
          cityStateZip = providerInfo.city + ', ' + providerInfo.state + ' ' + providerInfo.zip;
        }
        if (providerInfo.street) {
          address = providerInfo.street;
        }
        // create arg object for the Generator
        const argObj: IFormatStringArg = {
          date: new Date(),
          userName: providerInfo.fname + ' ' + providerInfo.lname,
          userAddress: address,
          userCityStateZip: cityStateZip,
          userPhone: providerInfo.phone,
          userLicense: providerInfo.license,
          clientName: clientInfo.fname + ' ' + clientInfo.lname,
          clientBalance: `$${parseFloat(clientInfo.balance).toFixed(2)}`,
          amountDue: amountInput ? amountInput : null,
          note: notesInput ? notesInput : null,
          paymentMethods: providerInfo.paymentInfo,
          events: eventsList,
        };
        // TODO: instead of writing HTML file, pass the generator the raw HTML string
        // create html template
        const outputFilename = `${clientInfo.fname + '-' + clientInfo.lname}`;
        const g = new Generator();
        const htmlStr = g.formatString(argObj);
        // create the pdf
        try {
          await g.makePdfFromHtml(htmlStr, outputFilename);

          res.status(200).download(`public/invoices/${outputFilename}.pdf`, `${outputFilename}.pdf`, function (err) {
            if (err) return console.error(err);
            // delete the file from the server after download
            fs.unlink(`public/invoices/${outputFilename}.pdf`, function (err) {
              if (err) return console.error(err);
            });
          });
        } catch (err) {
          throw err;
        }
      }
    );
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
