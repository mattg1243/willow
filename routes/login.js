const router = require('express').Router();
const passport = require('passport');
const helpers = require('./helpers/helpers');
const validators = require('./validators/userValidators');
require('dotenv').config();


router.post('/', validators.loginUserValidator, 
passport.authenticate('local'), 
async (req, res) => {
    helpers.getAllData(req, res);
})

module.exports = router;