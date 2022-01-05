const createError = require('http-errors');
const express = require('express');
const session = require('express-session');
const path = require('path');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const mongoStore = require('connect-mongo');
const passport = require('./node_modules/passport')
const helmet = require('helmet');
const User = require('./models/user-model')
const cors = require('cors');

require('dotenv').config();
// check for production or dev env
let devEnv = process.env.NODE_ENV !== 'production';

const indexRouter = require('./routes/index');
const loginRouter = require('./routes/login');
const userRouter = require('./routes/user');
const clientRouter = require('./routes/client');
const port = process.env.PORT || 3001;

var app = express();
app.locals.moment = require('moment');
app.locals.passport = require('passport');

// connect to MongoDB
mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true, useMongoClient: true, tls: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error'));

// render from React build
app.use(express.static(path.resolve(__dirname, "./client/build")));
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, "./client/build", "index.html"));
})

// set view engine to satisify error codes
app.set('view engine', 'jade');

// middleware
app.use(helmet.contentSecurityPolicy({
  useDefaults: false,
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: [
      "'self'",
      "https://code.jquery.com/jquery-3.2.1.slim.min.js",
      'https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js',
      "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js",
      "https://cdnjs.cloudflare.com/ajax/libs/mdb-ui-kit/3.6.0/mdb.min.js",
    ],
    styleSrc: [
      "'self'",
      "'unsafe-inline'",
      "*",
    ],
    fontSrc: [
      "'self'",
      "*",
    ]
  }
}))
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/scripts', express.static(path.join(__dirname, 'public/javascripts')))
app.use('/images', express.static(path.join(__dirname, 'public/images')))
app.use('/invoices', express.static(path.join(__dirname, 'public/invoices')))
app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(session({
  secret: '123456',
  resave: false,
  saveUninitialized: true,
  cookie: {maxAge: 60 * 60 * 1000}, // 1 hour
  store: mongoStore.create({ mongoUrl: process.env.DB_URL }),
  secure: true
}));
app.use(flash());
app.use(express.urlencoded({extended: true}))
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());

// Passport authentication
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Setting local variables for the front end
app.use(function(req, res, next) {

  res.locals.loggedIn = req.isAuthenticated();
  res.locals.eventType = 'none';

  next();
  
})

// Base routes
app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/user', userRouter);
app.use('/client', clientRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
});

app.listen(port);

module.exports = app;
