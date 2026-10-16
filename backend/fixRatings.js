const mongoose = require('mongoose');
require('dotenv').config({ path: './.env' });
const Listing = require('./models/listing.js');

const dbUrl = process.env.ATLASDB_URL || process.env.MONGO_URI || process.env.MONGO_URL;
if (!dbUrl) {
  console.error("No database URL provided in environment.");
  process.exit(1);
}

mongoose.connect(dbUrl).then(async () => {
  await Listing.updateMany({ reviews: { $size: 0 } }, { $set: { rating: 0 } });
  console.log('Updated DB');
  process.exit();
}).catch(err => {
  console.error(err);
  process.exit(1);
});
