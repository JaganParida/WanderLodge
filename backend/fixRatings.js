const mongoose = require('mongoose');
require('dotenv').config({ path: './.env' });
const Listing = require('./models/listing.js');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  await Listing.updateMany({ reviews: { $size: 0 } }, { $set: { rating: 0 } });
  console.log('Updated DB');
  process.exit();
}).catch(err => {
  console.error(err);
  process.exit(1);
});
