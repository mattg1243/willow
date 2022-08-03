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

    body('city', 'Invalid characters in the city field').trim().escape(),

    body('state').trim().escape().isAlpha().isLength({ min: 2, max: 2 })
    .withMessage('Please enter your states two letter code (i.e. CA, NV)'),

    body('zip', 'Zip code should be all numbers.').trim().escape()

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

  body('paymentInfo', 'Check "Payment Info" for invalid characters').isJSON(),
  // .isLength({ min: 2, max: 300})
  // .withMessage('Payment Info field exceeds 80 charactes'),

  body('license', 'Check "License" for invalid characters').trim().escape()

]

const newClientValidator = [

  body('fname', "Invalid characters in the first name field")
  .trim().escape().isLength({ min: 1, max: 50}).isAlpha(),

  body('lname', "Missing last name")
  .trim().escape().isLength({ min: 1, max: 50}).isAlpha()
  .withMessage("Invalid characters in the last name field"),

  body('email', "Invalid characters in the email field")
  .optional({ checkFalsy: true }).trim().escape().isLength({ min: 1, max: 100})
  .isEmail().withMessage('Invalid email'),
  
  body('phonenumber', "Invalid phone number")
  .optional({ checkFalsy: true }).isNumeric().withMessage('Phone number must be only numbers')
  .trim().escape(),

  body('rate', "Invalid characters in the billing rate field")
  .optional({ checkFalsy: true }).trim().escape().isNumeric()
  .withMessage("Only numbers are valid in the billing rate field"),

  body('user', 'It appears you are not logged')
  .trim().escape(),
  
  body('token', 'It appears you are not logged').trim().escape(),

]

const deleteClientValidator = [
  
  body('user', 'It appears you are not logged')
  .trim().escape(),
  
  body('token', 'It appears you are not logged').trim().escape(),

  body('clientID', 'Invalid client ID provided to the server').trim().escape(),


]

const udpateClientValidator = [
  
  body('fname', "Invalid characters in the first name field")
  .trim().escape().isLength({ min: 1, max: 50}).isAlpha(),

  body('lname', "Missing last name")
  .trim().escape().isLength({ min: 1, max: 50}).isAlpha()
  .withMessage("Invalid characters in the last name field"),

  body('email', "Invalid characters in the email field")
  .optional({ checkFalsy: true }).trim().escape().isLength({ min: 1, max: 100})
  .isEmail().withMessage('Invalid email'),
  
  body('phone', "Invalid phone number")
  .optional({ checkFalsy: true }).isLength({ min: 5, max: 13 })
  .trim().escape(),

  body('rate', "Invalid characters in the billing rate field")
  .optional({ nullable: true }).trim().escape().isNumeric()
  .withMessage("Only numbers are valid in the billing rate field"),

  body('user', 'It appears you are not logged')
  .trim().escape(),
  
  body('token', 'It appears you are not logged').trim().escape(),

  body('clientID', 'Invalid client ID provided to the server').trim().escape(),

]

const resetPasswordValidator = [
  // trim + escape all fields
  body('email').trim().escape()
]

const changePasswordValidator = [
  // trim + escape all fields
  body('username').trim().escape().isLength({ min: 7, max: 30 }),

  body('password').trim().escape().isLength({ min: 7, max: 30 }),

  body('token').trim().escape(),
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