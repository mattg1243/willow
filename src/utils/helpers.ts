import User from "../models/user-model";
import Client from "../models/client-schema";
import Event from "../models/event-schema";
import jwt from 'jsonwebtoken';
import path from 'path';

export function recalcBalance(clientID, req, res) {
    let balance = 0;
    
    Event.find({ clientID: clientID }, function (err, events) {

        if (err) return console.error(err)
        events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        console.log(events)

        for (let i = 0; i < events.length; i++) {
            if (isNaN(events[i].amount)) {
                throw new Error("NaN amount found in event" + i);
            };
            balance += events[i].amount
            
            Event.findOneAndUpdate({ _id: events[i]._id }, { newBalance: balance }, (err) => {
                if (err) console.error(err)
                console.log("balances recalculated")
            });
            // console.log(balance.toFixed(2))
        }

        Client.findOneAndUpdate({ _id: clientID }, { balance: balance, sessions: events }, { upsert: true }, function (err) {
     
            if (err) return console.error(err)
    
            console.log("---balance updated---")
            getAllData(req, res)
        })
})}

export const verifyJWT = async (req, res, next) => {                               // this needs to moved to middleware
    // extract token from the req header
    console.log("Token:\n" + req.header('Authorization'));
    const token = req.header('Authorization').split(' ')[1];

    if (!token || token == 'undefined') {
        res.status(401).send("No token found");
    } else {
        try {
            jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
                if (err) {
                    res.status(401).send(err);
                } else {
                    console.log(decoded);
                    req.userID = decoded.userID;
                    next();
                }
            });
        } catch (err) {
            res.send("Error");
        }
    }
}

export const getAllData = (req, res) => {
    // create blank response object to fill with data to send to client
    console.log("user:\n", req.body.user)
    let response = {
        token: "",
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
            paymentInfo: {},
            license: '',
        },
        clients: [],
        events: [],
    }
    let query;
    // check if this request is coming from a login action or 
    // a refresh action and create the DB query accordingly
    if (req.body.user) {
        query = { _id: req.body.user}
    } else {
        query = { username: req.body.username}
    }
    console.log("Query:\n", query)
    // get the user from the database
    // this is only safe because user has already been authenticated through passport middleware
    User.findOne(query, (err, user) => {
        if (err) { return console.error(err); }
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
        // create token from the user ID
        response.token = jwt.sign({userID: user._id}, process.env.JWT_SECRET, { expiresIn: '3600s' })
        // then, populate the client array
        Client.find({ ownerID: user._id }, (err, clients) => {
            if (err) { return console.error(err); }
            
            response.clients = clients
            // create an array of all clients belonging to the user to query events
            let clientIDs = [];
            for (let i = 0; i < clients.length; i++) {
                clientIDs.push(clients[i]._id)
            }
            // find all events that belong to the users clients
            Event.find({ clientID: { $in: clientIDs } }, (err, events) => {
                if (err) { return console.error(err); }
                
                response.events = events;
                // send the data!
                return res.status(200).json(response);
            })
        })
    }).clone();
}

export const getClients = (req, res) => {
    Client.find({ ownerID: req.body.user }, (err, clients) => {
        if (err) return console.error(err);

        res.status(200).json(clients);
    }).clone();
}

export const getEvents = (req, res) => {
    Event.find({ clientID: req.body.clientID }, (err, events) => {
        if (err) return console.error(err);

        res.status(200).json(events);
    }).clone();
}