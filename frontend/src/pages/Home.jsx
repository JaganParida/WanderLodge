import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Heart, Star, Tent, Castle, Waves, Flame, Building, Trees, Home as HomeIcon, SlidersHorizontal, X, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = [
  { label: 'Trending', icon: Flame },
  { label: 'Beachfront', icon: Waves },
  { label: 'Cabins', icon: Tent },
  { label: 'OMG!', icon: Star },
  { label: 'Castles', icon: Castle },
  { label: 'Lakefront', icon: Waves },
  { label: 'Tiny homes', icon: HomeIcon },
  { label: 'Farms', icon: Trees },
  { label: 'City', icon: Building },
  { label: 'Pools', icon: Waves }
];

const Home = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlistIds, setWishlistIds] = useState([]);
  const { isLoggedIn, t, formatPrice, globalCurrency } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Filter States (Active for network requests)
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  // Draft Filter States (For the modal inputs)
  const [draftMinPrice, setDraftMinPrice] = useState('');
  const [draftMaxPrice, setDraftMaxPrice] = useState('');
  const [draftAmenities, setDraftAmenities] = useState([]);

  const AMENITIES_LIST = ['WiFi', 'Pool', 'Kitchen', 'AC', 'Parking', 'TV', 'Workspace', 'Washing Machine'];

  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('location') || '';
  const searchGuests = searchParams.get('guests') || '';
  const isSearchActive = searchQuery || searchGuests;

  useEffect(() => {
    setLoading(true);
    let url = '/api/listings?';
    if (selectedCategory !== 'All') url += `category=${encodeURIComponent(selectedCategory)}&`;
    if (searchQuery) url += `location=${encodeURIComponent(searchQuery)}&`;
    if (searchGuests) url += `guests=${encodeURIComponent(searchGuests)}&`;
    if (minPrice) url += `minPrice=${minPrice}&`;
    if (maxPrice) url += `maxPrice=${maxPrice}&`;
    if (selectedAmenities.length > 0) url += `amenities=${selectedAmenities.join(',')}&`;
    
    axios.get(url)
      .then(res => {
        setListings(Array.isArray(res.data) ? res.data : (res.data?.listings || []));
      })
      .catch(err => {
        console.error("Error fetching listings:", err.message);
        setListings([]);
      })
      .finally(() => {
        setLoading(false);
      });

    // Fetch user wishlist if logged in
    if (isLoggedIn) {
       axios.get('/api/dashboard', { timeout: 3000 })
         .then(res => {
           if(res.data.wishlist && Array.isArray(res.data.wishlist)) {
             setWishlistIds(res.data.wishlist.map(w => w._id || w));
           }
         })
         .catch(console.error);
    }
  }, [isLoggedIn, selectedCategory, location.search, minPrice, maxPrice, selectedAmenities]);

  const handleDraftAmenityToggle = (amenity) => {
    setDraftAmenities(prev => 
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
  };

  const applyFilters = () => {
    setMinPrice(draftMinPrice);
    setMaxPrice(draftMaxPrice);
    setSelectedAmenities(draftAmenities);
    setIsFilterModalOpen(false);
  };

  const clearFilters = () => {
    setDraftMinPrice('');
    setDraftMaxPrice('');
    setDraftAmenities([]);
    setMinPrice('');
    setMaxPrice('');
    setSelectedAmenities([]);
    setIsFilterModalOpen(false);
  };

  const openFilterModal = () => {
    // Copy active states to drafts when opening
    setDraftMinPrice(minPrice);
    setDraftMaxPrice(maxPrice);
    setDraftAmenities(selectedAmenities);
    setIsFilterModalOpen(true);
  };

  const handleWishlistToggle = async (e, id) => {
    e.preventDefault(); // Prevent Link navigation
    e.stopPropagation();
    
    // Optimistic UI Update
    setWishlistIds(prev => 
      prev.includes(id) ? prev.filter(wid => wid !== id) : [...prev, id]
    );
    
    try {
      await axios.post(`/api/wishlists/${id}/toggle`, {});
    } catch (err) {
       // Revert on failure
       setWishlistIds(prev => 
        prev.includes(id) ? prev.filter(wid => wid !== id) : [...prev, id]
      );
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex overflow-x-auto gap-8 pb-4 mb-6 border-b border-gray-100">
           {[1,2,3,4,5,6,7,8].map(i => (
              <div key={i} className="flex flex-col items-center gap-2 opacity-50">
                <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="w-12 h-3 bg-gray-200 rounded animate-pulse"></div>
              </div>
           ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1,2,3,4,5,6,7,8].map(i => (
             <div key={i} className="flex flex-col gap-2 w-full">
               <div className="w-full aspect-[4/3] bg-gray-200 rounded-xl animate-pulse relative">
                 <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-gray-300 animate-pulse"></div>
               </div>
               <div className="flex justify-between items-start mt-1">
                 <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
                 <div className="h-4 bg-gray-200 rounded animate-pulse w-8"></div>
               </div>
               <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
               <div className="h-3 bg-gray-200 rounded animate-pulse w-1/3"></div>
               <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4 mt-1"></div>
             </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Category Filters */}
      <div className="flex overflow-x-auto gap-8 pb-4 mb-6 scrollbar-hide border-b border-gray-100 items-center">
        <div 
           onClick={() => setSelectedCategory('All')} 
           className={`flex flex-col items-center gap-2 cursor-pointer transition flex-shrink-0 border-b-2 pb-2 ${selectedCategory === 'All' ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-black hover:border-gray-300'}`}
        >
          <HomeIcon size={24} />
          <span className="text-sm font-medium whitespace-nowrap">{t('All')}</span>
        </div>
        {CATEGORIES.map(cat => {
          const Icon = cat.icon;
          const isActive = selectedCategory === cat.label;
          return (
            <div 
              key={cat.label} 
              onClick={() => setSelectedCategory(cat.label)}
              className={`flex flex-col items-center gap-2 cursor-pointer transition flex-shrink-0 border-b-2 pb-2 ${isActive ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-black hover:border-gray-300'}`}
            >
              <Icon size={24} className={isActive ? 'text-black' : 'text-gray-500'} />
              <span className={`text-sm whitespace-nowrap ${isActive ? 'font-medium' : ''}`}>{t(cat.label)}</span>
            </div>
          );
        })}
        <div className="ml-auto pl-4">
           <button 
            onClick={openFilterModal}
            className="flex items-center gap-2 border border-gray-300 rounded-xl px-4 py-2 hover:border-black hover:bg-gray-50 transition font-semibold text-sm h-12 ml-4 flex-shrink-0"
          >
            <SlidersHorizontal size={16} />
            {t('Filters')}
          </button>
        </div>
      </div>

      {/* Search Header */}
      {isSearchActive && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 flex justify-between items-center">
           <h2 className="text-xl font-bold">
             Search results {searchQuery && `for "${searchQuery}"`} {searchGuests && `with ${searchGuests}+ guests`}
           </h2>
           <button onClick={() => { setSelectedCategory('All'); navigate('/'); }} className="text-sm font-semibold border border-black px-4 py-2 rounded-lg hover:bg-gray-100 transition">
             Clear Search
           </button>
        </div>
      )}

      {/* Property Grid */}
      {listings.length === 0 ? (
         <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
           <div className="bg-gray-100 p-6 rounded-full mb-4">
             <Search size={32} className="text-gray-400" />
           </div>
           <h3 className="text-xl font-bold text-gray-900 mb-2">No exact matches</h3>
           <p className="text-gray-500 max-w-md">Try changing or removing some of your filters or adjusting your search area.</p>
           {isSearchActive && (
             <button onClick={() => { setSelectedCategory('All'); navigate('/'); }} className="mt-6 bg-black text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800 transition">Remove all filters</button>
           )}
         </div>
      ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {listings.map(listing => (
          <Link to={`/listings/${listing._id}`} key={listing._id} className="group cursor-pointer text-gray-900 block relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl mb-3">
              <img 
                src={listing.images?.[0]?.url || 'https://via.placeholder.com/400'} 
                alt={listing.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />
            </div>
            <button 
              onClick={(e) => handleWishlistToggle(e, listing._id)}
              className="absolute top-3 right-3 transition p-1 z-10 hover:scale-110 active:scale-95"
            >
              <Heart size={24} className={`drop-shadow-md transition-colors ${wishlistIds.includes(listing._id) ? 'fill-airbnb text-airbnb' : 'fill-black/40 text-white'}`} />
            </button>
            <div className="flex justify-between items-start">
              <h3 className="font-semibold text-[15px] truncate pr-4">{listing.location}, {listing.country}</h3>
              <div className="flex items-center gap-1 text-[15px]">
                <Star size={14} fill="currentColor" />
                <span>{listing.rating > 0 ? listing.rating.toFixed(2) : t('New')}</span>
              </div>
            </div>
            <p className="text-gray-500 text-[15px] truncate">{t('Hosted by')} {listing.owner?.username || 'Unknown Host'}</p>
            <p className="text-gray-500 text-[15px] truncate">{listing.title}</p>
            <div className="mt-1 flex items-center gap-1 text-[15px]">
              <span className="font-semibold">{formatPrice(listing.price)}</span>
              <span>{t('night')}</span>
            </div>
          </Link>
        ))}
      </div>
      )}

      {/* Filter Modal */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
             <div className="flex justify-between items-center p-6 border-b border-gray-100">
               <button onClick={() => setIsFilterModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition"><X size={20} /></button>
               <h2 className="font-bold text-lg">{t('Filters')}</h2>
               <div className="w-9"></div> {/* spacer */}
             </div>
             
             <div className="p-6 overflow-y-auto flex-1">
               <div className="mb-8">
                 <h3 className="text-xl font-bold mb-4">Price range</h3>
                 <p className="text-gray-500 mb-6">Nightly prices before fees and taxes</p>
                 <div className="flex items-center gap-4">
                   <div className="flex-1 border border-gray-400 rounded-xl p-3 focus-within:border-black focus-within:border-2 transition">
                     <label className="block text-xs text-gray-500 font-medium">Minimum</label>
                     <div className="flex items-center">
                       <span className="mr-1">{globalCurrency?.split(' - ')[1] || '₹'}</span>
                       <input type="number" value={draftMinPrice} onChange={e => setDraftMinPrice(e.target.value)} className="w-full outline-none bg-transparent" placeholder="0" />
                     </div>
                   </div>
                   <span className="text-gray-400">-</span>
                   <div className="flex-1 border border-gray-400 rounded-xl p-3 focus-within:border-black focus-within:border-2 transition">
                     <label className="block text-xs text-gray-500 font-medium">Maximum</label>
                     <div className="flex items-center">
                       <span className="mr-1">{globalCurrency?.split(' - ')[1] || '₹'}</span>
                       <input type="number" value={draftMaxPrice} onChange={e => setDraftMaxPrice(e.target.value)} className="w-full outline-none bg-transparent" placeholder="100000+" />
                     </div>
                   </div>
                 </div>
               </div>

               <hr className="border-gray-200 my-8" />

               <div>
                 <h3 className="text-xl font-bold mb-6">Amenities</h3>
                 <div className="grid grid-cols-2 gap-4">
                   {AMENITIES_LIST.map(amenity => (
                     <label key={amenity} className="flex items-center gap-3 cursor-pointer group" onClick={(e) => { e.preventDefault(); handleDraftAmenityToggle(amenity); }}>
                       <div className={`w-6 h-6 border rounded-md flex items-center justify-center transition-colors ${draftAmenities.includes(amenity) ? 'bg-black border-black text-white' : 'border-gray-300 group-hover:border-black text-transparent'}`}>
                         <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                       </div>
                       <span className="text-gray-700">{amenity}</span>
                     </label>
                   ))}
                 </div>
               </div>
             </div>

             <div className="p-6 border-t border-gray-100 flex justify-between items-center bg-white">
               <button onClick={clearFilters} className="font-semibold underline hover:text-gray-600 transition">Clear all</button>
               <button onClick={applyFilters} className="bg-black text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-800 transition">Show places</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
