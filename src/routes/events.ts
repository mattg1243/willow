import { Router, Request, Response } from 'express';
import EventHandlers from '../handlers/eventHandlers';
import ClientValidators from '../middleware/validators/clientValidators';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  EventHandlers.getEvent(req, res);
});
// add new event to clients record
router.post(
  '/:id/addevent',
  ClientValidators.addEventValidator,
  ClientValidators.validate,
  (req: Request, res: Response) => {
    EventHandlers.addEvent(req, res);
  }
);

// update an event
router.post(
  '/event/:eventid',
  ClientValidators.addEventValidator,
  ClientValidators.validate,
  (req: Request, res: Response) => {
    EventHandlers.updateEvent(req, res);
  }
);

// delete an event
router.post(
  '/deleteevent',
  ClientValidators.deleteEventValidator,
  ClientValidators.validate,
  (req: Request, res: Response) => {
    EventHandlers.deleteEvent(req, res);
  }
);

export default router;
