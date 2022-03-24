const { body, check, validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json(errors.array())
  }
  next();
}

const registerUserValidator = [
  // validate and sanitize 
    // username field
    body('username', 'No username entered.')
    .trim()
    .isLength({ min: 7, max: 30 })
    .withMessage('Please enter a username that is between 7 and 30 characters long.')
    .escape(),
    // password and confirmation fields
    body('passwordConfirm')
    .trim()
    .isLength({ min: 7, max: 30 })
    .withMessage('Please enter a password that is between 7 and 30 characters long.')
    .custom((passwordConfirm, { req }) => passwordConfirm == req.body.password)
    .withMessage('Passwords do not match'),
    // other fields that just need basic validation
    body('fname').trim().escape().isAlpha()
    .withMessage('Only alphabetical characters are allowed in the name field.'),

    body('lname').trim().escape().isAlpha()
    .withMessage('Only alphabetical characters are allowed in the name field.'),

    body('nameForHeader', 'Please enter a name to appear on your statements.')
    .trim().escape(),

    body('email').trim().escape().isEmail()
    .withMessage('Invalid email address.'),

    body('phone').trim().escape().isNumeric()
    .withMessage('Invalid phone number.'),

    body('city').trim().escape().isAlpha()
    .withMessage('Only alphabetical characters are allowed in the city field.'),

    body('state').trim().escape().isAlpha().isLength({ min: 2, max: 2 })
    .withMessage('Please enter your states two letter code (i.e. CA, NV)'),

    body('zip').trim().escape().isPostalCode()
    .withMessage('Zip code should be all numbers.'),

]

const loginUserValidator = [
  
  body('username', 'Username contains invalid characters.').trim().escape(),

  body('password', 'Password contains invalid characters.').trim().escape(),

]

const updateUserInfoValidator = [
  // make sure user id is in a valid format
  body('user', 'Invalid characters in the user ID. What are you trying to do here?').trim().escape(),
  // check formatting for the optional text fields
  body('nameForHeader', 'Check "Name for Header for invalid characters').trim().escape()
  .isLength({ min: 2, max: 100})
  .withMessage('Name for Header exceeds 100 characters'),

  body('street', 'Check "Street Adress" for invalid characters').trim().escape()
  .isLength({ min: 2, max: 50})
  .withMessage('Street address may not exceed 50 characters'),
  
  body('city', 'Check "Street Adress" for invalid characters').trim().escape()
  .isLength({ min: 2, max: 50})
  .withMessage('Street address may not exceed 50 characters'),

  body('state', 'Check "State" for invalid characters').trim().escape().isAlpha().isLength({ min: 2, max: 2 })
  .withMessage('Please enter your states two letter code (i.e. CA, NV)'),

  body('zip', 'Check "Zip Code" for invalid characters').trim().escape().isNumeric()
  .withMessage('Zip code should be all numbers.'),
  
  body('email', 'Check "Email" for invalid characters').trim().escape().isEmail()
  .withMessage('Invalid email address.')
  .isLength({ min: 1, max: 150}),
    
  body('phone', 'Check "Phone" for invalid characters').trim().escape().isNumeric().isLength({ min: 1, max: 150})
  .withMessage('Invalid phone number'),

  body('paymentInfo', 'Check "Payment Info" for invalid characters').trim().escape()
  .isLength({ min: 2, max: 80})
  .withMessage('Payment Info field exceeds 80 charactes'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json(errors.array())
    }
    next();
  }
 
]

const newClientValidator = [
  // trim + escape all fields
  check().trim().escape(),
]

const deleteClientValidator = [
  // trim + escape all fields
  check().trim().escape(),
]

const udpateClientValidator = [
  // trim + escape all fields
  check().trim().escape(),
]

const resetPasswordValidator = [
  // trim + escape all fields
  check().trim().escape(),
]

const changePasswordValidator = [
  // trim + escape all fields
  check().trim().escape(),
]

module.exports = {
  
  validate,
  registerUserValidator,
  loginUserValidator,
  updateUserInfoValidator,
  newClientValidator,
  deleteClientValidator,
  udpateClientValidator,
  resetPasswordValidator,
  changePasswordValidator

}