const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn } = require("../middleware.js");
const wishlistController = require("../controllers/wishlists.js");

// Toggle Wishlist Route
router.post("/:id/toggle", isLoggedIn, wrapAsync(wishlistController.toggleWishlist));

module.exports = router;
