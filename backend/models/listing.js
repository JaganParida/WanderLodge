const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  images: [
    {
      url: String,
      filename: String,
    }
  ],
  price: Number,
  location: String,
  country: String,
  category: {
    type: String,
    enum: ['Beachfront', 'Cabins', 'OMG!', 'Trending', 'Lakefront', 'Castles', 'Farms', 'Tiny homes', 'Pools', 'City'],
    default: 'Trending'
  },
  amenities: [String],
  maxGuests: { type: Number, default: 2 },
  bedrooms: { type: Number, default: 1 },
  beds: { type: Number, default: 1 },
  rating: { type: Number, default: 0 },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  geometry: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  blockedDates: [
    {
      type: Date,
    },
  ],
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
