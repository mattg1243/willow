import { expect } from 'chai';
import DatabaseHelpers from '../src/utils/databaseHelpers';
import Event from '../src/models/event-schema';
import { testUser, testClient } from './testData';
import Client from '../src/models/client-schema';
// WIP
// tests for all static methods belonging to the DatabaseHelpers class
describe("DatabaseHelper Methods", () => {
  // this tests only the client balance and NOT the events newBalance fields for now
  describe("Recalculates balances of client and events properly", () => {
    it("on new event", async (done) => {
      // let startingBalance: number, endingBalance: number;
      // try {
      //   // get the clients balance before adding the test events
      //   let client = await Client.findOne({ _id: testClient._id });
      //   startingBalance = client.balance;
      //   const event = new Event({
      //     clientID: testClient._id,
      //     date: '2022-08-02',
      //     type: 'Retainer',
      //     detail: '',
      //     hours: 0,
      //     minutes: 0,
      //     rate: 250,
      //     amount: 1000,
      //     newBalance: 0
      //   })
      //   const newEventID = event._id;
      //   await event.save();
      //   await DatabaseHelpers.recalcBalance(testClient._id);
      //   const newClient = await Client.findOne({ _id: testClient._id });
      //   if (newClient === null) {
      //     throw new Error;
      //   }
      //   endingBalance = newClient.balance;
      //   expect(endingBalance).to.equal(startingBalance + 1000);
      //   done();
      // } catch(e) {
      //   done(e);
      // }
      done();
    })
    it("on deleting events", (done) => {
      done();
    })
    it("on update events", (done) => {
      done();
    })
  })
  it("Retrieves all user data", (done) => {
    done();
  })
  it("Gets list of clients", (done) => {
    done();
  })
  it("Gets list of events", (done) => {
    done();
  })
})