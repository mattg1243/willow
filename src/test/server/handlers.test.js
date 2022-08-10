// THIS FILE IS BEING IGNORED

// const loginHandler = require("../../routes/login");
// const userHandlers = require("../../routes/handlers/userHandlers");
// const clientHandlers = require("../../routes/handlers/clientHandlers");
// const assert = require("assert");
// const sinon = require("sinon");
// const httpMocks = require("node-mocks-http");
// const jwt = require("jsonwebtoken");
// const { testUser, testClient, testEvent } = require("../testData");
// require("dotenv").config();
// // create a token to use for authentication
// const token = jwt.sign({ userID: testUser._id }, process.env.JWT_SECRET, {
//   expiresIn: "7200s",
// });

// describe("Route Handlers", () => {
//   it("Updates profile info", () => {
//     const mockRequest = httpMocks.createRequest({
//       method: "POST",
//       header: {
//         authorization: "Bearer " + token,
//         "content-type": "text/json",
//       },
//       url: "/updateinfo",
//       body: {
//         user: testUser._id,
//         nameForHeader: "Matt Gallucci, PhD",
//         phone: "9253301243",
//         email: "mattgallucci97@gmail.com",
//         street: "129 Waverly Ct",
//         city: "Martinez",
//         state: "CA",
//         zip: "94553",
//         paymentInfo: JSON.stringify({
//           check: "",
//           venmo: "mattg1243",
//           paypal: "",
//           zelle: "",
//         }),
//       },
//     });
//     // this object is used to update user info to original state after test
//     const restoreBody = {
//       user: testUser._id,
//       nameForHeader: "Sir Testalot",
//       phone: 1234565555,
//       street: "123 wizard ln",
//       city: "new york",
//       state: "NY",
//       zip: 94553,
//       email: "tester@tester.com",
//       paymentInfo: JSON.stringify({
//         check: "",
//         venmo: "mattg1243",
//         paypal: "",
//         zelle: "",
//       }),
//     };
//     const mockResponse = httpMocks.createResponse();
//     userHandlers.updateUserInfo(mockRequest, mockResponse);
//     assert.equal(mockResponse.statusCode, 200);
//     const restoreRequest = httpMocks.createRequest({
//       method: "POST",
//       header: {
//         authorization: "Bearer " + token,
//         "content-type": "text/json",
//       },
//       url: "/updateinfo",
//       body: restoreBody,
//     });
//     userHandlers.updateUserInfo(restoreRequest, mockResponse);
//     assert.equal(mockResponse.statusCode, 200);
//   });

//   it("Adds a client", () => {
//     const mockRequest = httpMocks.createRequest({
//       method: "POST",
//       headers: {
//         authorization: "Bearer " + token,
//         "content-type": "text/json",
//       },
//       url: "/newclient",
//       body: {
//         user: testUser._id,
//         fname: "Unit",
//         lname: "Tester",
//         phonenumber: "5555555555",
//         email: "asdfasdf@gmail.com",
//       },
//     });

//     const mockResponse = httpMocks.createResponse();
//     userHandlers.addNewClient(mockRequest, mockResponse);
//     assert.equal(mockResponse.statusCode, 200);
//   });

//   it("Adds event and calculates amount properly", () => {
//     // first test to make sure that negative amount events work
//     const mockRequest = httpMocks.createRequest({
//       method: "POST",
//       headers: {
//         authorization: "Bearer " + token,
//         "content-type": "text/json",
//       },
//       url: "/addevent",
//       body: {
//         user: testUser._id,
//         clientID: testClient._id,
//         date: "2022-03-28",
//         type: "Meeting",
//         detail: "test meeting",
//         hours: 2,
//         minutes: 0,
//         rate: 200,
//         amount: 0,
//         newBalance: 0,
//       },
//     });

//     const spy = sinon.spy(console, "log");
//     const mockResponse = httpMocks.createResponse();
//     clientHandlers.addEvent(mockRequest, mockResponse);
//     assert.equal(mockResponse.statusCode, 200);
//     assert(spy.calledWith("amount:\n", -400));

//     // now make sure retainers and payments are being added to balance
//     const paymentBody = {
//       user: testUser._id,
//       clientID: testClient._id,
//       date: "2022-03-28",
//       type: "Retainer",
//       detail: "test meeting",
//       hours: 0,
//       minutes: 0,
//       rate: 150,
//       amount: 1000,
//       newBalance: 0,
//     };
//     const payRequest = httpMocks.createRequest({
//       method: "POST",
//       headers: {
//         authorization: "Bearer " + token,
//         "content-type": "text/json",
//       },
//       url: "/addevent",
//       body: paymentBody,
//     });

//     const payResponse = httpMocks.createResponse();
//     clientHandlers.addEvent(payRequest, payResponse);
//     assert.equal(mockResponse.statusCode, 200);
//     assert(spy.calledWith("amount:\n", 1000));
//   });

//   it("Updates event", () => {
//     const mockRequest = httpMocks.createRequest({
//       method: "POST",
//       headers: {
//         authorization: "Bearer " + token,
//         "content-type": "text/json",
//       },
//       url: `/event/${testEvent._id}`,
//       // body: {
//       //   user: testUser._id,
//       //   clientID: testClient._id,
//       //   date: "2022-03-28",
//       //   type: "Email",
//       //   detail: "test meeting",
//       //   hours: "fail",
//       //   minutes: 0,
//       //   rate: 150,
//       //   amount: 0,
//       //   newBalance: 0,
//       // },
//     });

//     const mockResponse = httpMocks.createResponse();
//     clientHandlers.updateEvent(mockRequest, mockResponse);
//     assert.equal(mockResponse.statusCode, 200);
//   });
// });
