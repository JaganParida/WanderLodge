import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Star, MapPin, Share, Heart, Award, Shield, Key, ChevronDown, CheckCircle, Flame, Calendar as CalendarIcon, Info } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import RazorpayMockUI from '../components/RazorpayMockUI';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix leaflet icon path issue (fallback)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
});

// Custom WanderLodge Premium Marker
const customMarker = new L.divIcon({
  className: 'custom-div-icon bg-transparent border-0',
  html: `<div class="bg-airbnb w-14 h-14 rounded-full flex justify-center items-center shadow-lg border-2 border-white transform transition hover:scale-110"><svg class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg></div>`,
  iconSize: [56, 56],
  iconAnchor: [28, 56],
  popupAnchor: [0, -56]
});

const ListingDetails = () => {
  const { user, isLoggedIn, formatPrice, t, globalCurrency } = useAuth();
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Wishlist state
  const [isSaved, setIsSaved] = useState(false);
  const [showShareTooltip, setShowShareTooltip] = useState(false);
  
  // Review state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Booking state
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [pricing, setPricing] = useState(null);
  const [pricingError, setPricingError] = useState('');
  
  // Razorpay Mock State
  const [showRazorpayMock, setShowRazorpayMock] = useState(false);

  // Helper: get today's date in YYYY-MM-DD
  const getToday = () => new Date().toISOString().split('T')[0];
  // Helper: get next day from a date string
  const getNextDay = (dateStr) => {
    const d = new Date(dateStr);
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  // When check-in changes, auto-adjust check-out to be at least 1 day after
  const handleCheckInChange = (val) => {
    setCheckIn(val);
    if (!checkOut || checkOut <= val) {
      setCheckOut(getNextDay(val));
    }
  };

  // Calculate pricing whenever dates change
  useEffect(() => {
    setPricingError('');
    if (checkIn && checkOut && checkOut > checkIn) {
      axios.post(`/api/listings/${id}/book/calculate`, { checkIn, checkOut, guests })
      .then(res => setPricing(res.data))
      .catch(err => {
         console.error("Pricing Error:", err);
         setPricing(null);
         setPricingError(err.response?.data?.error || 'Could not calculate price');
      });
    } else {
      setPricing(null);
    }
  }, [checkIn, checkOut, guests, id]);

  const canReserve = pricing && checkIn && checkOut && checkOut > checkIn;

  const handleReserve = () => {
    if (!isLoggedIn) {
       return window.location.href = '/login';
    }
    if (!canReserve) return;
    
    // Open Razorpay UI Mock
    setShowRazorpayMock(true);
  };

  const handleRazorpaySuccess = () => {
    // Make real backend call to save booking after mock payment succeeds
    axios.post(`/api/listings/${id}/book`, {
      checkIn, checkOut, guests, totalPrice: pricing.totalPrice
    }).then(() => {
      window.location.href = '/dashboard';
    }).catch(err => {
      console.error(err);
      alert('Failed to save booking to database.');
    });
  };

  useEffect(() => {
    // We will fetch from /api/listings/:id once the backend is ready
    // Added 3s timeout so it doesn't hang infinitely if DB is down
    axios.get(`/api/listings/${id}`, { timeout: 3000 })
      .then(res => {
        setListing(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching listing (Fallback to mock data):", err.message);
        // Mock data fallback
        setListing({
          _id: id,
          title: 'Luxury Villa with Private Pool & Ocean View',
          location: 'Bali, Indonesia',
          country: 'Indonesia',
          price: 15000,
          description: 'Experience ultimate luxury in this stunning villa featuring a private infinity pool overlooking the ocean. Perfect for romantic getaways or family vacations. The space includes a fully equipped kitchen, high-speed WiFi, and daily housekeeping.',
          images: [{ url: 'https://images.unsplash.com/photo-1542718610-a1d656d1884c?q=80&w=1200&auto=format&fit=crop' }],
          owner: { username: 'HostMaster' },
          reviews: []
        });
        setLoading(false);
      });
      
    if (isLoggedIn) {
       axios.get('/api/dashboard', { timeout: 3000 })
         .then(res => {
            if(res.data.wishlist) {
               setIsSaved(res.data.wishlist.some(w => (w._id || w) === id));
            }
         })
         .catch(console.error);
    }
  }, [id, isLoggedIn]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowShareTooltip(true);
    setTimeout(() => setShowShareTooltip(false), 2000);
  };

  const handleSave = async () => {
    if (!isLoggedIn) return window.location.href = '/login';
    
    setIsSaved(!isSaved); // Optimistic update
    try {
      await axios.post(`/api/wishlists/${id}/toggle`, {});
    } catch (err) {
      setIsSaved(!isSaved); // Revert
      console.error(err);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) return window.location.href = '/login';
    if (!reviewComment.trim()) return;

    setIsSubmittingReview(true);
    try {
      const res = await axios.post(`/api/listings/${id}/reviews`, {
        review: { rating: reviewRating, comment: reviewComment }
      });
      // Append the newly created review (with dummy author obj if not fully populated by backend immediately)
      const newReview = { 
         ...res.data.review, 
         author: { _id: user?._id, username: user?.username || 'You' },
         createdAt: new Date().toISOString()
      };
      
      setListing(prev => ({
        ...prev,
        reviews: [...prev.reviews, newReview]
      }));
      setReviewComment('');
      setReviewRating(5);
    } catch (err) {
      alert(err.response?.data?.error || "Failed to submit review");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Delete this review?")) return;
    try {
      await axios.delete(`/api/listings/${id}/reviews/${reviewId}`);
      setListing(prev => ({
        ...prev,
        reviews: prev.reviews.filter(r => r._id !== reviewId)
      }));
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete review");
    }
  };

  const averageRating = listing?.reviews?.length > 0 
    ? (listing.reviews.reduce((acc, curr) => acc + curr.rating, 0) / listing.reviews.length).toFixed(2)
    : 'New';


  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
        {/* Title & Header Skeleton */}
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="flex justify-between items-end mb-6">
          <div className="flex items-center gap-4">
            <div className="h-4 bg-gray-200 rounded w-48"></div>
          </div>
          <div className="flex gap-4">
            <div className="h-4 bg-gray-200 rounded w-16"></div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
          </div>
        </div>

        {/* Image Gallery Skeleton */}
        <div className="rounded-2xl overflow-hidden mb-8 aspect-[2/1] md:aspect-[3/1] bg-gray-200"></div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative">
          {/* Left Content Skeleton */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center pb-6 border-b border-gray-200">
              <div className="w-2/3">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="h-14 w-14 rounded-full bg-gray-200 flex-shrink-0"></div>
            </div>

            <div className="py-6 border-b border-gray-200 space-y-6">
              <div className="flex gap-4 items-start">
                <div className="w-6 h-6 rounded bg-gray-200 flex-shrink-0"></div>
                <div className="w-full">
                  <div className="h-5 bg-gray-200 rounded w-1/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-6 h-6 rounded bg-gray-200 flex-shrink-0"></div>
                <div className="w-full">
                  <div className="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            </div>

            <div className="py-6 border-b border-gray-200">
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>

          {/* Right Content - Booking Widget Skeleton */}
          <div className="lg:col-span-1 relative">
            <div className="sticky top-28 bg-white border border-gray-200 rounded-2xl shadow-xl p-6">
              <div className="flex justify-between items-end mb-6">
                <div className="h-8 bg-gray-200 rounded w-32"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>
              <div className="h-24 bg-gray-200 rounded-xl mb-4"></div>
              <div className="h-12 bg-gray-200 rounded-lg w-full mb-4"></div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
                <hr className="my-4 border-gray-100" />
                <div className="flex justify-between">
                  <div className="h-5 bg-gray-200 rounded w-20"></div>
                  <div className="h-5 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Razorpay Mock UI Overlay */}
      <RazorpayMockUI 
        isOpen={showRazorpayMock} 
        onClose={() => setShowRazorpayMock(false)} 
        onSuccess={handleRazorpaySuccess} 
        amount={pricing?.totalPrice} 
      />

      {/* Title & Header */}
      <h1 className="text-3xl font-semibold text-gray-900 mb-2">{listing.title}</h1>
      <div className="flex justify-between items-end mb-6">
        <div className="flex items-center gap-4 text-sm font-medium text-gray-700">
          <span className="flex items-center gap-1"><Star size={16} fill="currentColor" /> {averageRating} · {listing.reviews?.length || 0} reviews</span>
          <span className="flex items-center gap-1"><MapPin size={16} /> {listing.location}, {listing.country}</span>
        </div>
        <div className="flex gap-4 text-sm font-medium underline relative">
          <button onClick={handleShare} className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-lg transition">
             <Share size={16} /> Share
          </button>
          {showShareTooltip && (
             <span className="absolute -top-8 left-0 bg-black text-white text-xs px-2 py-1 rounded shadow">Link copied!</span>
          )}
          <button onClick={handleSave} className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-lg transition">
             <Heart size={16} className={`${isSaved ? 'fill-airbnb text-airbnb' : ''}`} /> 
             {isSaved ? 'Saved' : 'Save'}
          </button>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="rounded-2xl overflow-hidden mb-8 aspect-[2/1] md:aspect-[3/1] bg-gray-200 relative group">
        {listing.images && listing.images.length > 0 ? (
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            className="w-full h-full"
          >
            {listing.images.map((img, i) => (
              <SwiperSlide key={i}>
                <img src={img.url} alt={`${listing.title} ${i + 1}`} className="w-full h-full object-cover" />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <img src="https://via.placeholder.com/1200x600" alt="Placeholder" className="w-full h-full object-cover" />
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative">
        {/* Left Content */}
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center pb-6 border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-semibold mb-1">Hosted by {listing.owner?.username || 'Superhost'}</h2>
              <p className="text-gray-500">{listing.maxGuests || 2} guests · {listing.bedrooms || 1} bedrooms · {listing.beds || 1} beds</p>
            </div>
            <div className="h-14 w-14 rounded-full bg-gray-300 overflow-hidden flex-shrink-0">
               <img src="https://i.pravatar.cc/150?img=68" alt="Host" className="w-full h-full object-cover"/>
            </div>
          </div>

          <div className="py-6 border-b border-gray-200 space-y-4">
            <div className="flex gap-4 items-start">
              <Award className="mt-1 flex-shrink-0" size={24} />
              <div>
                <h3 className="font-semibold text-lg">Superhost</h3>
                <p className="text-gray-500">Superhosts are experienced, highly rated hosts who are committed to providing great stays.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <Key className="mt-1 flex-shrink-0" size={24} />
              <div>
                <h3 className="font-semibold text-lg">Great check-in experience</h3>
                <p className="text-gray-500">100% of recent guests gave the check-in process a 5-star rating.</p>
              </div>
            </div>
          </div>

          <div className="py-6 border-b border-gray-200">
            <h2 className="text-2xl font-semibold mb-4">About this space</h2>
            <p className="text-gray-700 leading-relaxed">{listing.description}</p>
          </div>

          <div className="py-6 border-b border-gray-200">
            <h2 className="text-2xl font-semibold mb-6">What this place offers</h2>
            {listing.amenities && listing.amenities.length > 0 ? (
               <div className="grid grid-cols-2 gap-4">
                 {listing.amenities.map(amenity => (
                   <div key={amenity} className="flex items-center gap-3 text-gray-700">
                      <div className="text-gray-400">
                         {/* Fallback Icon for all amenities */}
                         <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 13l4 4L19 7"/></svg>
                      </div>
                      <span className="text-lg">{amenity}</span>
                   </div>
                 ))}
               </div>
            ) : (
               <p className="text-gray-500 italic">No amenities specified.</p>
            )}
          </div>

          <div className="py-6 border-b border-gray-200">
            <h2 className="text-2xl font-semibold mb-4">Where you'll be</h2>
            <p className="text-gray-700 mb-6">{listing.location}, {listing.country}</p>
            <div className="h-[400px] w-full rounded-2xl overflow-hidden z-0 relative">
              <MapContainer 
                center={
                  listing.geometry?.coordinates 
                    ? [listing.geometry.coordinates[1], listing.geometry.coordinates[0]] 
                    : [20.5937, 78.9629] // Default India
                } 
                zoom={listing.geometry?.coordinates ? 12 : 4} 
                scrollWheelZoom={false} 
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                  url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                />
                {listing.geometry?.coordinates && (
                  <Marker position={[listing.geometry.coordinates[1], listing.geometry.coordinates[0]]} icon={customMarker}>
                    <Popup className="rounded-xl border-0 shadow-lg">
                      <div className="text-center font-semibold text-gray-900 px-2 py-1 text-sm">
                        Exact location provided after booking.
                      </div>
                    </Popup>
                  </Marker>
                )}
              </MapContainer>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="py-6 border-b border-gray-200">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
               <Star fill="currentColor" /> {averageRating} · {listing.reviews?.length || 0} reviews
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {listing.reviews?.map(review => (
                <div key={review._id} className="mb-4">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="h-12 w-12 rounded-full bg-gray-200 overflow-hidden">
                      <img src={`https://ui-avatars.com/api/?name=${review.author?.username || 'G'}&background=random`} alt="Avatar" className="w-full h-full object-cover"/>
                    </div>
                    <div>
                      <h4 className="font-semibold">{review.author?.username || 'Guest'}</h4>
                      <p className="text-gray-500 text-sm">
                         {new Date(review.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                     {[...Array(5)].map((_, i) => (
                       <Star key={i} size={12} fill={i < review.rating ? 'currentColor' : 'none'} className={i < review.rating ? 'text-gray-900' : 'text-gray-300'} />
                     ))}
                  </div>
                  <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                  
                  {/* Delete Review Button (if author) */}
                  {isLoggedIn && user && review.author?._id === user._id && (
                     <button onClick={() => handleDeleteReview(review._id)} className="text-sm font-semibold text-red-500 hover:underline mt-2">Delete Review</button>
                  )}
                </div>
              ))}
            </div>

            {/* Add Review Form */}
            {isLoggedIn ? (
              <div className="mt-8 bg-gray-50 p-6 rounded-2xl border border-gray-200">
                <h3 className="text-lg font-bold mb-4">Leave a Review</h3>
                <form onSubmit={handleReviewSubmit}>
                  <div className="mb-4">
                    <label className="block text-sm font-semibold mb-2">Rating</label>
                    <div className="flex gap-2">
                       {[1, 2, 3, 4, 5].map(star => (
                         <button 
                           key={star} type="button" 
                           onClick={() => setReviewRating(star)}
                           className={`p-2 rounded-full transition ${reviewRating >= star ? 'bg-black text-white' : 'bg-gray-200 text-gray-500 hover:bg-gray-300'}`}
                         >
                           <Star size={20} fill={reviewRating >= star ? 'currentColor' : 'none'} />
                         </button>
                       ))}
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-semibold mb-2">Your review</label>
                    <textarea 
                      value={reviewComment} 
                      onChange={(e) => setReviewComment(e.target.value)}
                      required
                      placeholder="Share your experience..."
                      className="w-full p-4 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-black focus:border-black"
                      rows="3"
                    ></textarea>
                  </div>
                  <button type="submit" disabled={isSubmittingReview} className={`bg-black text-white px-6 py-3 rounded-xl font-semibold transition ${isSubmittingReview ? 'opacity-50' : 'hover:bg-gray-800'}`}>
                    {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              </div>
            ) : (
              <div className="mt-8 bg-gray-50 p-6 rounded-2xl border border-gray-200 text-center">
                <p className="text-gray-700 mb-3">Log in to leave a review</p>
                <Link to="/login" className="inline-block border border-black px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition">Log in</Link>
              </div>
            )}
          </div>
        </div>

        {/* Right Content - Booking Widget */}
        <div className="lg:col-span-1 relative">
          <div className="sticky top-28 bg-white border border-gray-200 rounded-2xl shadow-xl p-6">
            <div className="flex justify-between items-end mb-6">
              <div>
                <span className="text-2xl font-bold">{formatPrice(listing.price)}</span>
                <span className="text-gray-500"> {t('night')}</span>
              </div>
              <div className="text-sm font-medium underline">
                <Star size={14} className="inline mr-1" fill="currentColor"/>{averageRating} · {listing.reviews?.length || 0} reviews
              </div>
            </div>

            <div className="border border-gray-400 rounded-xl mb-4 overflow-hidden">
              <div className="flex border-b border-gray-400">
                <div className="w-1/2 p-3 border-r border-gray-400">
                  <label className="block text-[10px] font-bold uppercase text-gray-800">Check-In</label>
                  <input type="date" value={checkIn} min={getToday()} onChange={e => handleCheckInChange(e.target.value)} className="w-full outline-none text-sm cursor-pointer mt-1" />
                </div>
                <div className="w-1/2 p-3">
                  <label className="block text-[10px] font-bold uppercase text-gray-800">Check-Out</label>
                  <input type="date" value={checkOut} min={checkIn ? getNextDay(checkIn) : getToday()} onChange={e => setCheckOut(e.target.value)} className={`w-full outline-none text-sm mt-1 ${!checkIn ? 'opacity-40 pointer-events-none' : 'cursor-pointer'}`} disabled={!checkIn} />
                </div>
              </div>
              <div className="p-3">
                <label className="block text-[10px] font-bold uppercase text-gray-800">Guests</label>
                <select value={guests} onChange={e => setGuests(e.target.value)} className="w-full outline-none text-sm cursor-pointer mt-1 bg-transparent">
                  {Array.from({ length: listing.maxGuests || 10 }, (_, i) => i + 1).map(n => <option key={n} value={n}>{n} guest{n > 1 ? 's' : ''}</option>)}
                </select>
              </div>
            </div>

            {pricingError && <p className="text-red-500 text-sm mb-3">{pricingError}</p>}

            {pricing && (
              <div className="mb-4 space-y-3 text-gray-700">
                <div className="flex justify-between">
                  <span className="underline">{formatPrice(listing.price)} x {pricing.nights} {t('night')} x {guests} guest{guests > 1 ? 's' : ''}</span>
                  <span>{formatPrice(pricing.basePrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="underline">Cleaning fee</span>
                  <span>{formatPrice(0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="underline">WanderLodge service fee</span>
                  <span>{formatPrice(pricing.serviceFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="underline">Taxes (18%)</span>
                  <span>{formatPrice(pricing.tax)}</span>
                </div>
                <hr className="my-4 border-gray-300" />
                <div className="flex justify-between font-bold text-lg text-black">
                  <span>Total</span>
                  <span>{formatPrice(pricing.totalPrice)}</span>
                </div>
              </div>
            )}

            <button onClick={handleReserve} disabled={!canReserve} className={`w-full text-white font-bold py-3 rounded-lg transition ${canReserve ? 'bg-airbnb hover:bg-airbnb-dark cursor-pointer' : 'bg-gray-300 cursor-not-allowed'}`}>
              {!checkIn ? 'Select dates to Reserve' : !pricing ? 'Check availability' : 'Reserve'}
            </button>
            <p className="text-center text-sm text-gray-500 mt-4">{canReserve ? "You won't be charged yet" : 'Pick check-in date first, then check-out'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetails;
