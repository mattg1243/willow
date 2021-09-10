var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/client', function(req, res, next) {
  res.send("Heres your clients")
})

module.exports = router;
