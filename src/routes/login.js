const router = require('express').Router();
const passport = require('passport');
const helpers = require('../utils/helpers');
const { validate, loginUserValidator } = require('./validators/userValidators');
require('dotenv').config();


router.post('/', 
    loginUserValidator,
    validate,
    passport.authenticate('local'), 
    (req, res) => {
        helpers.getAllData(req, res);
})

module.exports = router;