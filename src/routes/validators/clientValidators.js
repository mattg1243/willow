const { body, validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json(errors.array())
  }
  next();
}

const addEventValidator = [
  body('token').trim().escape(),
  body('clientID').trim().escape(),
  body('user').trim().escape(),
  body('date').trim().escape().isDate(),
  body('type').trim().escape(),
  body('detail', 'Invalid characters in the details field')
  .trim().escape(),
  body('hours').trim().escape(),
  body('minutes').trim().escape(),
  body('rate').trim().escape(),
  body('amount').trim().escape().isNumeric(),
  body('newBalance').trim().escape(),
]

const deleteEventValidator = [
  body('token').trim().escape(),
  body('clientID').trim().escape(),
  body('user').trim().escape(),
  body('eventID').trim().escape(),
]

const makeStatementValidator = [
  body('*', 'Invalid characters detected in the request')
  .trim().escape(),
]

module.exports = {
  validate,
  addEventValidator,
  deleteEventValidator,
  makeStatementValidator
}