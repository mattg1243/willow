const router = require('express').Router();
const connectEnsureLogin = require('connect-ensure-login');
const handlers = require('./handlers/clientHandlers');


// render the client page and get all events
router.get("/:id", connectEnsureLogin.ensureLoggedIn(), (req, res) => { handlers.renderClientPage(req, res) });
// add new event to clients record
router.post('/:id/addsession', connectEnsureLogin.ensureLoggedIn(), (req, res) => { handlers.addEvent(req, res); });
// get a specific event and render the event page
router.get('/event/:eventid', connectEnsureLogin.ensureLoggedIn(), (req, res) => { handlers.renderEventPage(req, res); });
// update an event
router.post('/event/:eventid', connectEnsureLogin.ensureLoggedIn(), (req, res) => { handlers.updateEvent(req, res); });
// delete an event
router.get('/deleteevent/:id/:eventid', connectEnsureLogin.ensureLoggedIn(), function (req, res) { handlers.deleteEvent(req, res) });
// generate a statment
router.post('/:id/makestatement/:fname/:lname', connectEnsureLogin.ensureLoggedIn(), (req, res) => { handlers.makeStatement(req, res); })
// download the statement
router.get('/:id/makestatement/download/:clientname/:start/:end', connectEnsureLogin.ensureLoggedIn(), (req, res) => { handlers.downloadStatement(req, res); })


module.exports = router;