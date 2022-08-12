import User from '../../models/user-model';
import Client from '../../models/client-schema';
import Event from '../../models/event-schema';
import DatabaseHelpers from '../../utils/databaseHelpers';
import { randomBytes } from 'crypto';
import transporter from './mailerConfig';


export default class UserHandlers {

    static registerUser = async (req, res) => {
         
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
                
                const response = await DatabaseHelpers.getAllData({ username: req.body.username });
                return res.status(200).json(response);
        } 
        catch(err) { return res.status(500).send(err.message); } 
    }
    
    static updateUserInfo = async (req, res) => {
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
                const response = await DatabaseHelpers.getAllData({ _id: req.body.user });
                return res.status(200).json(response);
        } catch (err) {
            return res.status(503).json({ error: err });
        }
    }
    
    static deleteUser = (req, res) => {
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
    
    static addNewClient = async (req, res) => {
        const newClient = new Client({
            ownerID: req.body.user, 
            fname: req.body.fname, 
            lname: req.body.lname, 
            phonenumber: req.body.phonenumber, 
            email: req.body.email, 
            balance: 0,
            rate: req.body.rate,
        }); 
    
        try {
            // save the new client to the database
            const savedClient = await newClient.save();
            await User.findOneAndUpdate({ _id: req.body.user }, { $push: { clients: savedClient['_id'] } })
            .populate('clients').exec()
            // return the updated clients list to the user
            const clients = await DatabaseHelpers.getClients(req.body.user);
            res.status(200).json(clients);
        } catch (err) {
            return res.status(503).json({ error: err });
        }  
    }
    
    static deleteClient = async (req, res) => {
        try {
            await Client.findOneAndDelete({ _id: req.body.clientID });
            const response = await DatabaseHelpers.getAllData({ _id: req.body.user })
            return res.status(200).json(response);
        } catch (err) {
            return res.status(503).json({ error: err });
        }
    }
    
    static updateClientInfo = async (req, res) => {
    
        try {
            await Client.findOneAndUpdate({ _id: req.body.clientID }, 
                { 
                    fname: req.body.fname, lname: req.body.lname, 
                    email: req.body.email, phonenumber: req.body.phone,
                    rate: req.body.rate, isArchived: req.body.isArchived
            });
            const respsonse = await DatabaseHelpers.getClients(req.body.user);
            res.status(200).json(respsonse);
    
        } catch (err) {
            return res.status(503).json({ error: err});
        }
    }
    
    static resetPassword = (req, res) => {
        randomBytes(32, (err, buf) => {
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
    
    static changePassword = (req, res) => {
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

}