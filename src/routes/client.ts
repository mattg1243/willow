import * as express from 'express';
import ClientHandlers from './handlers/clientHandlers';
import ClientValidators from './validators/clientValidators';

const router = express.Router();
// add new event to clients record
router.post('/:id/addevent', 
  ClientValidators.addEventValidator,
  ClientValidators.validate,
  (req, res) => { ClientHandlers.addEvent(req, res); 
});
// update an event
router.post('/event/:eventid', 
  ClientValidators.addEventValidator,
  ClientValidators.validate,
  (req, res) => { ClientHandlers.updateEvent(req, res); 
});
// delete an event
router.post('/deleteevent', 
  ClientValidators.deleteEventValidator,
  ClientValidators.validate,
  (req, res) => { ClientHandlers.deleteEvent(req, res) 
});
// generate and download statment
router.post('/makestatement/:userid/:clientid/:start/:end', 
  ClientValidators.makeStatementValidator,
  ClientValidators.validate,
  (req, res) => { ClientHandlers.makeStatement(req, res); 
})


export default router;