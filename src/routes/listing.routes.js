const { Router } = require('express');
const { validationResult, matchedData } = require('express-validator');
const ListingControl = require('../controller/listingController');
const { isLoggedIn } = require('../libs/functions');
const validations = require('../libs/validations');

const router = Router();

router.get('/closed-listings', isLoggedIn, ListingControl.getClosedListings);
router.get('/add', isLoggedIn, ListingControl.addForm);
router.get('/:slug', ListingControl.getListing);
router.post('/:id/add-offer', isLoggedIn, ListingControl.addOffer);
router.post('/:id/close-listing', isLoggedIn, ListingControl.closeListing);
router.delete('/:id/delete', isLoggedIn, ListingControl.deleteListing);

router.post('/create', isLoggedIn, validations.newListing, (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    var errMsg = errors.mapped();
    var inputData = matchedData(req);
    res.render('listing/create', { errors: errMsg, inputData });
  } else {
    var inputData = matchedData(req);
    next();
  }
}, ListingControl.createListing);

module.exports = router;