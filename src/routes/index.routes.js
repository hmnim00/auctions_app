const {Router} = require('express');
const ListingControl = require('../controller/listingController');
const ListingRoutes = require('./listing.routes');
const AuthRoutes = require('./auth.routes');
const CommentRoutes = require('./comment.routes');

const router = Router();

router.get('/', ListingControl.getActiveListings);

router.use('/listing', ListingRoutes);
router.use('/user', AuthRoutes);
router.use('/comment', CommentRoutes);

module.exports = router;