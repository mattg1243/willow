const Client = require('../../models/client-schema');
const Event = require('../../models/event-schema');
const { PythonShell } = require('python-shell');
const fs = require('fs');
const helpers = require('../helpers/helpers');

const addEvent = async (req, res) => {
    /* DEBUG LOGS
    console.log("Add event req.body: \n"); 
    console.dir(req.body);
    console.log("----------------------------------------------------------------")
    */
    
    let amount = 0;
    let time = 0;
    let rate = 0;
    
    if (req.body.type == 'Retainer' || req.body.type == 'Payment') {

        amount = parseFloat(req.body.amount);

        } else if(req.body.type == 'Refund') {

            amount = -(req.body.amount);

        } else {

            time = parseFloat(req.body.hours) + parseFloat(req.body.minutes);    
            amount = -(time * parseFloat(req.body.rate));
            rate = parseFloat(req.body.rate);
     }
     console.log("amount:\n", amount)

        const event = await new Event({ 
            clientID: req.body.clientID, 
            date: req.body.date, 
            type: req.body.type, 
            detail: req.body.detail, 
            duration: time, 
            rate: rate, 
            amount: amount, 
            newBalance: 0 
        });
        // saving event to db
        event.save((err, event) => {
        if (err) return console.error(err);
        console.log(event);
       
        Client.findOneAndUpdate({ _id: req.body.clientID }, { $push: { sessions: event }}, (err, result) => {
            if (err) return console.error(err);

            console.log(result);
            console.log('Event added')
            helpers.recalcBalance(req.body.clientID, req, res);
        })
    });
}

const updateEvent = (req, res) => {
    let hrs, mins, duration, rate, amount, detail; 
    // DEBUG LOGS
    /*
    console.log("Update event req.body: \n"); 
    console.dir(req.body);
    console.log("----------------------------------------------------------------")
    */
    if (req.body.type != 'Refund' && req.body.type != 'Retainer' && req.body.type != 'Payment') {
        hrs = parseFloat(req.body.hours)
        mins = parseFloat(req.body.minutes)
        duration = hrs + mins;
        rate = parseFloat(req.body.rate);
        amount = -(duration * rate);
    } else {
        hrs, mins, duration, rate = 0;
        if (req.body.type == 'Refund') {
            // ensure amount is always negative if event is a refund
            amount =  - (Math.abs(req.body.amount));
        } else if (req.body.type == 'Retainer' || req.body.type == 'Payment') {
            // ensure the opposite for a retainer / payment
            amount = Math.abs(parseFloat(req.body.amount));
        }
    }
    
    detail = req.body.detail
    let clientID = ''

    try {
        Event.findOneAndUpdate({ _id: req.params.eventid }, { type: req.body.type, duration: duration, rate: rate, amount: amount, detail: detail }, function (err, docs) {

            if (err) return console.error(err)

            clientID = docs.clientID
            //find all events that belong to this client so the new balance can be calculated
            helpers.recalcBalance(clientID, req, res);
        })
    } catch (err) { throw err ; }
}

const deleteEvent = (req, res) => {
    console.log(req.body);
    try {
        Event.findByIdAndDelete(req.body.eventID, (err, event) => {

            if (err) return console.error(err);
            console.log("Event:\n");
            console.dir(event);
            console.log('\nThe events amount with index:\n' + event.amount['$numberDecimal']);
            Client.findOneAndUpdate({ _id: req.body.clientID }, { $inc: { balance: - event.amount['$numberDecimal'] }}, function(err, result) {
                    
                if (err) console.error(err);
    
                else {console.log(result); helpers.getAllData(req, res);}
            })
        })
    } catch (err) { throw err ; }
}

const makeStatement = async (req, res) => {
    console.log("req.body:\n" + JSON.stringify(req.body));
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
        else if (req.body.currentRadio == "all") {
            let date = new Date();
            start = "1900-01-01";
            end = date.toISOString().split('T')[0];
        }
    } else {
            start = req.body.startdate;
            end = req.body.enddate;
    }
    console.log(start, " ", end)
    
    let clientInfo = {  

        clientname: req.body.client.fname + " " + req.body.client.lname,
        billingAdd: req.body.user.street ? req.body.user.street + ", " + req.body.user.city + ", " + req.body.user.state + " " + req.body.user.zip : "",
        mailingAdd: "", // this isnt handled client side yet 
        phone: req.body.user.phone
    };

    let providerInfo = {

        name: req.body.user.nameForHeader ? req.body.user.nameForHeader: req.body.user.fname + " " + req.body.user.lname,
        address: {
            street: req.body.user.street, 
            cityState: req.body.user.city + ", " + req.body.user.state + " " + req.body.user.zip
        },
        phone: req.body.user.phone,
        email: req.body.user.email,
        paymentInfo: req.body.user.paymentInfo ? req.body.user.paymentInfo: '',
    }

    let providerArg = providerInfo;
    let clientArg = clientInfo;
    let eventsArg = req.body.events;
    // find only the events that belong to the client
    eventsArg = eventsArg.filter(event => event.clientID === req.body.client['_id'])
    // sort the events by date
    eventsArg.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    // keep only the events between the given range of dates
    eventsArg = eventsArg.filter((e) => new Date(e.date).getTime() >= new Date(start).getTime() && new Date(e.date).getTime() <= new Date(end).getTime());
    // check for no events in given range
    if (eventsArg.length == 0) {
        console.log("There are no events in the given range of dates.")
        res.status(503).send("There are no events in");
        return;
    } else {

        console.log("\nUser Args : \n", clientArg);
        console.log("\nEvents Args : \n", eventsArg);
        let options = {
            mode: "text",
            args: [JSON.stringify(providerArg), JSON.stringify(clientArg), JSON.stringify(eventsArg)]
        }

        PythonShell.run("Python/src/core/main.py", options, (err, result) => {
            if (err) return console.error(err)

            console.log("+++++++++++++++++ PYTHON OUTPUT +++++++++++++++++ \n")
            console.log(result)
            console.log("+++++++++++++++ END PYTHON OUTPUT +++++++++++++++ \n")

            try {
                res.status(200).download(`public/invoices/${clientInfo.clientname}.pdf`, `${clientInfo.clientname} ${req.params.start}-${req.params.end}.pdf`, function (err) {
        
                    if (err) return console.error(err);
                    // delete the pdf from the server after download
                    fs.unlink(`public/invoices/${clientInfo.clientname}.pdf`, function (err) {
                        if (err) return console.error(err)
            
                    });
                })
            } catch (err) { throw err; }

        })

    }
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
module.exports.makeStatement = makeStatement;
module.exports.downloadStatement = downloadStatement;