const mongoose = require('mongoose');
require('dotenv').config({ path: './.env' });
const Listing = require('./models/listing.js');
const Review = require('./models/review.js');

mongoose.connect(process.env.ATLASDB_URL).then(async () => {
  const listings = await Listing.find().populate('reviews');
  for (let l of listings) {
    if (l.reviews.length === 0) {
      l.rating = 0;
    } else {
      const total = l.reviews.reduce((sum, rev) => sum + rev.rating, 0);
      l.rating = total / l.reviews.length;
    }
    await l.save();
  }
  console.log('Fixed All Ratings successfully!');
  process.exit();
}).catch(err => {
  console.error(err);
  process.exit(1);
});
