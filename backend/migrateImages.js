const mongoose = require('mongoose');
require('dotenv').config({ path: './.env' });
const Listing = require('./models/listing.js');

mongoose.connect(process.env.ATLASDB_URL).then(async () => {
  console.log("Connected to DB, running migration...");
  
  // Get all listings where image exists but images array is empty or missing
  // We use the strict mongoose connection to pull raw docs since the schema dropped 'image'
  const listings = await mongoose.connection.db.collection('listings').find({ image: { $exists: true } }).toArray();
  
  console.log(`Found ${listings.length} listings to migrate.`);
  
  let count = 0;
  for (let listing of listings) {
    if (listing.image && listing.image.url) {
      await mongoose.connection.db.collection('listings').updateOne(
        { _id: listing._id },
        { 
          $set: { images: [listing.image] },
          $unset: { image: "" }
        }
      );
      count++;
    }
  }
  
  console.log(`Successfully migrated ${count} listings.`);
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
