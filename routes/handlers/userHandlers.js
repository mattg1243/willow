const User = require('../../models/user-model');
const Client = require('../../models/client-schema')

const registerUser = async (req, res) => {
    if (req.body.password == req.body.passwordConfirm) {
        
        try {
            await User.register(new User({ username: req.body.username, fname: req.body.fname, lname: req.body.lname, email: req.body.email}), req.body.password, function(err) {
                if (err) {
                    console.log('Error while registering user : ', err);
                    return next(err);
                } else {
                    console.log('User registered');
                    res.redirect('/');
                }
            })
        } 
        catch(err) { throw err; } 
    } else { res.redirect('/user/register'); }
}

const renderDashboard = async (req, res) => {
    try {
        await Client.find({ ownerID: req.user['_id'] }, 'fname lname balance', function(err, clients) {
        
            if (err) return console.error(err);
            
            res.render('dashboard', { clients: clients})
    
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
    try {
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

    })
    } catch (err) { throw err ;}
    
}

module.exports.registerUser = registerUser;
module.exports.renderDashboard = renderDashboard;
module.exports.updateUserInfo = updateUserInfo;
module.exports.addNewClient = addNewClient;