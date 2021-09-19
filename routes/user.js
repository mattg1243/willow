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

    const newClient = new Client({ownerID: req.user['_id'], fname: req.body.fname, lname: req.body.lname, phonenumber: req.body.phonenumber, email: req.body.email, balance: 0}); 
    console.log(newClient);
    newClient.save(function(err, client) {
       
        if (err) return console.error(err);
        
        console.log(client.fname + ' added as a client to ' + req.user['_id'])
        User.findOneAndUpdate({ _id: req.user['_id'] }, { $push: { clients: client['_id'] } })
        .populate('clients').exec(function(err, clients) {
            
            if(err) return console.error(err);
            
            console.log("Clients added : " + clients)
        })
        
        res.redirect(`/user/client/${client._id}`);

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

    const time = parseFloat(req.body.hours) + parseFloat(req.body.minutes)
    
    const event = new Event({ clientID: req.params.id, date: req.body.date, type: req.body.type, duration: time, rate: req.body.rate, amount: time * req.body.rate });
    event.save(function(err, event) {

        if (err) return console.error(err);
        
        let amount = 0;

        if (req.body.type == 'retainer') { // need to do something similar for refund type

            event.amount = req.body.amount;
            const amount = req.body.amount;

            } else {

            amount = -(event['duration'] * event['rate'])
        
         }

         Client.findOneAndUpdate({ _id: req.params.id }, { $inc: { balance: amount }}, function(err, result) {
                
            if (err) console.error(err);

            else console.log(result);
        })

        console.log(event)
        console.log('Event added')

        res.redirect(`/user/client/${req.params.id}`)
        
    })
})

router.get('/client/:id/deleteevent/:eventid', function (req, res) {

    // need to go and change the amounts inc in the balance to be either positive or negative to be able to undo them

    Event.findByIdAndDelete(req.params.eventid, function (err, event) {

        if (err) return console.error(err);

        Client.findOneAndUpdate({ _id: req.params.id }, { $inc: { balance: event.amount }}, function(err, result) {
                
            if (err) console.error(err);

            else console.log(result);
        })

    })

    res.redirect(`/user/client/${req.params.id}`);

})



router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
})




module.exports = router;