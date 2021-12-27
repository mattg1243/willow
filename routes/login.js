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
}), (req, res) => {

    User.findOne({ username: req.body.username }, (err, user) => {
        if (err) return console.error(err);
        res.json(user);
    })
})

router.post('/native', passport.authenticate('local'), async (req, res) => {
    console.log(req.body);
    const response = getAllData(req);
    if (response) {
        res.json(response);
    } else {
        console.log(response);
        req.flash('error', "Invalid Login")
    }
    
})

module.exports = router;