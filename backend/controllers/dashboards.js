const User = require("../models/user");
const Listing = require("../models/listing");
const Booking = require("../models/booking");

// Profile Dashboard API
module.exports.renderProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate({
            path: 'wishlist',
            model: 'Listing'
        });

        const myBookings = await Booking.find({ user: req.user._id })
            .populate('listing')
            .sort({ createdAt: -1 });

        const myListings = await Listing.find({ owner: req.user._id });
        const myListingIds = myListings.map(listing => listing._id);

        const hostReservations = await Booking.find({ listing: { $in: myListingIds } })
            .populate('listing', 'title images')
            .populate('user', 'username email')
            .sort({ createdAt: -1 });

        const totalEarnings = hostReservations.reduce((acc, booking) => acc + booking.totalPrice, 0);

        res.json({ 
            user, 
            myBookings, 
            myListings,
            wishlist: user.wishlist,
            hostReservations,
            totalEarnings
        });
    } catch (error) {
        res.status(500).json({ error: "Error loading dashboard", details: error.message });
    }
};
