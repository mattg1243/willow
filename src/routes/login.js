const router = require('express').Router();
const passport = require('passport');
const helpers = require('../utils/helpers');
const { validate, loginUserValidator } = require('./validators/userValidators');
const path = require('path');
require('dotenv').config({path: path.resolve(__dirname, '../../.env')});


router.post('/', 
    loginUserValidator,
    validate,
    passport.authenticate('local'), 
    (req, res) => {
        helpers.getAllData(req, res);
})

module.exports = router;