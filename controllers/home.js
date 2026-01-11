const Listing = require("../models/listing.js");

// Home Route - Modern Landing Page
module.exports.home = async (req, res) => {
  // Get featured listings (limit to 8 for the homepage)
  const featuredListings = await Listing.find({})
    .populate("owner")
    .limit(8)
    .sort({ _id: -1 }); // Get latest listings

  res.render("home.ejs", { featuredListings });
};
