const { Router } = require('express');
const { validationResult, matchedData } = require('express-validator');
const passport = require('passport');
const AuthController = require('../controller/userController');
const { isLoggedIn } = require('../libs/functions');
const validations = require('../libs/validations');

const router = Router();

router.get('/signin', AuthController.signinForm);
router.get('/signup', AuthController.signupForm);
router.get('/signout', isLoggedIn, AuthController.signout);

router.post('/signup', validations.signUp, (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    var errMsg = errors.mapped();
    var inputData = matchedData(req);
    res.render('auth/signup', { errors: errMsg, inputData });
  } else {
    var inputData = matchedData(req);
    next();
  }
}, passport.authenticate('local.signup', {
  successRedirect: '/',
  failureRedirect: '/user/signup'
}));

router.post('/signin', validations.signIn, (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    var errMsg = errors.mapped();
    res.render('auth/signin', { errors: errMsg })
  } else {
    next();
  }
}, passport.authenticate('local.signin', {
  successRedirect: '/',
  failureRedirect: '/user/signin'
}));

// router.post('/signin', passport.authenticate('local.signin', {
//   successRedirect: '/',
//   failureRedirect: '/user/signin',
//   failureFlash: true
// }));

module.exports = router;