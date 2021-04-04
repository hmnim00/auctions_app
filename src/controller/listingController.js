const path = require('path');
const fs = require('fs-extra')
const Listing = require('../models/listing');
const Bid = require('../models/bid');
const Comment = require('../models/comment');
const { randomName } = require('../libs/functions');

const listingCtrl = {};

listingCtrl.addForm = (req, res) => {
  res.render('listing/create');
}

listingCtrl.createListing = async (req, res) => {

  // recursion
  const saveListing = async () => {

    // generate a random name
    const imgUrl = randomName();

    // look for imgUrl repeated
    const result = await Listing.find({ imageUrl: imgUrl });

    // if exists
    if (result.length > 0) {
      // repeat the function (recursivity)
      saveListing();
    } else {
      // Save the new listing
      const imgTempPath = req.file.path;
      const ext = path.extname(req.file.originalname).toLowerCase();
      const targetPath = path.resolve(`src/public/upload/${imgUrl}${ext}`);

      const { title, description, price, category } = req.body;
      const userId = res.locals.user._id;

      // validate extensions
      if (ext === '.jpg' || ext === '.jpeg' || ext === '.png' || ext === '.gif' || ext === '.webp') {
        // if is valid, move the file from temp folder
        await fs.rename(imgTempPath, targetPath);
        // create a "Listing" object
        const listing = new Listing({
          title,
          description,
          price,
          category,
          imageUrl: imgUrl + ext,
          currentBid: price,
          user: userId
        });

        // try to save the new listing
        try {
          await listing.save();
          res.redirect(`/listing/${listing.slug}`);
        } catch (error) {
          console.log(error);
        }
      } else {
        fs.unlink(imgTempPath);
        req.flash('error_msg', 'Only images are allowed');
        res.redirect('/listing/add');
      }
    }
  }

  saveListing();

}

listingCtrl.getActiveListings = async (req, res) => {
  try {
    const listings = await Listing.find({ status: true });
    res.render('index', { listings });
  } catch (error) {
    console.log(error);
  }
}

listingCtrl.getClosedListings = async (req, res) => {
  try {
    const listings = await Listing.find({ status: false });
    res.render('listing/closed', { listings });
  } catch (error) {
    console.log(error);
  }
}

listingCtrl.getListing = async (req, res) => {
  const { slug } = req.params;
  // get listing
  try {
    // TODO comments
    const listing = await Listing.findOne({ slug }).lean().populate(['user']);
    const comments = await Comment.find({ listing }).lean().populate(['user']);
    // console.log(listing);
    res.render('listing/preview', { listing, comments });
  } catch (error) {
    console.log(error);
  }
}

listingCtrl.addOffer = async (req, res) => {
  const bid = req.body.bid;
  const userId = res.locals.user._id;
  const { id } = req.params;

  const listing = await Listing.findById({ _id: id });

  // if the listing is active can make an offer
  if (listing.status) {
    // if the bid is less than current one, show a message
    if (bid <= listing.currentBid) {
      // res.status(409).json({ message: 'Offer must be greater than the current one' });
      req.flash('error_msg', 'Offer must be greater than the current one');
      res.redirect(`/listing/${listing.slug}`);
    } else {
      // Check if another bid exists
      const listingBid = await Bid.find({ listing });
      if (listingBid.length > 0) {
        await Bid.deleteOne({ listing });
        const newBid = new Bid({
          bid,
          listing,
          user: userId
        });
        // try to save the new offer and update the listing
        try {
          listing.currentBid = bid;
          newBid.save();
          listing.save();
          req.flash('success_msg', 'Offer added succesfully');
          res.redirect(`/listing/${listing.slug}`);
        } catch (error) {
          console.log(error);
        }
      } else {
        // if no previous offers, create a new one
        const newBid = new Bid({
          bid,
          listing,
          user: userId
        });
        // try to save the new offer and update the listing
        try {
          listing.currentBid = bid;
          newBid.save();
          listing.save();
          req.flash('success_msg', 'Offer added succesfully');
          res.redirect(`/listing/${listing.slug}`);
        } catch (error) {
          console.log(error);
        }
      }
    }
  }

}

listingCtrl.closeListing = async (req, res) => {

  const { id } = req.params;

  // search listing
  let listing = await Listing.findById({ _id: id });

  if (listing) {

    if (listing.status) {

      if (listing.price == listing.currentBid) {
        req.flash('error', 'Cannot close a listing without any offer made on it');
        res.redirect(`/listing/${listing.slug}`);
      } else {

        try {
          const bid = await Bid.findOne({ listing: listing });
          // update the listing
          listing.winner = bid.user;
          listing.status = false;
          listing.save();
          res.redirect(`/listing/${listing.slug}`);
        } catch (error) {
          console.log(error);
        }
      }
    } else {
      res.status(409).json({ message: 'Listing has already been closed' });
    }
  }

}

listingCtrl.deleteListing = async (req, res) => {
  const { id } = req.params;
  try {
    await Listing.findOneAndDelete(id);
    res.redirect('/');
  } catch (error) {
    console.log(error);
  }
}

module.exports = listingCtrl;