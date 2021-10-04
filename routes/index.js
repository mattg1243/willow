var express = require('express');
var router = express.Router();
var passport = require('passport');
var connectEnsureLogin = require('connect-ensure-login');

/* GET home page. */
router.get('/', function(req, res, next) {

  if (req.isAuthenticated) {
    res.redirect('user/dashboard')
  }
  
  else if (!req.isAuthenticated) {
  
    res.redirect('user/login')
  
  }

});



module.exports = router;
