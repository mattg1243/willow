import * as express from 'express';
import ApiHandlers from './handlers/apiHandlers';

const router = express.Router();

// get all clients that belong to a user
router.get('/clientslist', (req, res) => {
  ApiHandlers.getClientsList(req, res);
})

// get all events that belong to a client
router.get('/eventslist', (req, res) => {
  ApiHandlers.getEventsList(req, res);
})

// get a single client
router.get('/client', (req, res) => {
  ApiHandlers.getClient(req, res);
})

// get a single event
router.get('/event', (req, res) => {
  ApiHandlers. getEvent(req, res);
})

export default router;