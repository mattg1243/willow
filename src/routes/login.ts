const router = require('express').Router();
const passport = require('passport');
const helpers = require('../utils/helpers');
const { validate, loginUserValidator } = require('./validators/userValidators');
const path = require('path');
require('dotenv').config({path: path.resolve(__dirname, '../../.env')});

import DatabaseHelpers from '../utils/databaseHelpers';
import User from '../models/user-model';

router.post('/', 
    loginUserValidator,
    validate,
    passport.authenticate('local'),
    async (req: any, res: any) => {
        try {
            const response = await DatabaseHelpers.getAllData({ username: req.body.username });
            console.log(response);
            return res.json(response);
        } catch(err) {
            return res.status(401).json({error: err});
        }
})

export default router;