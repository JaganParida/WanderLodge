const fs = require('fs');

const generateUniqueData = () => {
    const locations = [
        { l: 'Aspen', c: 'Colorado', ct: 'United States' },
        { l: 'New York City', c: 'NY', ct: 'United States' },
        { l: 'Lake Tahoe', c: 'CA', ct: 'United States' },
        { l: 'Joshua Tree', c: 'CA', ct: 'United States' },
        { l: 'Bali', c: 'Bali', ct: 'Indonesia' },
        { l: 'Kyoto', c: 'Kyoto', ct: 'Japan' },
        { l: 'Santorini', c: 'Aegean', ct: 'Greece' },
        { l: 'Paris', c: 'Ile-de-France', ct: 'France' },
        { l: 'Swiss Alps', c: 'Valais', ct: 'Switzerland' },
        { l: 'Amalfi Coast', c: 'Campania', ct: 'Italy' },
        { l: 'Banff', c: 'Alberta', ct: 'Canada' },
        { l: 'Tulum', c: 'Quintana Roo', ct: 'Mexico' },
        { l: 'Maui', c: 'Hawaii', ct: 'United States' },
        { l: 'Reykjavik', c: 'Capital Region', ct: 'Iceland' },
        { l: 'Maldives', c: 'Malé', ct: 'Maldives' },
        { l: 'Phuket', c: 'Phuket', ct: 'Thailand' },
        { l: 'Machu Picchu', c: 'Cusco', ct: 'Peru' },
        { l: 'Sedona', c: 'Arizona', ct: 'United States' },
        { l: 'Dubai', c: 'Dubai', ct: 'United Arab Emirates' },
        { l: 'Cape Town', c: 'Western Cape', ct: 'South Africa' }
    ];

    const images = [
        'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1472224371017-08207f84aaae?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1439066615861-d1af74d74000?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1504280741562-6022864950a8?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1521401830884-6c03c1c87ebb?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1505843513577-22bb7abd1182?q=80&w=1000&auto=format&fit=crop'
    ];

    const titles = [
        'Secluded Glass Cabin', 'Modern City Loft', 'Lakefront Dream Home', 'Desert Oasis Estate', 
        'Tropical Jungle Villa', 'Traditional Ryokan', 'Cliffside White Villa', 'Romantic Parisian Apartment',
        'Snowy Alpine Chalet', 'Mediterranean Coastal Home', 'Mountain View Lodge', 'Beachfront Boho Retreat',
        'Ocean View Penthouse', 'Nordic Minimalist House', 'Overwater Bungalow', 'Thai Luxury Villa',
        'Inca Trail Basecamp', 'Red Rock Canyon House', 'Sky-High Dubai Suite', 'Safari Luxury Tent'
    ];

    const categories = [
        'Cabins', 'City', 'Lakefront', 'Farms', 
        'OMG!', 'Trending', 'Pools', 'City',
        'Trending', 'Pools', 'Cabins', 'Beachfront',
        'Beachfront', 'Trending', 'Beachfront', 'Pools',
        'Trending', 'OMG!', 'City', 'Trending'
    ];

    let seedData = [];
    for(let i=0; i<20; i++) {
        seedData.push({
            title: titles[i],
            description: `Experience the best of ${locations[i].l} in this stunning ${titles[i].toLowerCase()}. Perfect for your next getaway!`,
            price: 10000 + (Math.floor(Math.random() * 20) * 1000),
            location: locations[i].l,
            country: locations[i].ct,
            category: categories[i],
            amenities: ['Wifi', 'TV', 'Air Conditioning', 'Kitchen', 'Pool', 'Parking'].slice(0, 3 + Math.floor(Math.random()*3)),
            maxGuests: 2 + Math.floor(Math.random() * 8),
            bedrooms: 1 + Math.floor(Math.random() * 4),
            beds: 1 + Math.floor(Math.random() * 6),
            rating: 4 + Math.random(),
            images: [
                { url: images[i], filename: 'listingimage' },
                { url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1000&auto=format&fit=crop', filename: 'listingimage' },
                { url: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=1000&auto=format&fit=crop', filename: 'listingimage' },
                { url: 'https://images.unsplash.com/photo-1590454359265-d4193557e4e1?q=80&w=1000&auto=format&fit=crop', filename: 'listingimage' }
            ],
            geometry: { type: 'Point', coordinates: [0, 0] }
        });
    }

    return seedData;
}

const fileContent = fs.readFileSync('seedRealData.js', 'utf8');

const newDataStr = 'const seedData = ' + JSON.stringify(generateUniqueData(), null, 4) + ';';

const replaced = fileContent.replace(/const seedData = \[(.|\n)*?\];/g, newDataStr).replace(/const additionalData(.|\n)*?\];/g, '').replace(/const allData = \[\.\.\.seedData, \.\.\.additionalData\];/g, 'const allData = seedData;');

fs.writeFileSync('seedRealData.js', replaced);
console.log('Done rewriting seedRealData.js');
