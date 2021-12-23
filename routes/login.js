const router = require('express').Router();
const passport = require('passport');
const User = require('../models/user-model');
const Client = require('../models/client-schema');
const Event = require('../models/event-schema');
const jwt = require('jsonwebtoken');
const helpers = require('./helpers/helpers');
require('dotenv').config();

router.get('/', (req, res) => {
    res.render('login', { messages: req.flash('error') })
})

router.post('/', passport.authenticate('local', {
    failureFlash: "Invalid Login",
    failureRedirect: "/login", 
}), (req, res) => {

    res.redirect('/user/dashboard'); }   
)

router.post('/native', passport.authenticate('local'), async (req, res) => {
    console.log(req.body);
    if (req.body.fromMobile == true) { 
        console.log('Mobile login detected');
        console.log(req.headers)

        // create blank response object to fill with data to send to client
        let response = {
            token: "",
            userID: "",
            clients: []
        }
        // first, get the users database ID
        // this is only safe because user has already been authed through passport middleware
        User.findOne({ username: req.body.username }, (err, user) => {
            if (err) { return console.error(err); }

            response.userID = user._id;
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

                console.log(response)
                // send the populated response object to the client
                res.json(response);
            })
        })
    }
})

router.get('/native/secret', helpers.verifyJWT, (req, res) => {
    console.log("--- Secret ---")
})

module.exports = router;