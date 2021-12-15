const Client = require('../../models/client-schema');
const Event = require('../../models/event-schema');

const renderClientPage = async (req, res) => {
    // TODO: change these to chargeType boolean in the event schema somehow...
    const meetingTypes = ['1:1 Meeting', '3 Way Meeting', '4 Way Meeting', '5 Way Meeting', '6 Way Meeting', '7 Way Meeting']
    const miscTypes = ['Emails', 'Intention Statement', 'Notes', 'Parenting Plan', 'Phone Call', 'Travel Time']

    Client.findById(req.params.id, function(err, client) {
        
        if (err) return console.error(err)

        Event.find({ clientID: req.params.id },  function(err, events) {
           
            if (err) return console.error(err);
    
            res.render('clientpage', { client: client, events: events, meetings: meetingTypes, misc: miscTypes })
            
        }).sort({ date: 1 })
    })
}

module.exports.renderClientPage = renderClientPage;