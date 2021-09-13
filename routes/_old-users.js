var express = require('express');
var router = express.Router();
var passport = require('passport')
const User = require('../models/user-model')

/* GET users listing. */
router.get('/', function(req, res) {
  
  res.render('index', {user: req.user}) 

});



router.get('/register', function(req, res, next) {
  
  res.render('register', {});
  
})

router.post('/register', function (req, res) {
  
  console.log('Registering user, please wait : ')

  User.register(new User({username: req.body.username, fname: req.body.fname, lname: req.body.lname, email: req.body.email}), req.body.password, function(err) {
    if (err) {
        console.log('Error registering user : ', err)
        return next(err);
    }
    
    console.log('done');

    res.redirect('/');
  })});

router.get('/:id', function (req, res, next) {

})

router.get('/client', function(req, res, next) {
  res.send("Heres your clients")
})

module.exports = router;
