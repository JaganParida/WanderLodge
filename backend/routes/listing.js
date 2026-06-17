const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isHost, isOwner, validateListing, parseFormData } = require("../middleware.js");
const listingControllers = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// Index Route and Create Route API
router
  .route("/")
  .get(wrapAsync(listingControllers.index))
  .post(
    isLoggedIn,
    isHost,
    upload.array("listing[images]", 10),
    parseFormData,
    validateListing,
    wrapAsync(listingControllers.createListing)
  );

// Show, Update, Delete API Routes
router
  .route("/:id")
  .get(wrapAsync(listingControllers.showListing))
  .put(
    isLoggedIn,
    isHost,
    isOwner,
    upload.array("listing[images]", 10),
    parseFormData,
    validateListing,
    wrapAsync(listingControllers.updateListing)
  )
  .delete(isLoggedIn, isHost, isOwner, wrapAsync(listingControllers.destroyListing));

module.exports = router;
