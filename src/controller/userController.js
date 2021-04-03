const User = require('../models/user');

const userCtrl = {};

userCtrl.signinForm = (req, res) => {
  res.render('auth/signin');
}

userCtrl.signupForm = (req, res) => {
  res.render('auth/signup');
}

userCtrl.signout = (req, res) => {
  req.logOut();
  res.redirect('/');
}

module.exports = userCtrl;