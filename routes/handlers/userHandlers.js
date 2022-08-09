const User = require('../../models/user-model');
const Client = require('../../models/client-schema');
const Event = require('../../models/event-schema');
const helpers = require('../../utils/helpers');
const UserHelpers = require('../../utils/userHelpers');
const crypto = require('crypto');
const transporter = require('./mailerConfig');

const registerUser = async (req, res) => {
         
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
                zip: req.body.zip, 
                paymentInfo: {
                    check: "",
                    venmo: "",
                    paypal: "",
                    zelle: ""
                }}),
            req.body.password)
            
            const response = await UserHelpers.getAllData({ username: req.body.username });
            return res.status(200).json(response);
    } 
    catch(err) { return res.status(500).send(err.message); } 
}

const updateUserInfo = async (req, res) => {
    try {
        await User.findOneAndUpdate({ _id: req.body.user }, 
            { 
                nameForHeader: req.body.nameForHeader, 
                phone: req.body.phone,
                email: req.body.email, 
                street: req.body.street, 
                city: req.body.city, 
                state: req.body.state, 
                zip: req.body.zip,
                paymentInfo: JSON.parse(req.body.paymentInfo),
                license: req.body.license
            }, { upsert: true })
            const response = await UserHelpers.getAllData({ _id: req.body.user });
            return res.status(200).json(response);
    } catch (err) {
        return res.status(503).json({ error: err });
    }
}

const deleteUser = (req, res) => {
    User.findOneAndDelete({ _id: req.params.id }, (err) => {
        if (err) { return res.status(500).send(err); }
        // delete all clients if there are any
        Client.deleteMany({ ownerID: req.params.id }, (err) => {
            if (err) { return res.status(500).send(err) }

            Event.deleteMany({  ownerID: req.params.id }, (err) => {
                if (err) { return res.status(500).send(err); }

                res.status(200).json('User and associated data deleted successfully');
            })
        })
    })
}

const addNewClient = async (req, res) => {
    const newClient = await new Client(
            {
                ownerID: req.body.user, 
                fname: req.body.fname, 
                lname: req.body.lname, 
                phonenumber: req.body.phonenumber, 
                email: req.body.email, 
                balance: 0,
                rate: req.body.rate,
            }
        ); 
        try {
            const savedClient = await newClient.save();
            await User.findOneAndUpdate({ _id: req.body.user }, { $push: { clients: savedClient['_id'] } })
            .populate('clients').exec()

        } catch (err) {
            return res.status(503).json({ error: err });
        }
        // TODO: add this to the UserHelpers class and uncouple it from http req/res
        helpers.getClients(req, res);
    
}

const deleteClient = (req, res) => {

    Client.findOneAndDelete({ _id: req.body.clientID }, (err, client) => {
        if (err) { throw err; }

        console.log('Deleted client: ' + client);
        Event.deleteMany({ clientID: req.body.clientID }, (err, events) => {
            console.log('Removed events: ' + events);
            helpers.getAllData(req, res);
        })
    })

}

const updateClientInfo = (req, res) => {

    try {
        Client.findOneAndUpdate({ _id: req.body.clientID }, 
            { 
                fname: req.body.fname, lname: req.body.lname, 
                email: req.body.email, phonenumber: req.body.phone,
                rate: req.body.rate, isArchived: req.body.isArchived
            }, (err, client) => {
                if (err) { throw err; }
    
                console.log("Client updated : \n" + client);
                helpers.getClients(req, res);
            }
        )
    } catch (err) { throw err; }
}

const resetPassword = (req, res) => {
    crypto.randomBytes(32, (err, buf) => {
        if (err) { throw err; }

        const token = buf.toString('hex');
        const expireToken = Date.now() + 3600000;
        console.log("Token : " + token);

        try {
            User.findOneAndUpdate({ email: req.body.email}, { resetToken: token, expireToken: expireToken}, (err, user) => {
                if (err) { throw err; }
               
                transporter.sendMail({
                    from: "Willow Support <no-reply@willow.com>",
                    to: req.body.email,
                    subject: "Reset your password",
                    // need to change this for production
                    text: `Go here to reset your password: ${process.env.BASE_URL}/resetpassword/${token}/${user.username}`
                    /*
                    html: `
                    <table>
                    <h5>Click <a href="http://localhost:3002/resetpassword/${token}/${user.username}">here</a> to reset your password<h5>
                    </table>
                    `,
                    */
                }, (err, res) => {
                    if (err) { throw err; }
    
                    console.log(res);
                })
                
                return res.json(user);
            }) 
        } catch (err) { throw err ; }      
    })
}

const changePassword = (req, res) => {
    try {
        User.findOne({ username: req.body.username }, (err, user) => {
            if (err) { throw err; }
            console.log("Req body: " + req.body.password)
            if (req.body.token == user.resetToken && Date.now() <= user.expireToken) {
                user.setPassword(req.body.password, (err, user) => {
                    if (err) { throw err; }
                    user.save();
                    console.log(user);
                    res.json(user);
                })
            } else {
                res.status(401).send("Not authorized; reset token doesnt match.")
            }
        })
    } catch (err) { throw err; }
   
}

module.exports.registerUser = registerUser;
module.exports.updateUserInfo = updateUserInfo;
module.exports.deleteUser = deleteUser;
module.exports.updateClientInfo = updateClientInfo;
module.exports.addNewClient = addNewClient;
module.exports.deleteClient = deleteClient;
module.exports.resetPassword = resetPassword;
module.exports.changePassword = changePassword;