const router = require('express').Router();
const passport = require('passport');
const User = require('../models/user-model')

router.get('/', (req, res) => {
    res.render('login', { messages: req.flash('error') })
})

router.post('/', passport.authenticate('local', {
    failureFlash: "Invalid Login",
    failureRedirect: "/login", 
}), (req, res) => {

    res.redirect('/user/dashboard'); }   
)

module.exports = router;