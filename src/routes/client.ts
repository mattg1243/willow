import { Router, Request, Response } from 'express';
import ClientHandlers from '../handlers/clientHandlers';
import ClientValidators from '../middleware/validators/clientValidators';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  ClientHandlers.getClient(req, res);
});

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
