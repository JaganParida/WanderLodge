const Listing = require("../models/listing.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

// Index Route
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({}).populate("owner");
  res.render("listings/index.ejs", { allListings });
};

// New Route
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

// Show Route
module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Cannot find that listing!");
    return res.redirect("/listings"); // Correctly using return
  }
  res.render("listings/show.ejs", { listing });
};

// Create Route (ADDED SAFETY CHECKS)
module.exports.createListing = async (req, res, next) => {
  // 1. Check if geocoding works
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();

  // 2. Ensure we have an image before proceeding
  if (!req.file) {
    req.flash("error", "Listing image is required!");
    return res.redirect("/listings/new");
  }

  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };

  // 3. Safety check for Mapbox geometry
  if (response.body.features.length > 0) {
    newListing.geometry = response.body.features[0].geometry;
  }

  await newListing.save();
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};

// Edit Route
module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Cannot find that listing!");
    return res.redirect("/listings"); // Correctly using return
  }
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_250,w_300");
  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

// Update Route (ADDED RETURN)
module.exports.updateListing = async (req, res) => {
  let { id } = req.params;

  // Find the listing first to check ownership or existence
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (!listing) {
    req.flash("error", "Cannot find listing to update!");
    return res.redirect("/listings");
  }

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }

  req.flash("success", "Listing Updated");
  return res.redirect(`/listings/${id}`); // Added return for consistency
};

// Delete Route
module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted");
  res.redirect("/listings");
};
