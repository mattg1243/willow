import * as jwt from 'jsonwebtoken';
import User, { IPaymentInfo } from '../models/user-model';
import Client, { IClient } from '../models/client-schema';
import Event, { IEvent } from '../models/event-schema';

// interfaces and types
interface IUserReturnVal {
  id: string;
  fname: string;
  lname: string;
  email: string;
  nameForHeader: string;
  phone: string;
  street: string;
  zip: string;
  state: string;
  city: string;
  paymentInfo: IPaymentInfo;
  license: string;
}

type GetAllDataArg = { _id: string } | { username: string };
type GetAllDataReturn = {
  token: string;
  user: IUserReturnVal;
  clients: Array<IClient>;
  events: Array<IEvent>;
};
// main module class
export default class DatabaseHelpers {
  // returns the clients total balance and an updated
  // list of events in the form of a Mongoose BulkWrite object
  static recalcBalance = async (clientID: string) => {
    let events: IEvent[];
    try {
      events = await Event.find({ clientID });
    } catch (err) {
      return Promise.reject(err);
    }
    let clientBalance = 0;
    // sort the events by date
    events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const updatedEventsBulkWrite = [];
    // do the calculations and write the query
    for (let i = 0; i < events.length; i++) {
      if (Number.isNaN(events[i].amount)) {
        throw new Error(`NaN amount found in event${i}`);
      }
      clientBalance += parseFloat(events[i].amount as string);
      updatedEventsBulkWrite.push({
        updateOne: {
          filter: { _id: events[i]._id },
          update: { newBalance: clientBalance },
        },
      });
    }
    // update the database accordingly
    try {
      await Client.findOneAndUpdate({ _id: clientID }, { balance: clientBalance }, { upsert: true });
      await Event.bulkWrite(updatedEventsBulkWrite);
      return Promise.resolve();
    } catch (err) {
      console.error(err);
      return Promise.reject(err);
    }
  };

  // get all the users data on login
  static getAllData = async (query: GetAllDataArg): Promise<GetAllDataReturn> => {
    // console.log("query: ", query);
    // create blank response object to fill with data to send to client
    let user;
    let clients;
    let events: Array<IEvent>;
    const response: GetAllDataReturn = {
      token: '',
      user: {
        id: '',
        fname: '',
        lname: '',
        email: '',
        nameForHeader: '',
        phone: '',
        street: '',
        zip: '',
        state: '',
        city: '',
        paymentInfo: {
          check: '',
          paypal: '',
          venmo: '',
          zelle: '',
        },
        license: '',
      },
      clients: [],
      events: [],
    };
    // get the user from the database
    // this is only safe because user has already been authenticated through passport middleware
    try {
      user = await User.findOne(query);
      clients = await Client.find({ ownerID: user._id });
      // create an array of all clients belonging to the user to query events
      const clientIDs = [];
      for (let i = 0; i < clients.length; i++) {
        clientIDs.push(clients[i]._id);
      }
      events = await Event.find({ clientID: { $in: clientIDs } });
    } catch (err) {
      console.error(err);
      return Promise.reject(err);
    }
    // fill user object with needed data
    response.user.id = user._id;
    response.user.fname = user.fname;
    response.user.lname = user.lname;
    response.user.email = user.email;
    response.user.nameForHeader = user.nameForHeader;
    response.user.phone = user.phone;
    response.user.street = user.street;
    response.user.zip = user.zip;
    response.user.state = user.state;
    response.user.city = user.city;
    response.user.paymentInfo = user.paymentInfo;
    response.user.license = user.license;
    response.clients = clients;
    response.events = events;
    // create token from the user ID
    response.token = jwt.sign({ userID: user._id }, process.env.JWT_SECRET, {
      expiresIn: '365d',
    });
    return Promise.resolve(response);
  };

  static getClients = async (userID: string): Promise<Array<typeof Client>> => {
    try {
      const clients: Array<typeof Client> = await Client.find({ ownerID: userID });
      return Promise.resolve(clients);
    } catch (err) {
      return Promise.reject(err);
    }
  };

  static deleteOldEvents = async (clientID: string) => {
    try {
      const events = await Event.find({ clientID });
      await Client.findOneAndUpdate({ _id: clientID }, { sessions: events });
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    }
  };
}

// const eventsTestArray = [
//   {
//     _id: '615deef8ba5a3fd20e73ba4a',
//     clientID: '615906b29aae28b057b7f48e',
//     date: '2021-10-01T00:00:00.000Z',
//     type: 'Meeting',
//     duration: 1.5,
//     rate: 200,
//     amount: '-300.00',
//     newBalance: '-300.00',
//     __v: 0,
//     detail: 'undefined',
//     id: '615deef8ba5a3fd20e73ba4a',
//   },
//   {
//     _id: '615f43b61296ea56ee2cb6ee',
//     clientID: '615906b29aae28b057b7f48e',
//     date: '2021-10-06T00:00:00.000Z',
//     type: '4 Way Meeting',
//     duration: 1,
//     rate: 200,
//     amount: '-200.00',
//     newBalance: '-500.00',
//     __v: 0,
//     id: '615f43b61296ea56ee2cb6ee',
//   },
//   {
//     _id: '61d9dcf9369007bb8ce03aec',
//     clientID: '615906b29aae28b057b7f48e',
//     date: '2022-01-08T00:00:00.000Z',
//     type: 'Meeting',
//     detail: '1:1',
//     duration: 1,
//     rate: 200,
//     amount: '-200.00',
//     newBalance: '-4552.50',
//     __v: 0,
//     id: '61d9dcf9369007bb8ce03aec',
//   },
//   {
//     _id: '61d9de2b6b4e7b0aa2a539a5',
//     clientID: '615906b29aae28b057b7f48e',
//     date: '2021-12-01T00:00:00.000Z',
//     type: 'Meeting',
//     detail: 'x',
//     duration: 1,
//     rate: 200,
//     amount: '-200.00',
//     newBalance: '-700.00',
//     __v: 0,
//     id: '61d9de2b6b4e7b0aa2a539a5',
//   },
//   {
//     _id: '61d9de3e6b4e7b0aa2a539b4',
//     clientID: '615906b29aae28b057b7f48e',
//     date: '2021-12-02T00:00:00.000Z',
//     type: 'Meeting',
//     detail: 'c',
//     duration: 1,
//     rate: 200,
//     amount: '-200.00',
//     newBalance: '-900.00',
//     __v: 0,
//     id: '61d9de3e6b4e7b0aa2a539b4',
//   },
// ];
