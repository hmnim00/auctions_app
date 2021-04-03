const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
  bid: { type: Number, required: true },
  created: { type: Date, default: () => Date.now() },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  listing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing' }
});

module.exports = mongoose.model('Bid', bidSchema);