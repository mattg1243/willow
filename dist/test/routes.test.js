/*
  The tests in this file simulate a basic user flow of the app
  but DOES not test logging in, hence the JWT generation, or registering
  a user. These test are run automatically upon merging with main through
  GitHub actions as part of the CI/CD pipeline
*/
const request = require("supertest");
const app = require("../app");
const { testUser, testClient, testEvent } = require("./testData");
const { before } = require("mocha");
const jwt = require("jsonwebtoken");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, '../../.env') });
// auth params
let token, client_id, event_id;
describe("User Routes", () => {
    before("Sign the JWT", (done) => {
        // create a new token for every test
        token = jwt.sign({ userID: testUser._id }, process.env.JWT_SECRET, {
            expiresIn: "7200s",
        });
        done();
    });
    it("updates user info", (done) => {
        request(app)
            .post("/user/updateinfo")
            .set("Authorization", "Bearer " + token)
            .send({
            user: testUser._id,
            nameForHeader: "Matt Gallucci, PhD",
            phone: "9253301243",
            email: "mattgallucci97@gmail.com",
            street: "129 Waverly Ct",
            city: "Martinez",
            state: "CA",
            zip: "94553",
            paymentInfo: JSON.stringify({
                check: "",
                venmo: "mattg1243",
                paypal: "",
                zelle: "",
            }),
        })
            .expect(200, done);
    });
    it("adds new clients", (done) => {
        request(app)
            .post("/user/newclient")
            .set("Authorization", "Bearer " + token)
            .send({
            user: testUser._id,
            fname: "client",
            lname: "klein",
            email: "clientklein@gmail.com",
            phonenumber: 5555555555,
            rate: 200,
        })
            .end((err, response) => {
            if (err) {
                return done(err);
            }
            try {
                client_id = JSON.parse(response.text)[0]["_id"];
                done();
            }
            catch (e) {
                done(e);
            }
        });
    });
    it("updates clients info", (done) => {
        request(app)
            .post("/user/updateclient")
            .set("Authorization", "Bearer " + token)
            .send({
            user: testUser._id,
            clientID: client_id,
            fname: "iamtest",
            lname: "update",
            email: "updatedemail@gmail.com",
            rate: 250,
            phone: 7777777777,
        })
            .expect(200, done);
    });
    it("adds new events", (done) => {
        request(app)
            .post(`/client/${testClient._id}/addevent`)
            .set("Authorization", "Bearer " + token)
            .send({
            clientID: client_id,
            user: testUser._id,
            date: "2022-08-02",
            type: "Meeting",
            detail: "",
            hours: 2,
            minutes: 0,
            rate: 200,
            amount: 0,
            newBalance: 0,
        })
            .end((err, response) => {
            if (err) {
                return done(err);
            }
            try {
                event_id = JSON.parse(response.text)["events"][0]["_id"];
                done();
            }
            catch (e) {
                done(e);
            }
        });
    });
    it("updates events", (done) => {
        request(app)
            .post(`/client/event/${event_id}`)
            .set("Authorization", "Bearer " + token)
            .send({
            clientID: client_id,
            user: testUser._id,
            date: "2022-08-02",
            type: "Meeting",
            detail: "",
            hours: 2,
            minutes: 0,
            rate: 125,
            amount: 0,
            newBalance: 0,
        })
            .expect(200, done);
    });
    it("deletes events", (done) => {
        request(app)
            .post("/client/deleteevent")
            .set("Authorization", "Bearer " + token)
            .send({
            clientID: client_id,
            eventID: event_id,
            user: testUser._id,
        })
            .expect(200, done);
    });
    it("deletes clients", (done) => {
        request(app)
            .post("/user/deleteclient")
            .set("Authorization", "Bearer " + token)
            .send({
            user: testUser._id,
            clientID: client_id,
        })
            .expect(200, done);
    });
});
