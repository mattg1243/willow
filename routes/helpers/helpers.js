const User = require("../../models/user-model");
const Client = require("../../models/client-schema");
const Event = require("../../models/event-schema");

function recalcBalance(clientID) {
    
    let balance = 0;
    
    Event.find({ clientID: clientID }, function (err, events) {

        if (err) return console.error(err)
        events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        console.log(events)

        for (let i = 0; i < events.length; i++) {
            balance += parseFloat(events[i].amount.toString())
            
            Event.findOneAndUpdate({ _id: events[i]._id }, { newBalance: balance }, (err) => {
                if (err) console.error(err)
                console.log("balances recalculated")
            });
            // console.log(balance.toFixed(2))
        }

        Client.findOneAndUpdate({ _id: clientID }, { balance: balance }, function (err) {
     
            if (err) return console.error(err)
    
            console.log("---balance updated---")
    
        })
})}

module.exports.recalcBalance = recalcBalance;