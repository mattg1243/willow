import createError from 'http-errors';
import express from 'express';
import path from 'path';
import flash from 'connect-flash';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import mongoose from 'mongoose';
import passport from 'passport';
import helmet from 'helmet';
import puppeteer from 'puppeteer';
// const User = require('./models/user-model')
import { verifyJWT } from './middleware/auth';
import forceHttps from './middleware/https';
import cors from 'cors';
import User from './models/user-model';
// import User from './models/user-model';


require('dotenv').config({path: path.resolve(__dirname, '../.env')});
// check for production or dev env

import loginRouter from './routes/login';
import userRouter from './routes/user';
import clientRouter from './routes/client';
import apiRouter from './routes/api';
const port = process.env.PORT || 3001;

var app = express();
app.locals.moment = require('moment');
app.locals.passport = require('passport');

// connect to MongoDB
mongoose.connect(process.env.DB_URL);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error'));

// render from React build
app.use(express.static(path.resolve(__dirname, "../client/build")));

// set view engine to satisify error codes
app.set('view engine', 'jade');
// launch puppeteer instance
let browser: puppeteer.Browser;
let page: puppeteer.Page;
(async () => {
  browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  page = await browser.newPage();
})();
export { page };
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
app.use('/public', express.static(path.join(__dirname, '../public')));
app.use('/scripts', express.static(path.join(__dirname, '../public/javascripts')))
app.use('/images', express.static(path.join(__dirname, '../public/images')))
app.use('/invoices', express.static(path.join(__dirname, '../public/invoices')))
app.use(logger('dev'));
app.use(cors());
app.use(express.json());
// app.use(session({
//   secret: '123456',
//   resave: false,
//   saveUninitialized: true,
//   cookie: {maxAge: 60 * 60 * 1000}, // 1 hour
//   secure: true
// }));
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
// app.use('/', indexRouter);
app.use('*', forceHttps);
app.use('/login', loginRouter);
app.use('/user', userRouter);
app.use('/api', verifyJWT, apiRouter);
app.use('/client', verifyJWT, clientRouter);
// rendering from react build
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
})

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


export default app;