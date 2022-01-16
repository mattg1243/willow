const router = require('express').Router();
const Client = require('../models/client-schema')
const Event = require('../models/event-schema')
const connectEnsureLogin = require('connect-ensure-login');
const handlers = require('./handlers/userHandlers');
const helpers = require('./helpers/helpers');

// register new user to DB
router.post('/register/newuser', (req, res) => { handlers.registerUser(req, res) })
// update users info from preferences page
router.post("/updateinfo", helpers.verifyJWT, (req, res) => { handlers.updateUserInfo(req, res) }) // p
// add a new client
router.post('/newclient', helpers.verifyJWT, (req, res) => { handlers.addNewClient(req, res) }); // p
// delete a client and all associated events
router.post('/deleteclient', helpers.verifyJWT, (req, res) => { handlers.deleteClient(req, res) }); // p
// update a clients information
router.post('/updateclient', helpers.verifyJWT, (req, res) => { handlers.updateClientInfo(req, res) });
// reset password
router.post('/resetpassword', (req, res) => { handlers.resetPassword(req, res) });
// save new password
router.post('/changepassword', (req, res) => { handlers.changePassword(req, res) });

module.exports = router;