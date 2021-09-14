var router = require('express').Router();
var User = require('../models/user-model')
var Client = require('../models/client-schema')
var passport = require('passport');
var connectEnsureLogin = require('connect-ensure-login');
var mongoose = require('mongoose');
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
        res.render('dashboard', { fname: req.user['fname'], clients: clients })
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

        console.log(client)
        res.render('clientpage', { client: client })

    })
});

router.post('addsession/:date:type:time:rate', function(req, res){
    res.send(req.params)
})


module.exports = router;
