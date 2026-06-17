const User = require("../models/user");
const Listing = require("../models/listing");

// Toggle Wishlist API
module.exports.toggleWishlist = async (req, res) => {
    try {
        const { id } = req.params; // listing id
        const user = await User.findById(req.user._id);
        
        // Check if listing exists
        const listing = await Listing.findById(id);
        if (!listing) {
            return res.status(404).json({ error: "Listing not found" });
        }

        // Check if already in wishlist
        const index = user.wishlist.indexOf(id);
        let message = "";
        
        if (index > -1) {
            // Remove from wishlist
            user.wishlist.splice(index, 1);
            message = "Removed from Wishlist";
        } else {
            // Add to wishlist
            user.wishlist.push(id);
            message = "Added to Wishlist";
        }
        
        await user.save();
        res.json({ message, wishlist: user.wishlist });
    } catch (error) {
        res.status(500).json({ error: "Something went wrong while updating your wishlist.", details: error.message });
    }
};
