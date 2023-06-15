import { Request, Response, NextFunction } from 'express';
import { ValidationChain, body, validationResult } from 'express-validator';

export default class ClientValidators {
  /**
   * validator middleware for all /client routes
   */
  static validate = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json(errors.array());
    }
    next();
  };

  static addEventValidator: Array<ValidationChain> = [
    body('token').trim().escape(),
    body('clientID').trim().escape(),
    body('user').trim().escape(),
    body('date').trim().escape().isDate(),
    body('type').trim().escape(),
    body('detail', 'Invalid characters in the details field').trim().escape(),
    body('hours').trim().escape(),
    body('minutes').trim().escape(),
    body('rate').trim().escape(),
    body('amount').trim().escape().isNumeric(),
    body('newBalance').trim().escape(),
  ];

  static deleteEventValidator: Array<ValidationChain> = [
    body('token').trim().escape(),
    body('clientID').trim().escape(),
    body('user').trim().escape(),
    body('eventID').trim().escape(),
  ];

  static makeStatementValidator = [body('*', 'Invalid characters detected in the request').trim().escape()];
}
