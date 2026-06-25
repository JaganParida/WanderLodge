if (process.env.NODE_ENV !== "production") {
    require("dotenv").config({ path: ".env" });
}
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
        "title": "Secluded Glass Cabin",
        "description": "Experience the best of Aspen in this stunning secluded glass cabin. Perfect for your next getaway!",
        "price": 21000,
        "location": "Aspen",
        "country": "United States",
        "category": "Cabins",
        "amenities": [
            "Wifi",
            "TV",
            "Air Conditioning",
            "Kitchen",
            "Pool"
        ],
        "maxGuests": 8,
        "bedrooms": 2,
        "beds": 1,
        "rating": 4.6951407185279646,
        "images": [
            {
                "url": "https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=1000",
                "filename": "listingimage"
            },
            {
                "url": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1000&auto=format&fit=crop",
                "filename": "listingimage"
            },
            {
                "url": "https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=1000&auto=format&fit=crop",
                "filename": "listingimage"
            },
            {
                "url": "https://images.unsplash.com/photo-1502672260266-1c1e5250ce07?q=80&w=1000&auto=format&fit=crop",
                "filename": "listingimage"
            }
        ],
        "geometry": {
            "type": "Point",
            "coordinates": [
                0,
                0
            ]
        }
    },
    {
        "title": "Modern City Loft",
        "description": "Experience the best of New York City in this stunning modern city loft. Perfect for your next getaway!",
        "price": 18000,
        "location": "New York City",
        "country": "United States",
        "category": "City",
        "amenities": [
            "Wifi",
            "TV",
            "Air Conditioning",
            "Kitchen",
            "Pool"
        ],
        "maxGuests": 3,
        "bedrooms": 4,
        "beds": 2,
        "rating": 4.969147817802258,
        "images": [
            {
                "url": "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1000&auto=format&fit=crop",
                "filename": "listingimage"
            },
            {
                "url": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1000&auto=format&fit=crop",
                "filename": "listingimage"
            },
            {
                "url": "https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=1000&auto=format&fit=crop",
                "filename": "listingimage"
            },
            {
                "url": "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1000",
                "filename": "listingimage"
            }
        ],
        "geometry": {
            "type": "Point",
            "coordinates": [
                0,
                0
            ]
        }
    },
    {
        "title": "Lakefront Dream Home",
        "description": "Experience the best of Lake Tahoe in this stunning lakefront dream home. Perfect for your next getaway!",
        "price": 27000,
        "location": "Lake Tahoe",
        "country": "United States",
        "category": "Lakefront",
        "amenities": [
            "Wifi",
            "TV",
            "Air Conditioning",
            "Kitchen",
            "Pool"
        ],
        "maxGuests": 4,
        "bedrooms": 1,
        "beds": 4,
        "rating": 4.562830348465588,
        "images": [
            {
                "url": "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=1000&auto=format&fit=crop",
                "filename": "listingimage"
            },
            {
                "url": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1000&auto=format&fit=crop",
                "filename": "listingimage"
            },
            {
                "url": "https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=1000&auto=format&fit=crop",
                "filename": "listingimage"
            },
            {
                "url": "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=1000",
                "filename": "listingimage"
            }
        ],
        "geometry": {
            "type": "Point",
            "coordinates": [
                0,
                0
            ]
        }
    },
    {
        "title": "Desert Oasis Estate",
        "description": "Experience the best of Joshua Tree in this stunning desert oasis estate. Perfect for your next getaway!",
        "price": 20000,
        "location": "Joshua Tree",
        "country": "United States",
        "category": "Farms",
        "amenities": [
            "Wifi",
            "TV",
            "Air Conditioning"
        ],
        "maxGuests": 4,
        "bedrooms": 1,
        "beds": 2,
        "rating": 4.008709702855123,
        "images": [
            {
                "url": "https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=1000&auto=format&fit=crop",
                "filename": "listingimage"
            },
            {
                "url": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1000&auto=format&fit=crop",
                "filename": "listingimage"
            },
            {
                "url": "https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=1000&auto=format&fit=crop",
                "filename": "listingimage"
            },
            {
                "url": "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1000",
                "filename": "listingimage"
            }
        ],
        "geometry": {
            "type": "Point",
            "coordinates": [
                0,
                0
            ]
        }
    },
    {
        "title": "Tropical Jungle Villa",
        "description": "Experience the best of Bali in this stunning tropical jungle villa. Perfect for your next getaway!",
        "price": 21000,
        "location": "Bali",
        "country": "Indonesia",
        "category": "OMG!",
        "amenities": [
            "Wifi",
            "TV",
            "Air Conditioning",
            "Kitchen",
            "Pool"
        ],
        "maxGuests": 9,
        "bedrooms": 1,
        "beds": 6,
        "rating": 4.218854400940691,
        "images": [
            {
                "url": "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=1000&auto=format&fit=crop",
                "filename": "listingimage"
            },
            {
                "url": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1000&auto=format&fit=crop",
                "filename": "listingimage"
            },
            {
                "url": "https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=1000&auto=format&fit=crop",
                "filename": "listingimage"
            },
            {
                "url": "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1000",
                "filename": "listingimage"
            }
        ],
        "geometry": {
            "type": "Point",
            "coordinates": [
                0,
                0
            ]
        }
    },
    {
        "title": "Traditional Ryokan",
        "description": "Experience the best of Kyoto in this stunning traditional ryokan. Perfect for your next getaway!",
        "price": 15000,
        "location": "Kyoto",
        "country": "Japan",
        "category": "Trending",
        "amenities": [
            "Wifi",
            "TV",
            "Air Conditioning"
        ],
        "maxGuests": 4,
        "bedrooms": 2,
        "beds": 1,
        "rating": 4.3909094506953945,
        "images": [
            {
                "url": "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?q=80&w=1000&auto=format&fit=crop",
                "filename": "listingimage"
            },
            {
                "url": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1000&auto=format&fit=crop",
                "filename": "listingimage"
            },
            {
                "url": "https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=1000&auto=format&fit=crop",
                "filename": "listingimage"
            },
            {
                "url": "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1000",
                "filename": "listingimage"
            }
        ],
        "geometry": {
            "type": "Point",
            "coordinates": [
                0,
                0
            ]
        }
    },
    {
        "title": "Cliffside White Villa",
        "description": "Experience the best of Santorini in this stunning cliffside white villa. Perfect for your next getaway!",
        "price": 26000,
        "location": "Santorini",
        "country": "Greece",
        "category": "Pools",
        "amenities": [
            "Wifi",
            "TV",
            "Air Conditioning"
        ],
        "maxGuests": 8,
        "bedrooms": 4,
        "beds": 1,
        "rating": 4.604402096034013,
        "images": [
            {
                "url": "https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=1000&auto=format&fit=crop",
                "filename": "listingimage"
            },
            {
                "url": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1000&auto=format&fit=crop",
                "filename": "listingimage"
            },
            {
                "url": "https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=1000&auto=format&fit=crop",
                "filename": "listingimage"
            },
            {
                "url": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000",
                "filename": "listingimage"
            }
        ],
        "geometry": {
            "type": "Point",
            "coordinates": [
                0,
                0
            ]
        }
    },
    {
        "title": "Romantic Parisian Apartment",
        "description": "Experience the best of Paris in this stunning romantic parisian apartment. Perfect for your next getaway!",
        "price": 23000,
        "location": "Paris",
        "country": "France",
        "category": "City",
        "amenities": [
            "Wifi",
            "TV",
            "Air Conditioning",
            "Kitchen",
            "Pool"
        ],
        "maxGuests": 2,
        "bedrooms": 4,
        "beds": 6,
        "rating": 4.486785931338555,
        "images": [
            {
                "url": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1000&auto=format&fit=crop",
                "filename": "listingimage"
            },
            {
                "url": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1000&auto=format&fit=crop",
                "filename": "listingimage"
            },
            {
                "url": "https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=1000&auto=format&fit=crop",
                "filename": "listingimage"
            },
            {
                "url": "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=1000",
                "filename": "listingimage"
            }
        ],
        "geometry": {
            "type": "Point",
            "coordinates": [
                0,
                0
            ]
        }
    },
    {
        "title": "Snowy Alpine Chalet",
        "description": "Experience the best of Swiss Alps in this stunning snowy alpine chalet. Perfect for your next getaway!",
        "price": 12000,
        "location": "Swiss Alps",
        "country": "Switzerland",
        "category": "Trending",
        "amenities": [
            "Wifi",
            "TV",
            "Air Conditioning",
            "Kitchen"
        ],
        "maxGuests": 6,
        "bedrooms": 2,
        "beds": 2,
        "rating": 4.311830811309856,
        "images": [
            {
                "url": "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1000&auto=format&fit=crop",
                "filename": "listingimage"
            },
            {
                "url": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1000&auto=format&fit=crop",
                "filename": "listingimage"
            },
            {
                "url": "https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=1000&auto=format&fit=crop",
                "filename": "listingimage"
            },
            {
                "url": "https://images.unsplash.com/photo-1502672260266-1c1e5250ce07?q=80&w=1000",
                "filename": "listingimage"
            }
        ],
        "geometry": {
            "type": "Point",
            "coordinates": [
                0,
                0
            ]
        }
    },
    {
        "title": "Mediterranean Coastal Home",
        "description": "Experience the best of Amalfi Coast in this stunning mediterranean coastal home. Perfect for your next getaway!",
        "price": 19000,
        "location": "Amalfi Coast",
        "country": "Italy",
        "category": "Pools",
        "amenities": [
            "Wifi",
            "TV",
            "Air Conditioning",
            "Kitchen"
        ],
        "maxGuests": 6,
        "bedrooms": 3,
        "beds": 4,
        "rating": 4.179059156813589,
        "images": [
            {
                "url": "https://images.unsplash.com/photo-1472224371017-08207f84aaae?q=80&w=1000&auto=format&fit=crop",
                "filename": "listingimage"
            },
            {
                "url": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1000&auto=format&fit=crop",
                "filename": "listingimage"
            },
            {
                "url": "https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=1000&auto=format&fit=crop",
                "filename": "listingimage"
            },
            {
                "url": "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1000",
                "filename": "listingimage"
            }
        ],
        "geometry": {
            "type": "Point",
            "coordinates": [
                0,
                0
            ]
        }
    },
    {
        "title": "Mountain View Lodge",
        "description": "Experience the best of Banff in this stunning mountain view lodge. Perfect for your next getaway!",
        "price": 21000,
        "location": "Banff",
        "country": "Canada",
        "category": "Cabins",
        "amenities": [
            "Wifi",
            "TV",
            "Air Conditioning",
            "Kitchen",
            "Pool"
        ],
        "maxGuests": 2,
        "bedrooms": 1,
        "beds": 3,
        "rating": 4.00580684163319,
        "images": [
            {
                "url": "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1000&auto=format&fit=crop",
                "filename": "listingimage"
            },
            {
                "url": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1000&auto=format&fit=crop",
                "filename": "listingimage"
            },
            {
                "url": "https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=1000&auto=format&fit=crop",
                "filename": "listingimage"
            },
            {
                "url": "https://images.unsplash.com/photo-1502672260266-1c1e5250ce07?q=80&w=1000",
                "filename": "listingimage"
            }
        ],
        "geometry": {
            "type": "Point",
            "coordinates": [
                0,
                0
            ]
        }
    },
    {
        "title": "Beachfront Boho Retreat",
        "description": "Experience the best of Tulum in this stunning beachfront boho retreat. Perfect for your next getaway!",
        "price": 26000,
        "location": "Tulum",
        "country": "Mexico",
        "category": "Beachfront",
        "amenities": [
            "Wifi",
            "TV",
            "Air Conditioning",
            "Kitchen"
        ],
        "maxGuests": 9,
        "bedrooms": 2,
        "beds": 2,
        "rating": 4.957957939224458,
        "images": [
            {
                "url": "https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=1000&auto=format&fit=crop",
                "filename": "listingimage"
            },
            {
                "url": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1000&auto=format&fit=crop",
                "filename": "listingimage"
            },
            {
                "url": "https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=1000&auto=format&fit=crop",
                "filename": "listingimage"
            },
            {
                "url": "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1000",
                "filename": "listingimage"
            }
        ],
        "geometry": {
            "type": "Point",
            "coordinates": [
                0,
                0
            ]
        }
    },
    {
        "title": "Ocean View Penthouse",
        "description": "Experience the best of Maui in this stunning ocean view penthouse. Perfect for your next getaway!",
        "price": 25000,
        "location": "Maui",
        "country": "United States",
        "category": "Beachfront",
        "amenities": [
            "Wifi",
            "TV",
            "Air Conditioning",
            "Kitchen",
            "Pool"
        ],
        "maxGuests": 5,
        "bedrooms": 3,
        "beds": 1,
        "rating": 4.820620829527585,
        "images": [
            {
                "url": "https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=1000&auto=format&fit=crop",
                "filename": "listingimage"
            },
            {
                "url": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1000&auto=format&fit=crop",
                "filename": "listingimage"
            },
            {
                "url": "https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=1000&auto=format&fit=crop",
                "filename": "listingimage"
            },
            {
                "url": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000",
                "filename": "listingimage"
            }
        ],
        "geometry": {
            "type": "Point",
            "coordinates": [
                0,
                0
            ]
        }
    },
    {
        "title": "Nordic Minimalist House",
        "description": "Experience the best of Reykjavik in this stunning nordic minimalist house. Perfect for your next getaway!",
        "price": 17000,
        "location": "Reykjavik",
        "country": "Iceland",
        "category": "Trending",
        "amenities": [
            "Wifi",
            "TV",
            "Air Conditioning",
            "Kitchen",
            "Pool"
        ],
        "maxGuests": 5,
        "bedrooms": 3,
        "beds": 2,
        "rating": 4.024549596401723,
        "images": [
            {
                "url": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000&auto=format&fit=crop",
                "filename": "listingimage"
            },
            {
                "url": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1000&auto=format&fit=crop",
                "filename": "listingimage"
            },
            {
                "url": "https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=1000&auto=format&fit=crop",
                "filename": "listingimage"
            },
            {
                "url": "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1000",
                "filename": "listingimage"
            }
        ],
        "geometry": {
            "type": "Point",
            "coordinates": [
                0,
                0
            ]
        }
    },
    {
        "title": "Overwater Bungalow",
        "description": "Experience the best of Maldives in this stunning overwater bungalow. Perfect for your next getaway!",
        "price": 19000,
        "location": "Maldives",
        "country": "Maldives",
        "category": "Beachfront",
        "amenities": [
            "Wifi",
            "TV",
            "Air Conditioning",
            "Kitchen",
            "Pool"
        ],
        "maxGuests": 9,
        "bedrooms": 1,
        "beds": 5,
        "rating": 4.265287157745605,
        "images": [
            {
                "url": "https://images.unsplash.com/photo-1439066615861-d1af74d74000?q=80&w=1000&auto=format&fit=crop",
                "filename": "listingimage"
            },
            {
                "url": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1000&auto=format&fit=crop",
                "filename": "listingimage"
            },
            {
                "url": "https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=1000&auto=format&fit=crop",
                "filename": "listingimage"
            },
            {
                "url": "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=1000",
                "filename": "listingimage"
            }
        ],
        "geometry": {
            "type": "Point",
            "coordinates": [
                0,
                0
            ]
        }
    },
    {
        "title": "Thai Luxury Villa",
        "description": "Experience the best of Phuket in this stunning thai luxury villa. Perfect for your next getaway!",
        "price": 16000,
        "location": "Phuket",
        "country": "Thailand",
        "category": "Pools",
        "amenities": [
            "Wifi",
            "TV",
            "Air Conditioning",
            "Kitchen"
        ],
        "maxGuests": 4,
        "bedrooms": 1,
        "beds": 5,
        "rating": 4.915368441214229,
        "images": [
            {
                "url": "https://images.unsplash.com/photo-1504280741562-6022864950a8?q=80&w=1000&auto=format&fit=crop",
                "filename": "listingimage"
            },
            {
                "url": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1000&auto=format&fit=crop",
                "filename": "listingimage"
            },
            {
                "url": "https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=1000&auto=format&fit=crop",
                "filename": "listingimage"
            },
            {
                "url": "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1000",
                "filename": "listingimage"
            }
        ],
        "geometry": {
            "type": "Point",
            "coordinates": [
                0,
                0
            ]
        }
    },
    {
        "title": "Inca Trail Basecamp",
        "description": "Experience the best of Machu Picchu in this stunning inca trail basecamp. Perfect for your next getaway!",
        "price": 11000,
        "location": "Machu Picchu",
        "country": "Peru",
        "category": "Trending",
        "amenities": [
            "Wifi",
            "TV",
            "Air Conditioning"
        ],
        "maxGuests": 6,
        "bedrooms": 4,
        "beds": 2,
        "rating": 4.439319954494268,
        "images": [
            {
                "url": "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1000&auto=format&fit=crop",
                "filename": "listingimage"
            },
            {
                "url": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1000&auto=format&fit=crop",
                "filename": "listingimage"
            },
            {
                "url": "https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=1000&auto=format&fit=crop",
                "filename": "listingimage"
            },
            {
                "url": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000",
                "filename": "listingimage"
            }
        ],
        "geometry": {
            "type": "Point",
            "coordinates": [
                0,
                0
            ]
        }
    },
    {
        "title": "Red Rock Canyon House",
        "description": "Experience the best of Sedona in this stunning red rock canyon house. Perfect for your next getaway!",
        "price": 16000,
        "location": "Sedona",
        "country": "United States",
        "category": "OMG!",
        "amenities": [
            "Wifi",
            "TV",
            "Air Conditioning",
            "Kitchen",
            "Pool"
        ],
        "maxGuests": 5,
        "bedrooms": 3,
        "beds": 2,
        "rating": 4.754139457421299,
        "images": [
            {
                "url": "https://images.unsplash.com/photo-1521401830884-6c03c1c87ebb?q=80&w=1000&auto=format&fit=crop",
                "filename": "listingimage"
            },
            {
                "url": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1000&auto=format&fit=crop",
                "filename": "listingimage"
            },
            {
                "url": "https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=1000&auto=format&fit=crop",
                "filename": "listingimage"
            },
            {
                "url": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000",
                "filename": "listingimage"
            }
        ],
        "geometry": {
            "type": "Point",
            "coordinates": [
                0,
                0
            ]
        }
    },
    {
        "title": "Sky-High Dubai Suite",
        "description": "Experience the best of Dubai in this stunning sky-high dubai suite. Perfect for your next getaway!",
        "price": 18000,
        "location": "Dubai",
        "country": "United Arab Emirates",
        "category": "City",
        "amenities": [
            "Wifi",
            "TV",
            "Air Conditioning",
            "Kitchen"
        ],
        "maxGuests": 6,
        "bedrooms": 2,
        "beds": 6,
        "rating": 4.083994808288692,
        "images": [
            {
                "url": "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?q=80&w=1000&auto=format&fit=crop",
                "filename": "listingimage"
            },
            {
                "url": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1000&auto=format&fit=crop",
                "filename": "listingimage"
            },
            {
                "url": "https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=1000&auto=format&fit=crop",
                "filename": "listingimage"
            },
            {
                "url": "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1000",
                "filename": "listingimage"
            }
        ],
        "geometry": {
            "type": "Point",
            "coordinates": [
                0,
                0
            ]
        }
    },
    {
        "title": "Safari Luxury Tent",
        "description": "Experience the best of Cape Town in this stunning safari luxury tent. Perfect for your next getaway!",
        "price": 12000,
        "location": "Cape Town",
        "country": "South Africa",
        "category": "Trending",
        "amenities": [
            "Wifi",
            "TV",
            "Air Conditioning",
            "Kitchen"
        ],
        "maxGuests": 9,
        "bedrooms": 2,
        "beds": 2,
        "rating": 4.900151122976726,
        "images": [
            {
                "url": "https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=1000",
                "filename": "listingimage"
            },
            {
                "url": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1000&auto=format&fit=crop",
                "filename": "listingimage"
            },
            {
                "url": "https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=1000&auto=format&fit=crop",
                "filename": "listingimage"
            },
            {
                "url": "https://images.unsplash.com/photo-1502672260266-1c1e5250ce07?q=80&w=1000",
                "filename": "listingimage"
            }
        ],
        "geometry": {
            "type": "Point",
            "coordinates": [
                0,
                0
            ]
        }
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
  

  // First 10 to host1, Next 10 to host2
  const formattedData = seedData.map((obj, i) => ({
    ...obj,
    owner: i < 10 ? host1._id : host2._id
  }));

  await Listing.insertMany(formattedData);
  console.log("Database seeded successfully with 20 listings! 10 for host1, 10 for host2.");
  mongoose.connection.close();
};

seedDB();
