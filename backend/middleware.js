const Listing = require("./models/listing");
const { listingSchema, reviewSchema, bookingSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");
const Review = require("./models/review.js");
const jwt = require("jsonwebtoken");
const User = require("./models/user.js");

// Check if the user is logged in via JWT httpOnly cookie
module.exports.isLoggedIn = async (req, res, next) => {
  try {
    // Read JWT from httpOnly cookie (not from Authorization header)
    const token = req.cookies?.jwt;
    
    if (!token) {
      return res.status(401).json({ error: "Not authorized, please log in" });
    }

    const decoded = jwt.verify(token, process.env.SECRET);
    req.user = await User.findById(decoded._id).select('-hash -salt');
    
    if (!req.user) {
      return res.status(401).json({ error: "User no longer exists" });
    }
    
    next();
  } catch (error) {
    res.status(401).json({ error: "Not authorized, session expired" });
  }
};

// Server-side role check: Only allow host or admin
module.exports.isHost = (req, res, next) => {
  if (!req.user || (req.user.role !== 'host' && req.user.role !== 'admin')) {
    return res.status(403).json({ error: "Forbidden: Host access required" });
  }
  next();
};

// Check if the user is the owner of the listing
module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    return res.status(404).json({ error: "Listing not found!" });
  }

  if (!listing.owner.equals(req.user._id)) {
    return res.status(403).json({ error: "You do not have permission to do that!" });
  }
  next();
};

// Parse Multipart Form Data for Listing
module.exports.parseFormData = (req, res, next) => {
  if (req.body && !req.body.listing) {
    const listing = {};
    for (const key in req.body) {
      if (key.startsWith("listing[")) {
        const fieldMatch = key.match(/listing\[(.*?)\]/);
        if (fieldMatch && fieldMatch[1]) {
          listing[fieldMatch[1]] = req.body[key];
        }
      }
    }
    if (Object.keys(listing).length > 0) {
      req.body.listing = listing;
    }
  }
  next();
};

// Handle error of listing
module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

// Handle error of review
module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

// Handle error of booking
module.exports.validateBooking = (req, res, next) => {
  let { error } = bookingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

// Check if the user is the owner of the review
module.exports.isReviewAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);

  if (!review) {
    return res.status(404).json({ error: "Review not found!" });
  }

  if (!review.author.equals(req.user._id)) {
    return res.status(403).json({ error: "You do not have permission to do that!" });
  }
  next();
};
