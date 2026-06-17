const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, validateBooking } = require("../middleware.js");
const bookingController = require("../controllers/bookings.js");

// Calculate Pricing API
router.post("/book/calculate", isLoggedIn, wrapAsync(bookingController.calculatePricing));

// Process Booking API
router.post("/book", isLoggedIn, validateBooking, wrapAsync(bookingController.createBooking));

// Invoice / Confirmation API
router.get("/:bookingId/invoice", isLoggedIn, wrapAsync(bookingController.getInvoice));

// Cancel Booking API
router.patch("/:bookingId/cancel", isLoggedIn, wrapAsync(bookingController.cancelBooking));

module.exports = router;
