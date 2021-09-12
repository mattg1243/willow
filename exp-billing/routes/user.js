const express = require('express');
var router = require('express').Router();
const User = require('../models/user-model')
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportLocalMongoose = require('passport-local-mongoose')
const Schema = mongoose.Schema;
const connectEnsureLogin = require('connect-ensure-login');

router.get('/register', function(req, res, next) {
  res.render('register');
})


// register new user to DB
router.post('/register/newuser', function(req, res, next) {
    
    console.log(req.body);
    
    User.register(new User({username: req.body.username, fname: req.body.fname, lname: req.body.lname, email: req.body.email}), req.body.password, function(err) {
        if (err) {
            console.log('Error while registering user : ', err);
            return next(err);
        }

        console.log('User registered');
        res.redirect('/');
    })
})

router.get('/login', function(req, res, next) {
    res.render('login');
})


router.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: false }), function(req, res) {
    console.log(req.user);
    res.redirect('dashboard');
})

router.get('/dashboard', connectEnsureLogin.ensureLoggedIn(), function(req, res) { 
    
    // res.send(`Welcome ${req.user}! Your session ID is ${req.sessionID} and your session expires in ${req.session.cookie.maxAge}ms<br><br>`)    testing login creds / cookies
    res.render('dashboard', { fname: req.user['fname'] })

})

router.post('/dashboard/newclient', function(req, res) {
    
})


module.exports = router;
