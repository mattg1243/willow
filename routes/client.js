const router = require('express').Router();
const connectEnsureLogin = require('connect-ensure-login');
const handlers = require('./handlers/clientHandlers');
const helpers = require('./helpers/helpers');


// render the client page and get all events
router.get("/:id", (req, res) => { handlers.renderClientPage(req, res) });
// add new event to clients record
router.post('/:id/addevent', (req, res) => { handlers.addEvent(req, res); });
// get a specific event and render the event page
router.get('/event/:eventid', (req, res) => { handlers.renderEventPage(req, res); });
// update an event
router.post('/event/:eventid', (req, res) => { handlers.updateEvent(req, res); });
// delete an event
router.post('/deleteevent', (req, res) => { handlers.deleteEvent(req, res) });
// generate a statment
router.post('/:id/makestatement/:fname/:lname', (req, res) => { handlers.makeStatement(req, res); })
// download the statement
router.get('/:id/makestatement/download/:clientname/:start/:end', (req, res) => { handlers.downloadStatement(req, res); })


module.exports = router;