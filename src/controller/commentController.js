const Comment = require('../models/comment');
const Listing = require('../models/listing');

const commentCtrl = {};

commentCtrl.addComment = async (req, res) => {
  const { comment } = req.body;
  const { id } = req.params;
  const userId = res.locals.user.id;

  const listing = await Listing.findById({ _id: id });

  const newComment = new Comment({
    comment,
    listing,
    user: userId
  });

  try {
    await newComment.save();
    res.redirect(`/listing/${listing.slug}`);
  } catch (error) {
    console.log('Cannot post a message');
  }
}

commentCtrl.deleteComment = async (req, res) => {

  const { id } = req.params;
  const userId = res.locals.user.id;
  let comment;
  let listing;

  try {
    comment = await Comment.findById({ _id: id });
    listing = await Listing.findOne({ _id: comment.listing });
  } catch (error) {
    console.log(`Cannot find the message`);
  }

  const slug = listing.slug;

  if (userId == comment.user) {
    comment.delete(id);
    res.redirect(`/listing/${slug}`);
  } else {
    console.log(`Cannot delete a comment from another user`);
  }

}

module.exports = commentCtrl;