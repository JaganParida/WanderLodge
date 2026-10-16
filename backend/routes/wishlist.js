const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn } = require("../middleware.js");
const wishlistController = require("../controllers/wishlists.js");
const User = require("../models/user.js");

// GET User Wishlist
router.get("/", isLoggedIn, wrapAsync(async (req, res) => {
  const user = await User.findById(req.user._id).populate({
    path: "wishlist",
    populate: { path: "reviews", select: "rating" },
  });
  res.json({ wishlist: user?.wishlist || [] });
}));

// Toggle Wishlist Routes (supports both /:id and /:id/toggle)
router.post("/:id/toggle", isLoggedIn, wrapAsync(wishlistController.toggleWishlist));
router.post("/:id", isLoggedIn, wrapAsync(wishlistController.toggleWishlist));

module.exports = router;
