import * as express from 'express';
import 'passport'

const router = express.Router();

router.get('/', function(req, res) {

  if (req.isAuthenticated) {
    res.redirect('/user/dashboard')
  }
  
  else if (!req.isAuthenticated) {
    res.redirect('/login');
  }
});



export default router;