const Listing = require("../models/listing.js");
const Booking = require("../models/booking.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mapToken ? mbxGeocoding({ accessToken: mapToken }) : null;

// Index Route API
module.exports.index = async (req, res) => {
  try {
    const { search, category, location, guests, checkIn, checkOut } = req.query;
    let query = {};

    // General search or specific location search
    const searchTerm = search || location;
    if (searchTerm) {
      const searchRegex = new RegExp(searchTerm.trim(), "i");
      query.$or = [
        { title: searchRegex },
        { location: searchRegex },
        { country: searchRegex },
        { description: searchRegex },
      ];
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (guests) {
      const numGuests = parseInt(guests);
      if (!isNaN(numGuests)) {
        // Find listings that can accommodate AT LEAST the requested number of guests
        query.maxGuests = { $gte: numGuests };
      }
    }

    // Price Filter
    const { minPrice, maxPrice } = req.query;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice && !isNaN(parseInt(minPrice))) query.price.$gte = parseInt(minPrice);
      if (maxPrice && !isNaN(parseInt(maxPrice))) query.price.$lte = parseInt(maxPrice);
    }

    // Amenities Filter
    const reqAmenities = req.query.amenities;
    if (reqAmenities) {
      const amenitiesArray = Array.isArray(reqAmenities) ? reqAmenities : reqAmenities.split(',');
      if (amenitiesArray.length > 0) {
        query.amenities = { $all: amenitiesArray };
      }
    }

    // Availability Filter (Date overlap logic)
    if (checkIn && checkOut) {
      const parsedCheckIn = new Date(checkIn);
      const parsedCheckOut = new Date(checkOut);
      
      // Find all bookings that overlap with requested dates
      // Overlap occurs if existing booking starts before requested checkout AND ends after requested checkin
      const overlappingBookings = await Booking.find({
        status: { $in: ['Pending', 'Confirmed'] },
        checkIn: { $lt: parsedCheckOut },
        checkOut: { $gt: parsedCheckIn }
      }).select('listing');

      const unavailableListingIds = overlappingBookings.map(b => b.listing);
      
      if (unavailableListingIds.length > 0) {
        query._id = { $nin: unavailableListingIds };
      }
    }

    const allListings = await Listing.find(query)
      .populate("owner", "username email")
      .populate({ path: "reviews", select: "rating" });
    res.json(allListings);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch listings" });
  }
};

// Show Route API
module.exports.showListing = async (req, res) => {
  try {
    let { id } = req.params;
    const listing = await Listing.findById(id)
      .populate({ path: "reviews", populate: { path: "author", select: "username email" } })
      .populate("owner", "username email");
      
    if (!listing) {
      return res.status(404).json({ error: "Cannot find that listing" });
    }
    res.json(listing);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch listing details" });
  }
};

// Create Route API
module.exports.createListing = async (req, res, next) => {
  try {
    let response = null;
    try {
      if (geocodingClient) {
        response = await geocodingClient
          .forwardGeocode({
            query: req.body.listing.location,
            limit: 1,
          })
          .send();
      } else {
        console.log("Mapbox client not initialized. Skipping geocoding.");
      }
    } catch (mapErr) {
      console.log("Mapbox Error (Skipping geocoding):", mapErr.message);
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "At least one listing image is required" });
    }

    const images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    const newListing = new Listing(req.body.listing);
    
    // In JWT setup, req.user will be populated by middleware
    newListing.owner = req.user._id;
    newListing.images = images;

    if (response && response.body && response.body.features && response.body.features.length > 0) {
      newListing.geometry = response.body.features[0].geometry;
    } else {
      // Default point if geocoding fails
      newListing.geometry = { type: 'Point', coordinates: [0, 0] };
    }

    await newListing.save();
    res.status(201).json({ message: "New Listing Created", listing: newListing });
  } catch (error) {
    res.status(500).json({ error: "Failed to create listing", details: error.message });
  }
};

// Update Route API
module.exports.updateListing = async (req, res) => {
  try {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });

    if (!listing) {
      return res.status(404).json({ error: "Cannot find listing to update" });
    }

    if (req.files && req.files.length > 0) {
      const images = req.files.map(f => ({ url: f.path, filename: f.filename }));
      // If we are appending images, we could do: listing.images.push(...images)
      // For now, let's just replace them if new ones are uploaded
      listing.images = images;
      await listing.save();
    }

    res.json({ message: "Listing Updated", listing });
  } catch (error) {
    res.status(500).json({ error: "Failed to update listing", details: error.message });
  }
};

// Delete Route API
module.exports.destroyListing = async (req, res) => {
  try {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    if (!deletedListing) {
      return res.status(404).json({ error: "Listing not found" });
    }
    res.json({ message: "Listing Deleted", deletedListing });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete listing", details: error.message });
  }
};
