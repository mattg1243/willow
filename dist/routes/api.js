const router = require('express').Router();
const { getEventsList, getClientsList, getEvent, getClient } = require('./handlers/apiHandlers');
// get all clients that belong to a user
router.get('/clientslist', (req, res) => {
    getClientsList(req, res);
});
// get all events that belong to a client
router.get('/eventslist', (req, res) => {
    getEventsList(req, res);
});
// get a single client
router.get('/client', (req, res) => {
    getClient(req, res);
});
// get a single event
router.get('/event', (req, res) => {
    getEvent(req, res);
});
module.exports = router;
