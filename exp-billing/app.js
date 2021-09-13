var createError = require('http-errors');
var express = require('express');
const session = require('express-session');
const mongoStore = require('connect-mongo');
var path = require('path');
const favicon = require('favicon');
var cookieParser = require('cookie-parser');
const bodyParser = require('body-parser')
var logger = require('morgan');
var passport = require('./node_modules/passport')
var LocalStrategy = require('./node_modules/passport-local');
var passportLocalMongoose = require('passport-local-mongoose');
var User = require('./models/user-model')

var layoutRouter = require('./routes/index');
var userRouter = require('./routes/user')

var app = express();

// connect to MongoDB
var mongoose = require('mongoose');
var dburi = 'mongodb+srv://mattg1243:chewyvuitton@main-cluster.5pmmm.mongodb.net/maindb?writeConcern=majority';
mongoose.connect(dburi, { useNewUrlParser: true, useUnifiedTopology: true, useMongoClient: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


// middleware
app.use(logger('dev'));
app.use(express.json());
app.use(session({
  secret: '123456',
  resave: false,
  saveUninitialized: true,
  cookie: {maxAge: 60 * 60 * 1000}, // 1 hour
  store: mongoStore.create({ mongoUrl: dburi }),
}));
app.use(express.urlencoded({extended: true}))
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ROUTES:

app.use('/', layoutRouter);
app.use('/user', userRouter);


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
  res.render('error');
});

module.exports = app;
