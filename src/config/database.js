const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/auctions_db', {
  useCreateIndex: true,
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useFindAndModify: true
}).then(db => console.log(`Database online`)).catch(err => console.log(err));