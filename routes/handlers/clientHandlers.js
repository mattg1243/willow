const User = require('../../models/user-model');
const Client = require('../../models/client-schema');
const Event = require('../../models/event-schema');
const { PythonShell } = require('python-shell');
const { exec } = require('child_process');
const async = require('async');
const fs = require('fs');
const helpers = require('../../utils/helpers');
const UserHelpers = require('../../utils/userHelpers');

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
        
        
        try {
            // saving event to db
            await event.save();
            await Client.findOneAndUpdate({ _id: req.body.clientID }, { $push: { sessions: event }})
            // get events to recalculate the running balances for each event
            await UserHelpers.recalcBalance(req.body.clientID);
            const response = await UserHelpers.getAllData({ _id: req.body.user });
            return res.status(200).json(response);
        } catch (err) {
            console.error(err);
            return res.status(503).json({ error: err});
        }
        
}

const updateEvent = async (req, res) => {
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

    try {
        await Event.findOneAndUpdate(
            { _id: req.params.eventid }, 
            { type: req.body.type, duration: duration, rate: rate, amount: amount, detail: detail }
        );
        await UserHelpers.recalcBalance(req.body.clientID);
        const response = await UserHelpers.getAllData({ _id: req.body.user });
        return res.status(200).json(response);
    } catch (err) { return res.status(503).json(err); }
}

const deleteEvent = (req, res) => {
    console.log(req.body);
    try {
        // only using a callback here in order to access the deleted events amount
        Event.findByIdAndDelete(req.body.eventID, async (err, event) => {
            if (err) throw err;

            await Client.findOneAndUpdate({ _id: req.body.clientID }, { $inc: { balance: - event.amount }});
            await UserHelpers.recalcBalance(req.body.clientID);
            const response = await UserHelpers.getAllData({ _id: req.body.user });
            return res.status(200).json(response);
        })
    } catch (err) { 
        return res.status(503).json({ error: err })    
    }
}

const makeStatement = (req, res) => {
    // parse the request
    const start = new Date(req.params.start).toISOString();
    const end = new Date(req.params.end).toISOString();
    const userID = req.params.userid;
    const clientID = req.params.clientid;
    const amountInput = req.body.amount;
    const notesInput = req.body.notes;
    let eventsList;
    // timing labels
    const dbTime = "Time in database: ";
    const genTime = "Time in generator script: ";
    
    // outline argument objects
     let clientInfo = {  

    //     clientname,
    //     billingAdd,
    //     mailingAdd: "",  this isnt handled client side yet 
    //     phone
     };

     let providerInfo = {

    //     name,
    //     address: {
    //         street,
    //         cityState,
    //     phone,
    //     email,
    //     paymentInfo
    }
    // read from the database
    console.time(dbTime);
    async.parallel([
        // populate client object
        (callback) => {
            User.findById(`${userID}`, (err, user) => {
                if (err) { return console.error(err); }
                // populate the provider obj
                providerInfo = user._doc;
                callback(null);
            }).select(['-_id', '-clients', '-username', '-__v']).clone()
        },
        // populate client object
        (callback) => {
            Client.findById(`${clientID}`, (err, client) => {
                if (err) { return console.error(err); }
                // populate the client obj
                clientInfo = client._doc;
                callback(null);
            }).select(['-_id', '-ownerID', '-sessions', '-isArchived', '-__v']).clone()
        },
        // populate the events list
        (callback) => { 
            Event.find({ clientID: clientID, date: {
                $gte: start,
                $lte: end,
            }
            }, {clientID: 0, _id: 0}, (err, events) => {
                if (err) { return console.error(err); }
                console.log(events.length + " events read from database");
                eventsList = events;

                if (eventsList == 0) {
                    console.log("There are no events in the given range of dates.")
                    res.status(503).send("There are no events in");
                    return;
                } else {
                    // sort the events by date
                    eventsList.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                }
                callback(null);
            }).clone()
        }
    ], (err, result) => {
        console.timeEnd(dbTime);
        //catch error
        if (err) { throw err; }
            
            let options = {
                mode: "text",
                args: [JSON.stringify(providerInfo), JSON.stringify(clientInfo), JSON.stringify(eventsList)]
            }
            // run the statement generator script
            console.time(genTime);
            // console.log("+++   EXCLUDE TEST +++")
            // console.dir(providerInfo)
            // console.log("+++ EXCLUDE TEST CLIENT   +++")
            // console.dir(clientInfo)
            // fs.writeFile('user.json', JSON.stringify(providerInfo, null, 2), err => console.error(err));
            // fs.writeFile('client.json', JSON.stringify(clientInfo, null, 2), err => console.error(err));
        
            
            console.log(`${JSON.stringify(clientInfo, null, 2)}`)
            exec(`moxie/target/release/moxie '${JSON.stringify(clientInfo)}' '${JSON.stringify(eventsList)}' '${JSON.stringify(providerInfo)}'`, { shell: true },
            (error, stdout, stderr) => {
               if (error) {
                   console.error(`exec error: ${error}`);
                   return;
               }
               if (stdout) {console.log(`stdout: ${stdout}`);}
               if (stderr) {console.error(`stderr: ${stderr}`);}
               try {
                   res.status(200).download(`public/invoices/statementtest.pdf`, `${clientInfo.fname + "-" + clientInfo.lname}.pdf`, function (err) {
             
                       if (err) return console.error(err);
                       // delete the pdf from the server after download
                       fs.unlink(`public/invoices/statementtest.pdf`, function (err) {
                           if (err) return console.error(err)
               
                       });
                   })
               } 
               catch (err) { throw err; }
            })
        })

            // PythonShell.run("Python/src/core/main.py", options, (err, result) => {
            //     if (err) return console.error(err)
    
            //     console.log("+++++++++++++++++ PYTHON OUTPUT +++++++++++++++++ \n")
            //     console.log(result)
            //     console.log("+++++++++++++++ END PYTHON OUTPUT +++++++++++++++ \n")
            //     console.timeEnd(genTime);
            //     console.log('');
            //     try {
            //         res.status(200).download(`public/invoices/${clientInfo.clientname}.pdf`, `${clientInfo.clientname}.pdf`, function (err) {
            
            //             if (err) return console.error(err);
            //             // delete the pdf from the server after download
            //             fs.unlink(`public/invoices/${clientInfo.clientname}.pdf`, function (err) {
            //                 if (err) return console.error(err)
                
            //             });
            //         })
            //     } 
            //     catch (err) { throw err; }
            // })
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
