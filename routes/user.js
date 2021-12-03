var router = require('express').Router();
var User = require('../models/user-model')
var Client = require('../models/client-schema')
var Event = require('../models/event-schema')
var passport = require('passport');
var connectEnsureLogin = require('connect-ensure-login');
var spawn = require("child_process").spawn;
var mongoose = require('mongoose');
var moment = require('moment');
var fs = require('fs');
let {PythonShell} = require('python-shell')
const { route } = require('.');
const { update } = require('../models/user-model');

router.get('/register', function(req, res, next) {
  
    res.render('register');

})


// register new user to DB
router.post('/register/newuser', function(req, res, next) {
    
    console.log(req.body);
    
    if (req.body.password == req.body.passwordConfirm) {
    User.register(new User({ username: req.body.username, fname: req.body.fname, lname: req.body.lname, email: req.body.email}), req.body.password, function(err) {
        if (err) {
            console.log('Error while registering user : ', err);
            return next(err);
        } else {
            console.log('User registered');
            res.redirect('/');
        }
    })} else { res.redirect('/user/register'); }
})

router.get('/login', function(req, res, next) {
    res.render('login');
})


router.post('/login', passport.authenticate('local', { failureRedirect: '/user/login', failureFlash: false }), function(req, res) {
    console.log(req.user.fname + " " + req.user.fname + " has logged in");
    res.redirect('/user/dashboard');
})

router.get('/dashboard', connectEnsureLogin.ensureLoggedIn('/user/login'), function(req, res) { 
    
    // res.send(`Welcome ${req.user}! Your session ID is ${req.sessionID} and your session expires in ${req.session.cookie.maxAge}ms<br><br>`)    testing login creds / cookies
    Client.find({ ownerID: req.user['_id'] }, 'fname lname balance', function(err, clients) {
        
        if (err) return console.error(err);
        
        res.render('dashboard', { fname: req.user['fname'], clients: clients})

    });
})

router.get('/preferences', function (req, res) {

    res.render('preferences', { user: req.user });

})

router.post("/update-info/:id", function(req, res) {

    User.findOneAndUpdate({ _id: req.params.id }, { phone: req.body.phone, street: req.body.street, city: req.body.city, state: req.body.state, zip: req.body.zip}, { upsert: true }, function(err, info) {

        if (err) return console.error(err)

        console.log("Info updated : \n" + info)
        res.redirect('/');

    })

})

router.post('/dashboard/newclient', connectEnsureLogin.ensureLoggedIn(), function(req, res) {

    const newClient = new Client({ownerID: req.user['_id'], fname: req.body.fname, lname: req.body.lname, phonenumber: req.body.phonenumber, email: req.body.email, balance: 0}); 
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

router.get("/client/:id", connectEnsureLogin.ensureLoggedIn(), function(req, res) {

    const meetingTypes = ['1:1 Meeting', '3 Way Meeting', '4 Way Meeting', '5 Way Meeting', '6 Way Meeting', '7 Way Meeting']
    const miscTypes = ['Emails', 'Intention Statement', 'Notes', 'Parenting Plan', 'Phone Call', 'Travel Time']
    
    Client.findById(req.params.id, function(err, client) {
        
        if (err) return console.error(err)

        Event.find({ clientID: req.params.id },  function(err, events) {
           
            if (err) return console.error(err);
    
            res.render('clientpage', { client: client, events: events, meetings: meetingTypes, misc: miscTypes })
            
        }).sort({ date: 1 })
    })
});

router.post('/client/:id/addsession', connectEnsureLogin.ensureLoggedIn(), function(req, res){

    let time = parseFloat(req.body.hours) + parseFloat(req.body.minutes)
    let amount = 0;
    
    if (req.body.type == 'Retainer') { // need to do something similar for refund type

        amount = req.body.amount;

        } else if(req.body.type == 'Refund') {

            amount = -(req.body.amount);

        } else {

        amount = -(time * req.body.rate)
    
     }

    Client.findOne({ _id: req.params.id }, function(err, client) {

        if (err) return console.error(err);

        const newBalance = parseFloat(client.balance.toString()) + parseFloat(amount);
        console.log("\n--balance--\n" + newBalance);

        const event = new Event({ clientID: req.params.id, date: req.body.date, type: req.body.type, detail: req.body.detail, duration: time, rate: req.body.rate, amount: parseFloat(amount).toFixed(2), newBalance: newBalance.toFixed(2) });
        event.save(function(err, event) {

        if (err) return console.error(err);

        Client.findOneAndUpdate({ _id: req.params.id }, { $inc: { balance: amount }, $push: { sessions: event._id } }, function(err, result) {
            
        if (err) console.error(err);

        else console.log(result);
        
        })

        console.log('Event added')

        res.redirect(`/user/client/${req.params.id}`)

    })})

})

router.get('/deleteevent/:id/:eventid', connectEnsureLogin.ensureLoggedIn(), function (req, res) {


    Event.findByIdAndDelete(req.params.eventid, function (err, event) {

        if (err) return console.error(err);

        Client.findOneAndUpdate({ _id: req.params.id }, { $inc: { balance: - parseInt(event.amount.toString()) }}, function(err, result) {
                
            if (err) console.error(err);

            else console.log(result);
        })

    })

    res.redirect(`/user/client/${req.params.id}`);

})

router.get('/client/event/:eventid', connectEnsureLogin.ensureLoggedIn(), async function (req, res) {

    Event.findOne({_id: req.params.eventid}, function(err, event) {
        
        if (err) return console.error(err);
        
        console.log(event)
        res.render('eventpage', { event: event });
    });
 

})

router.post('/client/event/:eventid', async function(req, res) {
   
        let hrs = parseFloat(req.body.hours)
        let mins = parseFloat(req.body.minutes)
        let duration = hrs + (mins / 10)
        let rate = req.body.rate
        let amount = -(duration * rate)
        let detail = req.body.detail
        let balance = 0
        let clientID = ''
    // these all need be ASYNC, not working because everything is trying to execute at once 
    // for this function, thinking of passing it an object with all required params which is a lot... might not need it tho if called in this scope
    // need to add support for refund and retainer types
    console.log("duration = " + duration)
        
        Event.findOneAndUpdate({ _id: req.params.eventid }, { type: req.body.type, duration: duration, rate: rate, amount: amount, detail: detail }, function (err, docs) {

        if (err) return console.error(err)

        clientID = docs.clientID
        console.log(docs.clientID)

        //find all events that belong to this client so the new balance can be calculated

        Event.find({ clientID: docs.clientID }, function (err, docs) {

            if (err) return console.error(err)

            console.log(docs)

            for (let i = 0; i < docs.length; i++) {
                balance += parseFloat(docs[i].amount.toString())
                console.log(balance.toFixed(2))
            }

            Client.findOneAndUpdate({ _id: clientID }, { balance: balance }, function (err, client) {
         
                if (err) return console.error(err)
        
                console.log("---balance updated---")
        
            })
        })
        res.redirect(`/user/client/${clientID}`)
    })
})



router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/user/login');
})


router.post('/client/:id/makestatement/:fname/:lname', (req, res) => {

    const start = req.body.startdate;
    const end = req.body.enddate;
    let userArg;
    
    let userInfo = {  

        clientname: req.params.fname + " " + req.params.lname,
        billingAdd: req.user.street ? req.user.street + ", " + req.user.city + ", " + req.user.state + " " + req.user.zip : "",
        mailingAdd: "", // this isnt handled client side yet 
        phone: req.user.phone

    };

    userArg = JSON.stringify(userInfo)

    console.log(userArg)
    let options = {
        mode: "text",
        args: [start, end, userArg, req.body.events]
    }

    PythonShell.run("Python/tests/src/bin/main.py", options, (err, result) => {

        if (err) return console.error(err)

        console.log("++++++++++++++++++++++++++++++++++ \n" + result)
        
        console.log(result)

        res.redirect(`/user/client/${req.params.id}/makestatement/download/${userInfo.clientname}/${start}/${end}`);

    })


    //res.redirect(`/user/client/${req.params.id}/makestatement/download/${clientname}/${start}/${end}`);

})

router.get('/client/:id/makestatement/download/:clientname/:start/:end', function (req, res) {


    res.download(`/app/public/invoices/${req.params.clientname}.pdf`, `${req.params.clientname} ${req.params.start}-${req.params.end}.pdf`, function (err) {

        if (err) return console.error(err);

        
        // delete the pdf from the server after download
        fs.unlink(`/app/public/invoices/${req.params.clientname}.pdf`, function (err) {
            
            if (err) return console.error(err)

        });
    })

})

module.exports = router;
