const User = require('../../models/user-model');
const Client = require('../../models/client-schema');
const Event = require('../../models/event-schema');
const helpers = require('../helpers/helpers')

const registerUser = async (req, res) => {
    if (req.body.password == req.body.passwordConfirm) {
        
        try {
            await User.register(new User({
                username: req.body.username, 
                fname: req.body.fname, 
                lname: req.body.lname, 
                email: req.body.email, 
                nameForHeader: req.body.nameForHeader, 
                phone: req.body.phone, 
                street: req.body.street, 
                city: req.body.city, 
                state: req.body.state, 
                zip: req.body.zip}), 
                req.body.password, function(err) {
                
                    if (err) {
                    console.log('Error while registering user : ', err);
                    return err;
                } else {
                    console.log('User registered');
                    res.send("success")
                }
            })
        } 
        catch(err) { throw err; } 
    }
}

const renderDashboard = async (req, res) => {
    try {
        await Client.find({ ownerID: req.user['_id'] }, 'fname lname balance', function(err, clients) {
        
            if (err) return console.error(err);
            
            // res.render('dashboard', { clients: clients})
    
        });
    }
    catch (err) { throw err; } 
}

const updateUserInfo = async (req, res) => {
    try {
        await User.findOneAndUpdate({ _id: req.params.id }, { nameForHeader: req.body.nameForHeader, phone: req.body.phone, street: req.body.street, city: req.body.city, state: req.body.state, zip: req.body.zip}, { upsert: true }, function(err, info) {

            if (err) return console.error(err)
    
            console.log("Info updated : \n" + info)
            res.redirect('/');
    
        })
    } catch (err) { throw err ;}
}

const addNewClient = async (req, res) => {
    console.log("Headers: " + req.headers)
    console.log("Data: " + req.body)
    try {
        const newClient = new Client({ownerID: req.body.user, fname: req.body.fname, lname: req.body.lname, phonenumber: req.body.phonenumber, email: req.body.email, balance: 0}); 
        newClient.save(function(err, client) {
       
        if (err) return console.error(err);
        
        User.findOneAndUpdate({ _id: req.body.user }, { $push: { clients: client['_id'] } })
        .populate('clients').exec(function(err, clients) {
            
            if(err) return console.error(err);
            
            console.log("Clients added : " + clients)
        })
        
        // this will be optimized to only send the new clients list
        helpers.getClients(req, res);

    })
    } catch (err) { throw err ;}
    
}

const deleteClient = async (req, res) => {

    Client.findOneAndDelete({ _id: req.body.clientID }, (err, client) => {
        if (err) { throw err };

        console.log('Deleted client: ' + client);
        Event.deleteMany({ clientID: req.body.clientID }, (err, events) => {
            console.log('Removed events: ' + events);
            helpers.getAllData(req, res);
        })
    })

}

module.exports.registerUser = registerUser;
module.exports.renderDashboard = renderDashboard;
module.exports.updateUserInfo = updateUserInfo;
module.exports.addNewClient = addNewClient;
module.exports.deleteClient = deleteClient;