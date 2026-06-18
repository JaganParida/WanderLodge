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
    title: "Luxury Beachfront Villa",
    description: "Experience ultimate luxury in this modern beachfront villa. Infinity pool overlooking the ocean, private chef available, and direct beach access. Sunsets here are truly magical.",
    image: {
      url: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=1000&auto=format&fit=crop",
      filename: "beach_villa"
    },
    price: 45000,
    location: "Bali, Indonesia",
    country: "Indonesia",
    category: "Beachfront",
    amenities: ["Pool", "WiFi", "Air conditioning", "Beach access", "Breakfast included"],
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
      url: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1000&auto=format&fit=crop",
      filename: "scottish_castle"
    },
    price: 85000,
    location: "Inverness, Scotland",
    country: "United Kingdom",
    category: "Castles",
    amenities: ["Indoor fireplace", "Heating", "Kitchen", "Free parking", "Dedicated workspace"],
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
      url: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=1000&auto=format&fit=crop",
      filename: "nyc_loft"
    },
    price: 22000,
    location: "New York City, NY",
    country: "United States",
    category: "City",
    amenities: ["WiFi", "Air conditioning", "Kitchen", "Gym", "Elevator"],
    maxGuests: 4,
    bedrooms: 2,
    beds: 2,
    rating: 0,
    geometry: { type: "Point", coordinates: [-74.0060, 40.7128] }
  },
  {
    title: "Rustic Farmhouse Retreat",
    description: "Escape the city to this charming organic farm. Feed the animals, collect fresh eggs, and relax on the wrap-around porch. A perfect family getaway.",
    image: {
      url: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=1000&auto=format&fit=crop",
      filename: "rustic_farm"
    },
    price: 15500,
    location: "Tuscany, Italy",
    country: "Italy",
    category: "Farms",
    amenities: ["Kitchen", "Indoor fireplace", "BBQ grill", "Outdoor dining area", "Washing machine"],
    maxGuests: 6,
    bedrooms: 3,
    beds: 4,
    rating: 0,
    geometry: { type: "Point", coordinates: [11.2558, 43.7696] }
  },
  {
    title: "Serene Lakefront Cabin",
    description: "Wake up to calm waters and mountain views. This cozy A-frame cabin offers a private dock, kayaks, and a wood-burning stove. Ideal for a peaceful retreat.",
    image: {
      url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1000&auto=format&fit=crop",
      filename: "lake_cabin"
    },
    price: 12000,
    location: "Lake Tahoe, CA",
    country: "United States",
    category: "Lakefront",
    amenities: ["Lake access", "WiFi", "Kitchen", "Indoor fireplace", "Patio or balcony"],
    maxGuests: 4,
    bedrooms: 2,
    beds: 3,
    rating: 0,
    geometry: { type: "Point", coordinates: [-120.0324, 39.0968] }
  },
  {
    title: "Eco-Friendly Treehouse",
    description: "Sleep among the canopy in this unique, sustainable treehouse. Features a wraparound deck, outdoor shower, and breathtaking jungle views. An adventurer's dream.",
    image: {
      url: "https://images.unsplash.com/photo-1505843513577-22bb7d21e455?q=80&w=1000&auto=format&fit=crop",
      filename: "treehouse"
    },
    price: 9500,
    location: "Tulum, Quintana Roo",
    country: "Mexico",
    category: "OMG!",
    amenities: ["WiFi", "Free parking", "Outdoor shower", "Balcony", "Breakfast included"],
    maxGuests: 2,
    bedrooms: 1,
    beds: 1,
    rating: 0,
    geometry: { type: "Point", coordinates: [-87.4654, 20.2114] }
  },
  {
    title: "Luxury Desert Oasis",
    description: "Experience the magic of the desert in this ultra-modern oasis. Features a stunning infinity pool, fire pit lounge, and stargazing deck. Minimalist luxury at its finest.",
    image: {
      url: "https://images.unsplash.com/photo-1534008897995-27a23e859048?q=80&w=1000&auto=format&fit=crop",
      filename: "desert_oasis"
    },
    price: 35000,
    location: "Joshua Tree, CA",
    country: "United States",
    category: "Pools",
    amenities: ["Pool", "Hot tub", "Air conditioning", "WiFi", "Kitchen"],
    maxGuests: 4,
    bedrooms: 2,
    beds: 2,
    rating: 0,
    geometry: { type: "Point", coordinates: [-116.3131, 34.1347] }
  },
  {
    title: "Charming Santorini Cave House",
    description: "Stay in a traditional caldera cave house with stunning Aegean Sea views. Private terrace, plunge pool, and authentic Greek architecture. A romantic Mediterranean escape.",
    image: {
      url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1000&auto=format&fit=crop",
      filename: "santorini_cave"
    },
    price: 28000,
    location: "Oia, South Aegean",
    country: "Greece",
    category: "OMG!",
    amenities: ["Pool", "Sea view", "WiFi", "Air conditioning", "Kitchen"],
    maxGuests: 2,
    bedrooms: 1,
    beds: 1,
    rating: 0,
    geometry: { type: "Point", coordinates: [25.4315, 36.3932] }
  },
  {
    title: "Alpine Ski Chalet",
    description: "Hit the slopes directly from this ski-in/ski-out luxury chalet. Features a sauna, vaulted ceilings, and panoramic mountain views. The ultimate winter getaway.",
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
  // Try to find elitehost1 and elitehost2
  let host1 = await User.findOne({ username: 'elitehost1' });
  let host2 = await User.findOne({ username: 'elitehost2' });
  
  if (!host1 || !host2) {
      console.log("Hosts elitehost1 and elitehost2 not found. Fallback to any two hosts.");
      const hosts = await User.find({ role: 'host' }).limit(2);
      if (hosts.length >= 2) {
          host1 = hosts[0];
          host2 = hosts[1];
      } else if (hosts.length === 1) {
          host1 = hosts[0];
          host2 = hosts[0]; // fallback
      } else {
          console.log("No hosts found. Please create elitehost1 and elitehost2 first via the frontend.");
          process.exit(1);
      }
  }

  await Listing.deleteMany({});
  
  // Create 10 more listings to reach 20 total
  const additionalData = seedData.map((obj, i) => ({
      ...obj,
      title: obj.title + " (Premium)",
      price: obj.price + 5000,
      image: {
          ...obj.image,
          url: obj.image.url.replace('q=80', 'q=90') // slightly different URL params just to be distinct
      }
  }));

  const allData = [...seedData, ...additionalData];

  // First 10 to host1, Next 10 to host2
  const formattedData = allData.map((obj, i) => ({
    ...obj,
    owner: i < 10 ? host1._id : host2._id
  }));

  await Listing.insertMany(formattedData);
  console.log("Database seeded successfully with 20 listings! 10 for host1, 10 for host2.");
  mongoose.connection.close();
};

seedDB();
