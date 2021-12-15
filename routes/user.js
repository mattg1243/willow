var router = require('express').Router();
var User = require('../models/user-model')
var Client = require('../models/client-schema')
var Event = require('../models/event-schema')
var passport = require('passport');
var connectEnsureLogin = require('connect-ensure-login');
var flash = require('connect-flash');
var spawn = require("child_process").spawn;
var mongoose = require('mongoose');
var moment = require('moment');
var fs = require('fs');
let {PythonShell} = require('python-shell')
const { route } = require('.');
const { update } = require('../models/user-model');
const helpers = require('./helpers/helpers')
const handlers = require('./handlers/userHandlers');
const renderDashboard = require('./handlers/userHandlers');
const addNewClient = require('./handlers/userHandlers');

router.get('/register', function(req, res, next) {
  
    res.render('register');

})


// register new user to DB
router.post('/register/newuser', (req, res) => { registerUser(req, res) })
// render logged in user's dashboard page
router.get('/dashboard', connectEnsureLogin.ensureLoggedIn('/login'), (req, res) => { renderDashboard(req, res) })
// render user preference page
router.get('/preferences', function (req, res) { res.render('preferences', { user: req.user }); })
// update users info from preferences page
router.post("/update-info/:id", (req, res) => { updateUserInfo(req, res) })
// add a new client
router.post('/dashboard/newclient', connectEnsureLogin.ensureLoggedIn(), (req, res) => { addNewClient(req, res) });

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

        const event = new Event({ clientID: req.params.id, date: req.body.date, type: req.body.type, detail: req.body.detail, duration: time, rate: req.body.rate, amount: parseFloat(amount).toFixed(2), newBalance: 0 });
        // saving event to db
        event.save(function(err, event) {

        if (err) return console.error(err);

        helpers.recalcBalance(req.params.id);

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
        let amount = req.body.type != "Retainer" ? -(duration * rate): req.body.amount;
        let detail = req.body.detail
        let clientID = ''
        
        Event.findOneAndUpdate({ _id: req.params.eventid }, { type: req.body.type, duration: duration, rate: rate, amount: amount, detail: detail }, function (err, docs) {

        if (err) return console.error(err)

        clientID = docs.clientID
        //find all events that belong to this client so the new balance can be calculated
        helpers.recalcBalance(clientID);

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

    userArg = JSON.stringify(userInfo);
    eventsArg = JSON.parse(req.body.events);
    // sort the events and filter out the ones we dont need
    eventsArg.events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    eventsArg.events = eventsArg.events.filter((e) => new Date(e.date).getTime() >= new Date(start).getTime() && new Date(e.date).getTime() <= new Date(end).getTime());

    console.log(userArg);
    console.log(eventsArg.events);
    let options = {
        mode: "text",
        args: [start, end, userArg, JSON.stringify(eventsArg)]
    }

    PythonShell.run("Python/src/core/main.py", options, (err, result) => {

        if (err) return console.error(err)

        console.log("++++++++++++++++++++++++++++++++++ \n" + result)
        
        console.log(result)

        res.redirect(`/user/client/${req.params.id}/makestatement/download/${userInfo.clientname}/${start}/${end}`);

    })


    //res.redirect(`/user/client/${req.params.id}/makestatement/download/${clientname}/${start}/${end}`);

})

router.get('/client/:id/makestatement/download/:clientname/:start/:end', function (req, res) {


    res.download(`public/invoices/${req.params.clientname}.pdf`, `${req.params.clientname} ${req.params.start}-${req.params.end}.pdf`, function (err) {

        if (err) return console.error(err);

        
        // delete the pdf from the server after download
        fs.unlink(`public/invoices/${req.params.clientname}.pdf`, function (err) {
            
            if (err) return console.error(err)

        });
    })

})

module.exports = router;
