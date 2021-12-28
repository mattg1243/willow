const User = require("../../models/user-model");
const Client = require("../../models/client-schema");
const Event = require("../../models/event-schema");
const jwt = require('jsonwebtoken');
require('dotenv').config();

function recalcBalance(clientID) {
    
    let balance = 0;
    
    Event.find({ clientID: clientID }, function (err, events) {

        if (err) return console.error(err)
        events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        console.log(events)

        for (let i = 0; i < events.length; i++) {
            balance += parseFloat(events[i].amount.toString())
            
            Event.findOneAndUpdate({ _id: events[i]._id }, { newBalance: balance }, (err) => {
                if (err) console.error(err)
                console.log("balances recalculated")
            });
            // console.log(balance.toFixed(2))
        }

        Client.findOneAndUpdate({ _id: clientID }, { balance: balance }, function (err) {
     
            if (err) return console.error(err)
    
            console.log("---balance updated---")
    
        })
})}

const verifyJWT = async (req, res, next) => {
    // extract token from the req header
    const header = req.headers["authorization"]
    const token = header.split(' ')[1];

    if (!token) {
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

const getAllData = (req, res) => {
    console.log(req);
    // create blank response object to fill with data to send to client
    let response = {
        token: "",
        user: {
            id: '',
            fname: '',
            lname: '',
            email: '',
            nameForHeader: '',
        },
        clients: []
    }
    // first, get the user from the database
    // this is only safe because user has already been authed through passport middleware
    User.findOne({ username: req.body.username }, (err, user) => {
        if (err) { return console.error(err); }
        // fill user object with needed data
        response.user.id = user._id;
        response.user.fname = user.fname;
        response.user.lname = user.lname;
        response.user.email = user.email;
        response.user.nameForHeader = user.nameForHeader;
        // create token from the user ID
        response.token = jwt.sign({userID: user._id}, process.env.JWT_SECRET, { expiresIn: '3600s' })
        // then, populate the client array
        Client.find({ ownerID: user._id }, (err, clients) => {
            if (err) { return console.error(err); }
            
            response.clients = clients

            // finally, populate the events array for each client in the response variable
            for (let i = 0; i < response.clients.length; i++ ) {
                Event.find({ clientID: response.clients[i] }, (err, events) => {
                    if (err) { return console.error(err); }
                    
                    response.clients[i].sessions = events;
                })
            }

            // console.log(response)
            res.json(response);
        })
    })
}

module.exports.recalcBalance = recalcBalance;
module.exports.verifyJWT = verifyJWT;
module.exports.getAllData = getAllData;