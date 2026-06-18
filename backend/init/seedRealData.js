require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const Listing = require('../models/listing');
const User = require('../models/user');

const MONGODB_URL = process.env.ATLASDB_URL || 'mongodb://127.0.0.1:27017/wanderlodge';

main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGODB_URL);
}

const seedData = [
  {
    title: "Secluded Glass Cabin in the Forest",
    description: "Immerse yourself in nature in this stunning architectural glass cabin. Wake up to panoramic views of the ancient forest. Features a private hot tub, fire pit, and luxury linens. Perfect for a romantic getaway.",
    image: {
      url: "https://images.unsplash.com/photo-1542718610-a1d656d1884c?q=80&w=1000&auto=format&fit=crop",
      filename: "glass_cabin"
    },
    price: 18500,
    location: "Aspen, Colorado",
    country: "United States",
    category: "Cabins",
    amenities: ["WiFi", "Kitchen", "Hot tub", "Fire pit", "Free parking"],
    maxGuests: 2,
    bedrooms: 1,
    beds: 1,
    rating: 0,
    geometry: { type: "Point", coordinates: [-106.8175, 39.1911] }
  },
  {
    title: "Luxury Beachfront Villa with Infinity Pool",
    description: "Experience ultimate luxury in this stunning villa featuring a private infinity pool overlooking the ocean. Perfect for family vacations. The space includes a fully equipped kitchen, high-speed WiFi, and daily housekeeping.",
    image: {
      url: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=1000&auto=format&fit=crop",
      filename: "beachfront_villa"
    },
    price: 45000,
    location: "Uluwatu, Bali",
    country: "Indonesia",
    category: "Beachfront",
    amenities: ["WiFi", "Pool", "Air conditioning", "Kitchen", "Ocean view", "TV"],
    maxGuests: 8,
    bedrooms: 4,
    beds: 5,
    rating: 0,
    geometry: { type: "Point", coordinates: [115.1054, -8.8286] }
  },
  {
    title: "Historic Castle in the Scottish Highlands",
    description: "Live like royalty in this lovingly restored 15th-century castle. Features antique furnishings, grand fireplaces, and sprawling grounds. A truly unforgettable historical experience.",
    image: {
      url: "https://images.unsplash.com/photo-1541123437800-141315b7fd6a?q=80&w=1000&auto=format&fit=crop",
      filename: "scottish_castle"
    },
    price: 85000,
    location: "Inverness, Scotland",
    country: "United Kingdom",
    category: "Castles",
    amenities: ["WiFi", "Kitchen", "Indoor fireplace", "Free parking", "Dedicated workspace"],
    maxGuests: 12,
    bedrooms: 6,
    beds: 8,
    rating: 0,
    geometry: { type: "Point", coordinates: [-4.2247, 57.4778] }
  },
  {
    title: "Modern Loft in Downtown Manhattan",
    description: "Sleek, industrial-chic loft in the heart of NYC. Floor-to-ceiling windows, exposed brick, and luxury appliances. Walking distance to the best restaurants and Broadway shows.",
    image: {
      url: "https://images.unsplash.com/photo-1502672260266-1c1de24244fe?q=80&w=1000&auto=format&fit=crop",
      filename: "nyc_loft"
    },
    price: 22000,
    location: "New York City, New York",
    country: "United States",
    category: "City",
    amenities: ["WiFi", "Air conditioning", "Kitchen", "TV", "Elevator", "Gym"],
    maxGuests: 4,
    bedrooms: 2,
    beds: 2,
    rating: 0,
    geometry: { type: "Point", coordinates: [-74.0060, 40.7128] }
  },
  {
    title: "Serene Lakefront A-Frame",
    description: "Cozy A-frame cabin perched right on the edge of a crystal-clear lake. Includes private dock, canoes, and a wraparound deck for sunset viewing. The perfect digital detox.",
    image: {
      url: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=1000&auto=format&fit=crop",
      filename: "lakefront_aframe"
    },
    price: 15500,
    location: "Lake Tahoe, California",
    country: "United States",
    category: "Lakefront",
    amenities: ["Kitchen", "Indoor fireplace", "Free parking", "Lake access"],
    maxGuests: 4,
    bedrooms: 2,
    beds: 3,
    rating: 0,
    geometry: { type: "Point", coordinates: [-120.0324, 39.0968] }
  },
  {
    title: "Magical Treehouse Retreat",
    description: "Sleep amongst the canopy in this incredible treehouse. Features a suspension bridge, cozy interior, and an outdoor shower. Featured in multiple design magazines.",
    image: {
      url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1000&auto=format&fit=crop",
      filename: "treehouse"
    },
    price: 28000,
    location: "Tulum, Quintana Roo",
    country: "Mexico",
    category: "OMG!",
    amenities: ["WiFi", "Air conditioning", "Outdoor shower", "Free parking"],
    maxGuests: 2,
    bedrooms: 1,
    beds: 1,
    rating: 0,
    geometry: { type: "Point", coordinates: [-87.4654, 20.2114] }
  },
  {
    title: "Charming Tuscan Farmhouse",
    description: "Authentic stone farmhouse surrounded by rolling hills and vineyards. Enjoy fresh local produce, a private pool, and outdoor dining under the pergola.",
    image: {
      url: "https://images.unsplash.com/photo-1505843513577-22bb7d21e455?q=80&w=1000&auto=format&fit=crop",
      filename: "tuscan_farmhouse"
    },
    price: 32000,
    location: "Florence, Tuscany",
    country: "Italy",
    category: "Farms",
    amenities: ["WiFi", "Pool", "Kitchen", "Free parking", "BBQ grill"],
    maxGuests: 6,
    bedrooms: 3,
    beds: 4,
    rating: 0,
    geometry: { type: "Point", coordinates: [11.2558, 43.7696] }
  },
  {
    title: "Minimalist Tiny Home in the Desert",
    description: "Experience off-grid living in this stunning tiny home. Stargaze from the outdoor tub. Modern amenities in a compact, eco-friendly package.",
    image: {
      url: "https://images.unsplash.com/photo-1534008897995-27a23e859048?q=80&w=1000&auto=format&fit=crop",
      filename: "desert_tiny_home"
    },
    price: 11000,
    location: "Joshua Tree, California",
    country: "United States",
    category: "Tiny homes",
    amenities: ["Air conditioning", "Kitchen", "Free parking", "Fire pit"],
    maxGuests: 2,
    bedrooms: 1,
    beds: 1,
    rating: 0,
    geometry: { type: "Point", coordinates: [-116.3131, 34.1347] }
  },
  {
    title: "Spectacular Cliffside Villa with Infinity Pool",
    description: "Jaw-dropping views from every room. This modern architectural masterpiece features a massive infinity pool that blends into the Aegean Sea.",
    image: {
      url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1000&auto=format&fit=crop",
      filename: "santorini_pool"
    },
    price: 65000,
    location: "Santorini, South Aegean",
    country: "Greece",
    category: "Pools",
    amenities: ["WiFi", "Pool", "Air conditioning", "Kitchen", "Ocean view"],
    maxGuests: 4,
    bedrooms: 2,
    beds: 2,
    rating: 0,
    geometry: { type: "Point", coordinates: [25.4315, 36.3932] }
  },
  {
    title: "Modern Alpine Ski Chalet",
    description: "Ski-in, ski-out access. Unwind in the sauna after a day on the slopes. Features massive floor-to-ceiling windows overlooking the snow-capped peaks.",
    image: {
      url: "https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=1000&auto=format&fit=crop",
      filename: "ski_chalet"
    },
    price: 48000,
    location: "Zermatt, Valais",
    country: "Switzerland",
    category: "Trending",
    amenities: ["WiFi", "Kitchen", "Indoor fireplace", "Sauna", "Ski-in/Ski-out"],
    maxGuests: 8,
    bedrooms: 4,
    beds: 6,
    rating: 0,
    geometry: { type: "Point", coordinates: [7.7491, 46.0207] }
  }
];

const seedDB = async () => {
  // Try to find a user to own these listings
  let owner = await User.findOne({ role: 'host' });
  if (!owner) {
    owner = await User.findOne();
  }
  
  if (!owner) {
    console.log("No user found. Please create a user/host first via the frontend.");
    process.exit(1);
  }

  await Listing.deleteMany({});
  
  const formattedData = seedData.map(obj => ({
    ...obj,
    owner: owner._id
  }));

  await Listing.insertMany(formattedData);
  console.log("Database seeded successfully with realistic Airbnb data!");
  mongoose.connection.close();
};

seedDB();
