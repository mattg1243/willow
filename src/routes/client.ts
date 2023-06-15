import { Router, Request, Response } from 'express';
import ClientHandlers from '../handlers/clientHandlers';
import ClientValidators from '../middleware/validators/clientValidators';
import EventHandlers from '../handlers/eventHandlers';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  ClientHandlers.getClient(req, res);
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
// generate and download statment
router.post(
  '/makestatement/:userid/:clientid/:start/:end',
  ClientValidators.makeStatementValidator,
  ClientValidators.validate,
  (req: Request, res: Response) => {
    ClientHandlers.makeStatement(req, res);
  }
);

export default router;
