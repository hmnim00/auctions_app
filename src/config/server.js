const express = require('express');
const path = require('path');
const morgan = require('morgan');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const multer = require('multer');

require('./database');
require('../libs/passport');
const MainRoutes = require('../routes/index.routes');

module.exports = app => {

  // init
  app = express();

  // settings
  app.set('port', process.env.PORT || 3000);
  app.set('views', path.join(__dirname, '../views'));
  app.set('view engine', 'ejs');

  // middlewares
  app.use(morgan('dev'));
  app.use(express.urlencoded({ extended: false }));
  app.use(methodOverride('_method'));
  app.use(session({
    secret: '@MxWell_#',
    resave: false,
    saveUninitialized: false
  }));
  app.use(flash());
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(multer({
    dest: path.join(__dirname, '../public/upload/temp')
  }).single('image'));
  app.use(express.json());

  // global variables
  app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.message = req.flash('message');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
  });

  // routes
  app.use('/', MainRoutes);

  // public
  app.use('/public', express.static(path.join(__dirname, '../public')));

  return app;
}