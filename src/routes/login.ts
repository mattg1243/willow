import * as express from 'express';
import * as passport from 'passport';
import UserValidators from './validators/userValidators';
import DatabaseHelpers from '../utils/databaseHelpers';

const router = express.Router();

router.post('/', 
    UserValidators.loginUserValidator,
    UserValidators.validate,
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