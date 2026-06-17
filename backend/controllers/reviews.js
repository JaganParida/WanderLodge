const Listing = require("../models/listing");
const Review = require("../models/review");

// Helper to recalculate rating
const updateListingRating = async (listingId) => {
  const listing = await Listing.findById(listingId).populate('reviews');
  if (!listing) return;
  
  if (listing.reviews.length === 0) {
    listing.rating = 0;
  } else {
    const totalRating = listing.reviews.reduce((sum, rev) => sum + rev.rating, 0);
    listing.rating = totalRating / listing.reviews.length;
  }
  await listing.save();
};

// Create Review API
module.exports.createReview = async (req, res) => {
  try {
    let listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ error: "Listing not found" });

    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    
    // Recalculate average
    await updateListingRating(listing._id);

    res.status(201).json({ message: "New Review Created!", review: newReview });
  } catch (error) {
    res.status(500).json({ error: "Failed to create review", details: error.message });
  }
};

// Delete Review API
module.exports.destroyReview = async (req, res) => {
  try {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    let deletedReview = await Review.findByIdAndDelete(reviewId);
    
    if (!deletedReview) return res.status(404).json({ error: "Review not found" });
    
    // Recalculate average
    await updateListingRating(id);

    res.json({ message: "Review Deleted!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete review", details: error.message });
  }
};
