const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isHost } = require("../middleware.js");
const Listing = require("../models/listing.js");
const Booking = require("../models/booking.js");

// Get Host Analytics
router.get("/analytics", isLoggedIn, isHost, wrapAsync(async (req, res) => {
  // Find all listings owned by this host
  const listings = await Listing.find({ owner: req.user._id });
  const listingIds = listings.map(l => l._id);

  // Find all bookings for these listings
  const bookings = await Booking.find({ listing: { $in: listingIds } }).populate('listing', 'title location images').populate('user', 'username email');

  // Calculate total earnings (only Confirmed bookings)
  const totalEarnings = bookings
    .filter(b => b.status === 'Confirmed')
    .reduce((sum, b) => sum + b.totalPrice, 0);

  // Calculate monthly earnings for charts
  const monthlyEarnings = {};
  bookings.filter(b => b.status === 'Confirmed').forEach(b => {
    const month = b.checkIn.toLocaleString('default', { month: 'short' });
    monthlyEarnings[month] = (monthlyEarnings[month] || 0) + b.totalPrice;
  });

  const chartData = Object.keys(monthlyEarnings).map(month => ({
    name: month,
    revenue: monthlyEarnings[month]
  }));

  res.json({
    totalListings: listings.length,
    totalBookings: bookings.length,
    totalEarnings,
    chartData,
    reservations: bookings // Send reservations so frontend can manage them
  });
}));

// Update Reservation Status (Accept/Reject)
router.patch("/reservations/:id", isLoggedIn, isHost, wrapAsync(async (req, res) => {
  const { status } = req.body;
  if (!['Confirmed', 'Cancelled'].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  const booking = await Booking.findById(req.params.id).populate('listing');
  if (!booking) return res.status(404).json({ error: "Booking not found" });

  // Ensure this host owns the listing
  if (booking.listing.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({ error: "Not authorized" });
  }

  // If status is changed to Cancelled, unblock the dates
  if (status === 'Cancelled' && booking.status !== 'Cancelled') {
    const listing = booking.listing;
    if (listing.blockedDates && listing.blockedDates.length > 0) {
      listing.blockedDates = listing.blockedDates.filter(
        date => {
          const d = new Date(date);
          return d < new Date(booking.checkIn) || d >= new Date(booking.checkOut);
        }
      );
      await listing.save();
    }
  }

  booking.status = status;
  await booking.save();
  res.json({ message: `Booking ${status}` });
}));

module.exports = router;
