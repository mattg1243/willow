const router = require('express').Router();
const Client = require('../models/client-schema')
const Event = require('../models/event-schema')
const connectEnsureLogin = require('connect-ensure-login');
const handlers = require('./handlers/userHandlers');

// render register page
router.get('/register', (req, res) => { res.render('register'); })
// logout user
router.get('/logout', (req, res) => { req.logout(); res.redirect('/login'); })
// register new user to DB
router.post('/register/newuser', (req, res) => { handlers.registerUser(req, res) })
// render logged in user's dashboard page
router.get('/dashboard', connectEnsureLogin.ensureLoggedIn('/login'), (req, res) => { handlers.renderDashboard(req, res) })
// render user preference page
router.get('/preferences', (req, res) => { res.render('preferences', { user: req.user }); })
// update users info from preferences page
router.post("/update-info/:id", connectEnsureLogin.ensureLoggedIn(), (req, res) => { handlers.updateUserInfo(req, res) })
// add a new client
router.post('/dashboard/newclient', connectEnsureLogin.ensureLoggedIn(), (req, res) => { handlers.addNewClient(req, res) });


module.exports = router;