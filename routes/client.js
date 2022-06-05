const router = require('express').Router();
const handlers = require('./handlers/clientHandlers');
const helpers = require('./helpers/helpers');
const validators = require('./validators/clientValidators');

// need to add jwt verification for these routes
// add new event to clients record
router.post('/:id/addevent', 
  validators.addEventValidator,
  validators.validate,
  (req, res) => { handlers.addEvent(req, res); 
});
// update an event
router.post('/event/:eventid', 
  validators.addEventValidator,
  validators.validate,
  (req, res) => { handlers.updateEvent(req, res); 
});
// delete an event
router.post('/deleteevent', 
  validators.deleteEventValidator,
  validators.validate,
  (req, res) => { handlers.deleteEvent(req, res) 
});
// generate and download statment
router.post('/makestatement/:userid/:clientid/:start/:end', 
  validators.makeStatementValidator,
  validators.validate,
  (req, res) => { handlers.makeStatement(req, res); 
})


module.exports = router;