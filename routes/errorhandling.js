const express = require('express')
const router = express.Router();
const User = require('../model/user')
const bcrypt = require('bcrypt')
const catchAsync = require('../utils/catchAsync');
const passport = require('passport')
router.get('/register', (req, res) => {
    res.render('user/register')
})


router.post('/register', catchAsync(async (req, res, next) => {
    try {
        const { email, username, password, number } = req.body;

        const passwordRegix = /^(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        if (!passwordRegix.test(password)) {
            req.flash('error', 'It must contain atleast 1 Uppercase 1 number');
            return res.redirect('/register')
        }
        const existingUsername = await User.findOne({ username })
        if (existingUsername) {
            req.flash('error', 'A user with the given username is already registered')
            return res.redirect('/register')
        }
        const existingEmail = await User.findOne({ email })
        if (existingEmail) {
            req.flash('error', 'A user with the given email is already registered')
            return res.redirect('/register')
        }
        const existingNumber = await User.findOne({ number })
        if (existingNumber) {
            req.flash('error', 'A user with the given Number is already registered')
            return res.redirect('/register')
        }
            const user = new User({ email, username,number });
            const registeredUser = await User.register(user, password)
           res.redirect('/login')

    } catch (e) {
        req.flash('error', e.message)
        res.redirect('/register')
    }
}))

router.get('/auth', (req, res) => {
    res.render('user/auth')
})
router.get('/login', (req, res) => {
    res.render('user/login')
})



router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login', keepSessionInfo: true }), (req, res) => {
    req.flash('success', "logged in")
    res.redirect('/#portfolio')
})



module.exports = router;