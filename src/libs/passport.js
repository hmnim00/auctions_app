const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');

passport.use('local.signup', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, email, password, done) => {

  const { firstName, lastName, confirm } = req.body;

  const user = new User({
    firstName,
    lastName,
    email,
    password
  });

  if (password != confirm) {
    return done(null, false, req.flash('error_msg', 'Passwords must match'));
  } else {

    

    // check email
    const checkEmail = await User.findOne({ email });
    if (checkEmail) {
      return done(null, false, req.flash('error_msg', 'Email already taken'));
    }

    // try to save the new user
    try {
      user.password = await user.encryptPassword(password);
      await user.save();
      return done(null, user);
    } catch (error) {
      return done(null, false, req.flash('error_msg', 'Cannot save the user in this moment'));
    }
  }

}));

passport.use('local.signin', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, email, password, done) => {

  let user;

  try {
    user = await User.findOne({ email });
  } catch (error) {
    return done(null, false, req.flash('error_msg', 'Username or password are invalid'));
  }

  if (user) {
    try {
      const match = await user.matchPassword(password);
      return done(null, user);
    } catch (error) {
      return done(null, false, req.flash('error_msg', 'Username or password are invalid'));
    }
  } else {
    return done(null, false, req.flash('error_msg', 'Username or password are invalid'));
  }

}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});