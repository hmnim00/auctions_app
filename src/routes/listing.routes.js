const { Router } = require('express');
const ListingControl = require('../controller/listingController');
const { isLoggedIn } = require('../libs/functions');

const router = Router();

router.get('/closed-listings', isLoggedIn, ListingControl.getClosedListings);
router.get('/add', isLoggedIn, ListingControl.addForm);
router.get('/:slug', ListingControl.getListing);
router.post('/create', isLoggedIn, ListingControl.createListing);
router.post('/:id/add-offer', isLoggedIn, ListingControl.addOffer);
router.post('/:id/close-listing', isLoggedIn, ListingControl.closeListing);

module.exports = router;