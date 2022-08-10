var express = require('express');
var router = express.Router();
var passport = require('passport');
var connectEnsureLogin = require('connect-ensure-login');
router.get('/', function (req, res) {
    if (req.isAuthenticated) {
        res.redirect('/user/dashboard');
    }
    else if (!req.isAuthenticated) {
        res.redirect('/login');
    }
});
module.exports = router;
