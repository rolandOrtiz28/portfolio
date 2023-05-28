const express = require('express')
const router = express.Router();
const catchAsync = require('../utils/catchasync');
const User = require('../model/user')
const bcrypt = require('bcrypt')


router.get('/register', (req, res) => {
    res.render('user/register')
})


router.post('/register', catchAsync(async (req, res) => {

    const { username, email, password, number } = req.body;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    req.session.gobackTo = req.originalUrl

    if (!passwordRegex.test(password)) {
        req.flash('error', 'Password must contain at least 1 uppercase letter and 1 number');
        return res.redirect(returnUrl);
    }

    const hash = await bcrypt.hash(password, 12)

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
        req.flash('error', 'Username already Exist');
        return res.redirect(returnUrl);
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
        req.flash('error', 'Email already Exist');
        return res.redirect(returnUrl);
    }
    const existingNumber = await User.findOne({ number });
    if (existingNumber) {
        req.flash('error', 'Phone number already Exist');
        return res.redirect(returnUrl);
    }

    const user = new User({ username, number, email, password: hash });
    await user.save();

    req.flash('success', `Hello ${user.username}`);
    const redirectUrl = req.session.gobackTo || '/';
    delete req.session.gobackTo;
    res.redirect(redirectUrl);
}));

router.get('/auth', (req, res) => {
    res.render('user/auth')
})
router.get('/login', (req, res) => {
    res.render('user/login')
})



router.post('/login', catchAsync(async (req, res) => {
    const { username, password } = req.body;


    const user = await User.findOne({ username });

    if (!user) {
        req.flash('error', 'Invalid username or password');
        return res.redirect(returnUrl);
    }

    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
        req.flash('error', 'Invalid username or password');
        return res.redirect(returnUrl);
    }

    req.session.user_id = user._id;
    req.flash('success', `Welcome Back ${user.username}`);
    res.redirect('/auth');

}));



module.exports = router;