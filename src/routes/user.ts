import * as express from 'express';
import UserHandlers from './handlers/userHandlers';
import UserValidators from './validators/userValidators';
import { verifyJWT } from '../utils/helpers';

const router = express.Router();

// register new user to DB
router.post('/register/newuser', 
  UserValidators.registerUserValidator,
  UserValidators.validate,
  (req, res) => { UserHandlers.registerUser(req, res) }
);
// update users info from preferences page
router.post("/updateinfo", 
  UserValidators.updateUserInfoValidator,
  UserValidators.validate,
  verifyJWT, 
  (req, res) => { UserHandlers.updateUserInfo(req, res) }
);
// add a new client
router.post('/newclient', 
  UserValidators.newClientValidator,
  UserValidators.validate,
  verifyJWT, 
  (req, res) => { UserHandlers.addNewClient(req, res) }
);
// delete a client and all associated events
router.post('/deleteclient', 
  UserValidators.deleteClientValidator, 
  UserValidators.validate, 
  verifyJWT, 
  (req, res) => { UserHandlers.deleteClient(req, res) }
);
// update a clients information
router.post('/updateclient', 
  UserValidators.udpateClientValidator,
  UserValidators.validate,
  verifyJWT, 
  (req, res) => { UserHandlers.updateClientInfo(req, res) }
);
// reset password
router.post('/resetpassword', 
  UserValidators.resetPasswordValidator,
  UserValidators.validate,
  (req, res) => { UserHandlers.resetPassword(req, res) }
);
// save new password
router.post('/changepassword',
  UserValidators.changePasswordValidator,
  UserValidators.validate,
  (req, res) => { UserHandlers.changePassword(req, res) }
);
// delete user, for testing purposes only for now
// deactivated for safety
// router.delete('/deleteuser/:id', 
//   (req, res) => { UserHandlers.deleteUser(req, res) }
// );

export default router;