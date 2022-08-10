const router = require('express').Router();
const handlers = require('./handlers/userHandlers');
const helpers = require('../utils/helpers');
const validators = require('./validators/userValidators');
// register new user to DB
router.post('/register/newuser', validators.registerUserValidator, validators.validate, (req, res) => { handlers.registerUser(req, res); });
// update users info from preferences page
router.post("/updateinfo", validators.updateUserInfoValidator, validators.validate, helpers.verifyJWT, (req, res) => { handlers.updateUserInfo(req, res); });
// add a new client
router.post('/newclient', validators.newClientValidator, validators.validate, helpers.verifyJWT, (req, res) => { handlers.addNewClient(req, res); });
// delete a client and all associated events
router.post('/deleteclient', validators.deleteClientValidator, validators.validate, helpers.verifyJWT, (req, res) => { handlers.deleteClient(req, res); });
// update a clients information
router.post('/updateclient', validators.udpateClientValidator, validators.validate, helpers.verifyJWT, (req, res) => { handlers.updateClientInfo(req, res); });
// reset password
router.post('/resetpassword', validators.resetPasswordValidator, validators.validate, (req, res) => { handlers.resetPassword(req, res); });
// save new password
router.post('/changepassword', validators.changePasswordValidator, validators.validate, (req, res) => { handlers.changePassword(req, res); });
// delete user, for testing purposes only for now
router.delete('/deleteuser/:id', (req, res) => { handlers.deleteUser(req, res); });
module.exports = router;
