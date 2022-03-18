const { body, validationResult } = require('express-validator');

exports.registerUserValidator = [
  // validate and sanitize 
    // username field
    body('username', 'No username entered.')
    .trim()
    .isLength({ min: 7, max: 30 })
    .withMessage('Please enter a username that is between 7 and 30 characters long.')
    .escape(),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json(errors.array());
      }
      next();
    },
    // password and confirmation fields
    body('passwordConfirm')
    .trim()
    .isLength({ min: 7, max: 30 })
    .withMessage('Please enter a password that is between 7 and 30 characters long.')
    .custom(async (passwordConfirm) => {
        const password = req.body.password;
        // throw error if passwords dont match
        if (password != passwordConfirm) {
            throw new Error('Passwords do not match')
        }
    }),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json(errors.array());
      }
      next();
    },
    // other fields that just need basic validation
    body('fname').trim().escape().isAlpha()
    .withMessage('Only alphabetical characters are allowed in the name field.'),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).send(errors.array());
      }
      next();
    },

    body('lname').trim().escape().isAlpha()
    .withMessage('Only alphabetical characters are allowed in the name field.'),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json(errors.array());
      }
      next();
    },

    body('nameForHeader', 'Please enter a name to appear on your statements.')
    .trim().escape(),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json(errors.array());
      }
      next();
    },

    body('email').trim().escape().isEmail()
    .withMessage('Invalid email address.'),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json(errors.array());
      }
      next();
    },

    body('phone').trim().escape().isNumeric()
    .withMessage('Invalid phone number.'),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json(errors.array());
      }
      next();
    },
    
    body('city').trim().escape().isAlpha()
    .withMessage('Only alphabetical characters are allowed in the city field.'),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json(errors.array());
      }
      next();
    },

    body('state').trim().escape().isAlpha().isLength({ min: 2, max: 2 })
    .withMessage('Please enter your states two letter code (i.e. CA, NV)'),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json(errors.array());
      }
      next();
    },

    body('zip').trim().escape().isPostalCode()
    .withMessage('Zip code should be all numbers.'),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json(errors.array());
      }
      next();
    },
  
]
