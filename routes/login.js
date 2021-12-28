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
}), async (req, res) => {
    
    helpers.getAllData(req, res);
})

router.post('/native', passport.authenticate('local'), async (req, res) => {
    console.log(req.body);
    const response = helpers.getAllData(req);
    if (response) {
        helpers.getAllData(req, res);
    } else {
        console.log(response);
        req.flash('error', "Invalid Login")
    }
    
})

module.exports = router;