const Client = require('../../models/client-schema');
const Event = require('../../models/event-schema');
const { PythonShell } = require('python-shell');
const fs = require('fs');
const helpers = require('../helpers/helpers');

const renderClientPage = async (req, res) => {
    // TODO: change these to chargeType boolean in the event schema somehow...
    const meetingTypes = ['1:1 Meeting', '3 Way Meeting', '4 Way Meeting', '5 Way Meeting', '6 Way Meeting', '7 Way Meeting']
    const miscTypes = ['Emails', 'Intention Statement', 'Notes', 'Parenting Plan', 'Phone Call', 'Travel Time']

    Client.findById(req.params.id, function(err, client) {
        
        if (err) return console.error(err)

        Event.find({ clientID: req.params.id },  function(err, events) {
           
            if (err) return console.error(err);
    
            res.render('clientpage', { client: client, events: events, meetings: meetingTypes, misc: miscTypes, messages: req.flash('error') })
            
        }).sort({ date: 1 })
    })
}

const addEvent = (req, res) => {
    let time = parseFloat(req.body.hours) + parseFloat(req.body.minutes)
    let amount = 0;
    
    if (req.body.type == 'Retainer') { // need to do something similar for refund type

        amount = req.body.amount;

        } else if(req.body.type == 'Refund') {

            amount = -(req.body.amount);

        } else {

        amount = -(time * req.body.rate)
    
     }

    Client.findOne({ _id: req.params.id }, (err, client) => {

        if (err) return console.error(err);

        const event = new Event({ 
            clientID: req.params.id, 
            date: req.body.date, 
            type: req.body.type, 
            detail: req.body.detail, 
            duration: time, 
            rate: req.body.rate, 
            amount: parseFloat(amount).toFixed(2), newBalance: 0 
        });
        // saving event to db
        event.save(function(err, event) {

        if (err) return console.error(err);

        helpers.recalcBalance(req.params.id);

        console.log('Event added')

        if (!req.body.fromMobile) {
            res.redirect(`/client/${req.params.id}`)
        }

    })})
}

const updateEvent = (req, res) => {
        
    let hrs = parseFloat(req.body.hours)
    let mins = parseFloat(req.body.minutes)
    let duration = hrs + (mins / 10)
    let rate = req.body.rate
    let amount = req.body.type != "Retainer" ? -(duration * rate): req.body.amount;
    let detail = req.body.detail
    let clientID = ''

    try {
        Event.findOneAndUpdate({ _id: req.params.eventid }, { type: req.body.type, duration: duration, rate: rate, amount: amount, detail: detail }, function (err, docs) {

            if (err) return console.error(err)

            clientID = docs.clientID
            //find all events that belong to this client so the new balance can be calculated
            helpers.recalcBalance(clientID);

            res.redirect(`/user/client/${clientID}`)
        })
    } catch (err) { throw err ; }
}

const deleteEvent = (req, res) => {
    try {
        Event.findByIdAndDelete(req.params.eventid, function (err, event) {

            if (err) return console.error(err);
    
            Client.findOneAndUpdate({ _id: req.params.id }, { $inc: { balance: - parseInt(event.amount.toString()) }}, function(err, result) {
                    
                if (err) console.error(err);
    
                else console.log(result);
            })
    
        })
        res.redirect(`/client/${req.params.id}`);

    } catch (err) { throw err ; }
}

const renderEventPage = (req, res) => {
    try{
        Event.findOne({_id: req.params.eventid}, function(err, event) {
        
            if (err) return console.error(err);
            
            console.log(event)
            res.render('eventpage', { event: event });
        });    
    } catch (err) { throw err ; }

}

const makeStatement = async (req, res) => {
    
    let start, end;
    // just need to format the dates for the args and this should work
    // handle automatic date selection 
    if (req.body.currentRadio) {
        if(req.body.currentRadio == "currentMonth") {
            let date = new Date();
            start = new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0];
            end = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString().split('T')[0];
        }
        else if (req.body.currentRadio == "currentYear") {
            let date = new Date();
            start = new Date(date.getFullYear(), 0, 1).toISOString().split('T')[0];
            end = date.toISOString().split('T')[0];
        }
    } else {
            start = req.body.startdate;
            end = req.body.enddate;
    }
    console.log(start, " ", end)
    
    let clientInfo = {  

        clientname: req.params.fname + " " + req.params.lname,
        billingAdd: req.user.street ? req.user.street + ", " + req.user.city + ", " + req.user.state + " " + req.user.zip : "",
        mailingAdd: "", // this isnt handled client side yet 
        phone: req.user.phone
    };

    let providerInfo = {

        name: req.user.nameForHeader ? req.user.nameForHeader: req.user.fname + " " + req.user.lname,
        address: req.user.street + " " + req.user.city + ", " + req.user.state + " " + req.user.zip,
        phone: req.user.phone,
        email: req.user.email,
    }

    let providerArg = JSON.stringify(providerInfo);
    let clientArg = JSON.stringify(clientInfo);
    let eventsArg = await JSON.parse(req.body.events);
    // sort the events by date
    eventsArg.events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    // keep only the events between the given range of dates
    eventsArg.events = eventsArg.events.filter((e) => new Date(e.date).getTime() >= new Date(start).getTime() && new Date(e.date).getTime() <= new Date(end).getTime());
    // check for no events in given range
    if (eventsArg.events.length == 0) {
        console.log("There are no events in the given range of dates.")
        req.flash('error', "There are no events in the given range of dates.");
        return res.redirect(`/client/${req.params.id}`)
    }

    console.log("\nUser Args : \n", clientArg);
    console.log("\nEvents Args : \n", eventsArg.events);

    let options = {
        mode: "text",
        args: [providerArg, clientArg, JSON.stringify(eventsArg)]
    }

    PythonShell.run("Python/src/core/main.py", options, (err, result) => {
        if (err) return console.error(err)

        console.log("++++++++++++++++++++++++++++++++++ \n")
        console.log(result)

        return res.redirect(`/client/${req.params.id}/makestatement/download/${providerInfo.clientname}/${start}/${end}`);

    })
}

const downloadStatement = async (req, res) => {
    try {
        res.download(`public/invoices/${req.params.clientname}.pdf`, `${req.params.clientname} ${req.params.start}-${req.params.end}.pdf`, function (err) {

            if (err) return console.error(err);
            // delete the pdf from the server after download
            fs.unlink(`public/invoices/${req.params.clientname}.pdf`, function (err) {
                if (err) return console.error(err)
    
            });
        })
    } catch (err) { throw err; }
}

module.exports.addEvent = addEvent;
module.exports.updateEvent = updateEvent;
module.exports.deleteEvent = deleteEvent;
module.exports.renderClientPage = renderClientPage;
module.exports.renderEventPage = renderEventPage;
module.exports.makeStatement = makeStatement;
module.exports.downloadStatement = downloadStatement;