import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

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

  static makeStatementValidator = [body('*', 'Invalid characters detected in the request').trim().escape()];
}
