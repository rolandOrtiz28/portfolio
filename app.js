const dotenv = require('dotenv').config({ override: true });
const express = require('express');
const app = express();
const path = require('path')
const mongoose = require('mongoose')
const ejsMate = require('ejs-mate')
const nodemailer = require('nodemailer')
const flash = require('connect-flash')
const session = require('express-session')
const ExpressError = require('./utils/ExpressError')
const methodOverride = require('method-override');
const helmet = require('helmet')
const MongoDBStore = require("connect-mongo");
const mongoSanitize = require('express-mongo-sanitize');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./model/user')
// router
const errorHandlingRoute = require('./routes/errorhandling')
const productRoute = require('./routes/products')

//URL
const dbUrl = process.env.DB_URL2 || 'mongodb://127.0.0.1:27017/rolandortiz'


// mongoose conncection
mongoose.connect(dbUrl, {})
const db = mongoose.connection;
db.on('erre', console.error.bind(console, 'connection error:'))
db.once('open', () => {
    console.log('Data-base Connected')
})


const secret = process.env.Roland_Ortiz_Secret

const sessionConfig = {
    secret,
    name: '_rolandOrtiz',
    resave: false,
    saveUninitialized: true,
    store: MongoDBStore.create({
        mongoUrl: dbUrl,
        touchAfter: 24 * 3600 // time period in seconds
    }),
    cookie: {
        httpOnly: true,
        // secure:true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js",
    "https://cdn.ckeditor.com/",
    "https://cdnjs.cloudflare.com/",
    "https://ionic.io/ionicons/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
    "https://www.google-analytics.com",
    "https://code.jquery.com/",
    "https://fontawesome.com"
];
const styleSrcUrls = [
    "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css",
    "https://getbootstrap.com/",
    "https://use.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://ionic.io/ionicons/",
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://fontawesome.com"

];
const connectSrcUrls = [
    "https://unsplash.com/",
    "https://ionic.io/ionicons/",
    "https://unpkg.com/",
    "https://fontawesome.com",
    "https://ka-f.fontawesome.com/"

];
const fontSrcUrls = [
    "https://ionic.io/ionicons/",
    "https://fonts.gstatic.com/",
    "https://cdnjs.cloudflare.com/",
    "https://use.fontawesome.com/",
    "https://fontawesome.com",
    "https://ka-f.fontawesome.com/"
];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            formAction: ["'self'"],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            mediaSrc: ["'self'"],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/`, //SHOULD MATCH YOUR CLOUDINARY ACCOUNT!
                "https://images.unsplash.com/",
                "https://i.pinimg.com/564x/6c/bf/00/6cbf00a772725add422adf6bb976f6ba.jpg",
                "https://media.istockphoto.com/",
                "https://img.icons8.com/ios-glyphs/256/phone-disconnected.png",



            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

app.use(session(sessionConfig))
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(flash())

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');

    next()
})
//setting templates
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// setting public directory
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))

app.get('/know', (req, res) => {

    res.redirect('/#know')
});

app.get('/', (req, res) => {
    res.redirect('/home');
});

app.get('/home', (req, res) => {
    res.render('home');
});
app.use('/', errorHandlingRoute)
app.use('/', productRoute)



app.post('/send', async (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const subject = req.body.subject;
    const message = req.body.message;

    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.GMAIL_EMAIL,
            pass: process.env.GMAIL_PASSWORD,
        },
    });

    const mailOption = {
        from: `${email}`,
        to: process.env.GMAIL_EMAIL,

        subject: `New contact form submission:${subject}`,
        html: `
<p><strong>Name:</strong>${name}</p>
<p><strong>email:</strong>${email}</p>
<p><strong>Message:</strong>${message}</p>
`
    }

    await transporter.sendMail(mailOption);

    req.flash('success', 'Thank you for messaging me,Hoping to work with you!')
    const returnUrl = req.session.returnTo || '/'

    res.redirect(returnUrl)
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})


app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something went wrong!';
    res.status(statusCode).render('error', { err });
});

app.listen(3000, () => console.log('App is listening on port 3000.'));