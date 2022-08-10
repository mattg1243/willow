var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const Event = require('../../models/event-schema');
const Client = require('../../models/client-schema');
const getEventsList = (req, res) => __awaiter(this, void 0, void 0, function* () {
    // save clientID
    const clientID = req.query.clientID;
    // query database for events and send back as json
    try {
        const eventsList = yield Event.find({ clientID: clientID });
        return res.status(200).json(eventsList);
    }
    catch (err) {
        console.error(err);
        return res.status(503).json("Error: " + err);
    }
});
const getClientsList = (req, res) => __awaiter(this, void 0, void 0, function* () {
    // save userID
    const userID = req.query.userID;
    // query database for events and send back as json
    try {
        const clientsList = yield Client.find({ ownerID: userID });
        res.status(200).json(clientsList);
    }
    catch (err) {
        console.error(err);
        return res.status(503).json("Error: " + err);
    }
});
const getEvent = (req, res) => __awaiter(this, void 0, void 0, function* () {
    // save eventID
    const eventID = req.query.id;
    // query database
    try {
        const event = yield Event.findOne({ _id: eventID });
        res.status(200).json(event);
    }
    catch (err) {
        console.error(err);
        return res.status(503).json("Error: " + err);
    }
});
const getClient = (req, res) => __awaiter(this, void 0, void 0, function* () {
    // save clientID
    const clientID = req.query.id;
    // query databse
    try {
        const client = yield Client.findOne({ _id: clientID });
        res.status(200).json(client);
    }
    catch (err) {
        console.error(err);
        return res.status(503).json("Error: " + err);
    }
});
module.exports = {
    getEventsList,
    getClientsList,
    getEvent,
    getClient
};
