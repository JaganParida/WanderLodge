const Booking = require("../models/booking");
const Listing = require("../models/listing");

// Calculate Pricing API (replaces renderCheckout)
module.exports.calculatePricing = async (req, res) => {
    try {
        const { id } = req.params;
        const { checkIn, checkOut, guests } = req.body;
        
        if (!checkIn || !checkOut || !guests) {
            return res.status(400).json({ error: "Please select valid dates and guests." });
        }

        const listing = await Listing.findById(id);
        if (!listing) {
            return res.status(404).json({ error: "Listing not found" });
        }

        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        const timeDifference = checkOutDate.getTime() - checkInDate.getTime();
        const nights = Math.ceil(timeDifference / (1000 * 3600 * 24));
        
        if (nights <= 0) {
            return res.status(400).json({ error: "Check-out must be after check-in date." });
        }
        
        const numGuests = parseInt(guests) || 1;
        if (numGuests > (listing.maxGuests || 10)) {
            return res.status(400).json({ error: `Maximum guest capacity is ${listing.maxGuests || 10}.` });
        }

        const basePrice = listing.price * nights * numGuests;
        const tax = Math.round(basePrice * 0.18);
        const serviceFee = Math.round(basePrice * 0.05);
        const totalPrice = basePrice + tax + serviceFee;

        res.json({ 
            nights, 
            basePrice, 
            tax, 
            serviceFee, 
            totalPrice 
        });
    } catch (error) {
        res.status(500).json({ error: "Something went wrong.", details: error.message });
    }
};

// Process Booking API
module.exports.createBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const { checkIn, checkOut, guests, totalPrice } = req.body;

        const listing = await Listing.findById(id);
        if (!listing) {
            return res.status(404).json({ error: "Listing not found" });
        }

        const numGuests = parseInt(guests) || 1;
        if (numGuests > (listing.maxGuests || 10)) {
            return res.status(400).json({ error: `Maximum guest capacity is ${listing.maxGuests || 10}.` });
        }

        const newBooking = new Booking({
            user: req.user._id,
            listing: id,
            checkIn: new Date(checkIn),
            checkOut: new Date(checkOut),
            guests: parseInt(guests),
            totalPrice: parseInt(totalPrice),
            status: 'Confirmed'
        });

        await newBooking.save();

        let currDate = new Date(checkIn);
        const endDate = new Date(checkOut);
        
        while (currDate <= endDate) {
            listing.blockedDates.push(new Date(currDate));
            currDate.setDate(currDate.getDate() + 1);
        }
        
        await listing.save();

        res.status(201).json({ message: "Booking confirmed successfully!", bookingId: newBooking._id });
    } catch (error) {
        res.status(500).json({ error: "Failed to process booking.", details: error.message });
    }
};

// Cancel Booking API
module.exports.cancelBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const booking = await Booking.findById(bookingId).populate("listing");
        
        if (!booking) {
            return res.status(404).json({ error: "Booking not found" });
        }

        if (!booking.user.equals(req.user._id)) {
            return res.status(403).json({ error: "Not authorized to cancel this booking." });
        }

        if (booking.status === 'Cancelled') {
            return res.status(400).json({ error: "Booking is already cancelled." });
        }

        booking.status = 'Cancelled';
        await booking.save();

        // Unblock the dates on the listing
        if (booking.listing && booking.listing.blockedDates) {
            const checkIn = new Date(booking.checkIn);
            const checkOut = new Date(booking.checkOut);
            booking.listing.blockedDates = booking.listing.blockedDates.filter(date => {
                const d = new Date(date);
                return d < checkIn || d > checkOut;
            });
            await booking.listing.save();
        }

        res.json({ message: "Booking cancelled successfully." });
    } catch (error) {
        res.status(500).json({ error: "Failed to cancel booking.", details: error.message });
    }
};

// Get Invoice API
module.exports.getInvoice = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const booking = await Booking.findById(bookingId).populate("listing").populate("user", "username email");
        
        if (!booking || !booking.user._id.equals(req.user._id)) {
            return res.status(403).json({ error: "Booking not found or unauthorized access." });
        }

        res.json(booking);
    } catch (error) {
        res.status(500).json({ error: "Something went wrong.", details: error.message });
    }
};
