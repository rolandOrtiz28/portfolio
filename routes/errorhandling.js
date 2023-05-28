const express = require('express')
const router = express.Router();
const User = require('../model/user')
const bcrypt = require('bcrypt')
const catchAsync = require('../utils/catchAsync');

router.get('/register', (req, res) => {
    res.render('user/register')
})


router.post('/register', catchAsync(async (req, res) => {
    try {
        const { username, email, password, number } = req.body;
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        req.session.gobackTo = req.originalUrl
        const redirectUrl = req.session.gobackTo || '/register';
        if (!passwordRegex.test(password)) {
            req.flash('error', 'Password must contain at least 1 uppercase letter and 1 number');
            return res.redirect(redirectUrl);
        }

        const hash = await bcrypt.hash(password, 12)

        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            req.flash('error', 'Username already Exist');
            return res.redirect(redirectUrl);
        }

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            req.flash('error', 'Email already Exist');
            return res.redirect(redirectUrl);
        }
        const existingNumber = await User.findOne({ number });
        if (existingNumber) {
            req.flash('error', 'Phone number already Exist');
            return res.redirect(redirectUrl);
        }

        const user = new User({ username, number, email, password: hash });
        await user.save();

        req.flash('success', `Hello ${user.username}`);

        delete req.session.gobackTo;
        res.redirect(redirectUrl);
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
}));

router.get('/auth', (req, res) => {
    res.render('user/auth')
})
router.get('/login', (req, res) => {
    res.render('user/login')
})



router.post('/login', catchAsync(async (req, res) => {
    try {
        const { username, password } = req.body;
        req.session.gobackTo = req.originalUrl
        const redirectUrl = req.session.gobackTo || '/register';

        const user = await User.findOne({ username });

        if (!user) {
            req.flash('error', 'Invalid username or password');
            return res.redirect(redirectUrl);
        }

        const passwordMatch = await bcrypt.compare(password, user.password)

        if (!passwordMatch) {
            req.flash('error', 'Invalid username or password');
            return res.redirect(redirectUrl);
        }

        req.session.user_id = user._id;
        req.flash('success', `Welcome Back ${user.username}`);
        res.redirect('/auth');
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
}));



module.exports = router;