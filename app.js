const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');

const app = express();

const PORT = process.env.PORT || 5000;

// passport config
require('./config/auth')(passport);

// db config
const db = require('./config/keys').MongoURI;

// db connect
mongoose.connect(db, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => console.log('Mongodb connected'))
.catch((err) => console.log(err))

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// body parser
app.use(express.urlencoded({ extended: false }))

// session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());


// global vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');

    next();
})

// Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users')); 

app.listen(PORT, console.log(`Server is listening at ${PORT}`));