const router = require('express').Router();
const passport = require('passport');
const helpers = require('./helpers/helpers');
require('dotenv').config();

router.post('/', passport.authenticate('local'), async (req, res) => {
    helpers.getAllData(req, res);
})

module.exports = router;