var router = require('express').Router();
var User = require('../models/user-model')
var Client = require('../models/client-schema')
var Event = require('../models/event-schema')
var passport = require('passport');
var connectEnsureLogin = require('connect-ensure-login');
var mongoose = require('mongoose');
var moment = require('moment')
const { route } = require('.');

router.get('/register', function(req, res, next) {
  
    res.render('register');

})


// register new user to DB
router.post('/register/newuser', function(req, res, next) {
    
    console.log(req.body);
    
    User.register(new User({ username: req.body.username, fname: req.body.fname, lname: req.body.lname, email: req.body.email}), req.body.password, function(err) {
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
    Client.find({ ownerID: req.user['_id'] }, 'fname lname', function(err, clients) {
        console.log(clients); // clients is an array of the doc objects
        res.render('dashboard', { fname: req.user['fname'], clients: clients})
    });
})

router.post('/dashboard/newclient', function(req, res) {

    const newClient = new Client({ownerID: req.user['_id'], fname: req.body.fname, lname: req.body.lname, phonenumber: req.body.phonenumber, email: req.body.email}); 
    console.log(newClient);
    newClient.save(function(err, client) {
       
        if (err) return console.error(err);
        
        console.log(client.fname + ' added as a client to ' + req.user['_id'])
        User.findOneAndUpdate({ _id: req.user['_id'] }, { $push: { clients: client['_id'] } })
        .populate('clients').exec(function(err, clients) {
            console.log("Clients added : " + clients)
        })
        res.redirect('/user/dashboard');

})});

router.get("/client/:id", function(req, res) {

    Client.findById(req.params.id, function(err, client) {
        
        if (err) return console.error(err)

        Event.find({ clientID: req.params.id }, function(err, events) {
           
            if (err) return console.error(err);
    
            console.log(client)
            console.log(events)
            res.render('clientpage', { client: client, events: events })
        })
    })
});

router.post('/client/:id/addsession', function(req, res){

    const event = new Event({ clientID: req.params.id, date: req.body.date, type: req.body.type, duration: req.body.time, rate: req.body.rate, amount: (req.body.time * req.body.rate).toFixed(2) });
    event.save(function(err) {

        if (err) return console.error(err);
        console.log(event)
        console.log('Event added')
        res.redirect('/user/dashboard')

    })

    //event.save(function(err, event) {
        
        //if (err) return console.error(err);


    //})
})

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
})




module.exports = router;
