const timeago = require('timeago.js');

const functions = {};

functions.getTimeAgo = (timestamp) => {
  return timeago.format(timestamp);
}

functions.randomName = () => {
  const possible = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let textString = 0;
  for (let i = 0; i < 10; i++) {
    textString += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return textString;
}

functions.monetaryFormat = (price) => {
  return Intl.NumberFormat('en-US', {style: 'currency', currency: 'US'}).format(price);
}

functions.isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()) return next();
  return res.redirect('/user/signin');
}

module.exports = functions;