const { check } = require('express-validator');
const User = require('../models/user');

exports.signUp = [
  check('firstName').trim().notEmpty().withMessage('First name is required').matches(/^[a-zA-Z]*$/).withMessage('Only characters with white space are allowed'),
  check('lastName').matches(/^[a-zA-Z]*$/).withMessage('Only characters with white space are allowed'),
  check('email').notEmpty().withMessage('Email address is required').normalizeEmail().isEmail().withMessage('Must be a valid email address')
    .custom(async (value, { req }) => {
      const user = await User.findOne({ email: req.body.email });
      if (user) {
        throw new Error('Email has been already registered');
      }
      return true;
    }),
  check('password').trim().notEmpty().withMessage('Password required')
    .isLength({ min: 5 }).withMessage('Password must be at least 6 characters long')
    .not().matches(/^$|\s+/).withMessage('White spaces are not allowed'),
  check('confirm').custom((value, { req }) => {
    if (value != req.body.password) {
      throw new Error('Must match with password');
    }
    return true;
  })
];

exports.signIn = [
  check('email').notEmpty().withMessage('Email required').normalizeEmail().isEmail().withMessage('Must enter a valid email'),
  check('password').trim().notEmpty().withMessage('Password required')
];