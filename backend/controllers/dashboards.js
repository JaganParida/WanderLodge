const User = require("../models/user");
const Listing = require("../models/listing");
const Booking = require("../models/booking");

// Profile Dashboard API
module.exports.renderProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate({
            path: 'bookings',
            populate: {
                path: 'listing',
                populate: { path: 'reviews', select: 'rating' }
            }
        }).populate({
            path: 'wishlist',
            populate: { path: 'reviews', select: 'rating' }
        });
        
        const myBookings = await Booking.find({ user: req.user._id })
            .populate({
                path: 'listing',
                populate: { path: 'reviews', select: 'rating' }
            })
            .sort({ createdAt: -1 });

        const myListings = await Listing.find({ owner: req.user._id })
            .populate({ path: 'reviews', select: 'rating' });
        const myListingIds = myListings.map(listing => listing._id);

        const hostReservations = await Booking.find({ listing: { $in: myListingIds } })
            .populate({
                path: 'listing',
                select: 'title images price location reviews',
                populate: { path: 'reviews', select: 'rating' }
            })
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
