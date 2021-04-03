const mongoose = require('mongoose');
const slugify = require('slugify');

const listingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  imageUrl: { type: String, required: true },
  price: { type: Number, required: true },
  currentBid: { type: Number, required: true },
  status: { type: Boolean, default: true },
  slug: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  created: { type: Date, default: () => Date.now() },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  winner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

listingSchema.pre('validate', function (next) {
  if (this.title) this.slug = slugify(this.title, { lower: true, strict: true });
  next();
});

module.exports = mongoose.model('Listing', listingSchema);