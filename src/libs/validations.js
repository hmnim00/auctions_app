const { check } = require('express-validator');

exports.signIn = [
  check('email').notEmpty().withMessage('Email required').normalizeEmail().isEmail().withMessage('Must enter a valid email'),
  check('password').trim().notEmpty().withMessage('Password required').isLength({min: 6}).withMessage('Password must be at least six characters long').not().matches(/^$|\s+/).withMessage('White spaces not allowed')
];