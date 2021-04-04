const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');

passport.use('local.signup', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, email, password, done) => {

  const { firstName, lastName } = req.body;

  try {
    const user = new User({
      firstName,
      lastName,
      email,
      password
    });
    await user.save();
    return done(null, user);
  } catch (error) {
    console.log(error);
  }

}));

passport.use('local.signin', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, email, password, done) => {

  try {
    const user = await User.findOne({ email });
    if (user) {
      const matchPswd = await user.matchPassword(password);
      if (matchPswd) {
        return done(null, user);
      } else {
        return done(null, false, req.flash('error_msg', 'Username and/or password are invalid'));
      }
    } else {
      return done(null, false, req.flash('error_msg', 'Username and/or password are invalid'));
    }
  } catch (error) {
    console.log(error);
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