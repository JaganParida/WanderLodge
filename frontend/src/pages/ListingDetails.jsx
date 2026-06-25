import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Star, MapPin, Share, Heart, Award, Key, Info, Home as HomeIcon, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LoginModal from '../components/LoginModal';
import PhotoTourModal from '../components/PhotoTourModal';
import RazorpayMockUI from '../components/RazorpayMockUI';
import SafeImage from '../components/SafeImage';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix leaflet icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
});

const customMarker = new L.divIcon({
  className: 'custom-div-icon bg-transparent border-0',
  html: `<div class="bg-airbnb w-14 h-14 rounded-full flex justify-center items-center shadow-lg border-2 border-white transform transition hover:scale-110"><svg class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg></div>`,
  iconSize: [56, 56],
  iconAnchor: [28, 56],
  popupAnchor: [0, -56]
});

const ListingDetails = () => {
  const { user, isLoggedIn, formatPrice, t } = useAuth();
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isSaved, setIsSaved] = useState(false);
  const [showShareTooltip, setShowShareTooltip] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState({ isOpen: false, message: '' });
  const [showPhotoTour, setShowPhotoTour] = useState(false);
  
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [pricing, setPricing] = useState(null);
  const [pricingError, setPricingError] = useState('');
  const [showRazorpayMock, setShowRazorpayMock] = useState(false);

  const getToday = () => new Date().toISOString().split('T')[0];
  const getNextDay = (dateStr) => {
    const d = new Date(dateStr);
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  const handleCheckInChange = (val) => {
    setCheckIn(val);
    if (!checkOut || checkOut <= val) setCheckOut(getNextDay(val));
  };

  useEffect(() => {
    setPricingError('');
    if (checkIn && checkOut && checkOut > checkIn) {
      axios.post(`/api/listings/${id}/book/calculate`, { checkIn, checkOut, guests })
      .then(res => setPricing(res.data))
      .catch(err => {
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
      setShowLoginModal({ isOpen: true, message: 'Log in to reserve this place' });
      return;
    }
    if (!canReserve) return;
    setShowRazorpayMock(true);
  };

  const handleRazorpaySuccess = () => {
    axios.post(`/api/listings/${id}/book`, { checkIn, checkOut, guests, totalPrice: pricing.totalPrice })
    .then(() => window.location.href = '/dashboard')
    .catch(err => alert('Failed to save booking to database.'));
  };

  useEffect(() => {
    axios.get(`/api/listings/${id}`)
      .then(res => {
        setListing(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching listing:", err.message);
        setError('Failed to load listing. It may have been deleted or does not exist.');
        setLoading(false);
      });
      
    if (isLoggedIn) {
       axios.get('/api/dashboard')
         .then(res => {
            if(res.data.wishlist) {
               setIsSaved(res.data.wishlist.some(w => (w._id || w) === id));
            }
         }).catch(console.error);
    }
  }, [id, isLoggedIn]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowShareTooltip(true);
    setTimeout(() => setShowShareTooltip(false), 2000);
  };

  const handleSave = async () => {
    if (!isLoggedIn) {
      setShowLoginModal({ isOpen: true, message: 'Log in to add to wishlist' });
      return;
    }
    setIsSaved(!isSaved); 
    try {
      await axios.post(`/api/wishlists/${id}/toggle`, {});
    } catch (err) {
      setIsSaved(!isSaved); 
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      setShowLoginModal({ isOpen: true, message: 'Log in to leave a review' });
      return;
    }
    if (!reviewComment.trim()) return;

    setIsSubmittingReview(true);
    try {
      const res = await axios.post(`/api/listings/${id}/reviews`, { review: { rating: reviewRating, comment: reviewComment }});
      const newReview = { ...res.data.review, author: { _id: user?._id, username: user?.username || 'You' }, createdAt: new Date().toISOString()};
      setListing(prev => ({ ...prev, reviews: [...prev.reviews, newReview] }));
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
      setListing(prev => ({ ...prev, reviews: prev.reviews.filter(r => r._id !== reviewId) }));
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete review");
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-48 mb-6"></div>
        <div className="rounded-2xl overflow-hidden mb-8 aspect-[2/1] bg-gray-200"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12"><div className="lg:col-span-2"><div className="h-32 bg-gray-200 rounded"></div></div><div className="h-64 bg-gray-200 rounded-2xl"></div></div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-2xl font-bold mb-2">Oops!</h2>
        <p className="text-gray-500 mb-6">{error || 'Listing not found'}</p>
        <Link to="/" className="bg-black text-white px-6 py-3 rounded-lg font-bold">Back to Home</Link>
      </div>
    );
  }

  const averageRating = listing.reviews?.length > 0 
    ? (listing.reviews.reduce((acc, curr) => acc + (curr.rating || 0), 0) / listing.reviews.length).toFixed(2)
    : 'New';

  // Format images for grid (ensure we have 5 spots)
  const images = listing.images || [];
  const displayImages = [
    images[0]?.url || 'https://images.unsplash.com/photo-1542718610-a1d656d1884c?q=80&w=1200',
    images[1]?.url || 'https://images.unsplash.com/photo-1502672260266-1c1e5250ce07?q=80&w=600',
    images[2]?.url || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=600',
    images[3]?.url || 'https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?q=80&w=600',
    images[4]?.url || 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=600'
  ];

  const expandedTourImages = [
    ...displayImages,
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200',
    'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1200',
    'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=1200',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1200',
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=1200',
    'https://images.unsplash.com/photo-1505691938895-1758d7def511?q=80&w=1200',
    'https://images.unsplash.com/photo-1560185016-86f34eaf49ba?q=80&w=1200',
    'https://images.unsplash.com/photo-1560448204-61cb05a52395?q=80&w=1200'
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <LoginModal isOpen={showLoginModal.isOpen} onClose={() => setShowLoginModal({ isOpen: false, message: '' })} message={showLoginModal.message} />
      <PhotoTourModal isOpen={showPhotoTour} onClose={() => setShowPhotoTour(false)} images={listing.images?.length > 1 ? listing.images : expandedTourImages} title={listing.title} />
      <RazorpayMockUI isOpen={showRazorpayMock} onClose={() => setShowRazorpayMock(false)} onSuccess={handleRazorpaySuccess} amount={pricing?.totalPrice} />

      {/* Header */}
      <h1 className="text-[26px] font-semibold text-gray-900 mb-1">{listing.title}</h1>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center text-[15px] font-medium text-gray-900 gap-2">
           {listing.reviews?.length > 0 && <span className="flex items-center gap-1 font-semibold"><Star size={14} fill="currentColor" /> {averageRating}</span>}
           {listing.reviews?.length > 0 && <span className="text-gray-400">·</span>}
           {listing.reviews?.length > 0 && <span className="underline cursor-pointer hover:text-black">{listing.reviews.length} reviews</span>}
           {(!listing.reviews || listing.reviews.length === 0) && <span className="flex items-center gap-1 font-semibold text-gray-600"><Star size={14} fill="currentColor" /> New</span>}
           <span className="text-gray-400">·</span>
           <span className="flex items-center gap-1 underline cursor-pointer hover:text-black"><MapPin size={14} className="no-underline" /> {listing.location}, {listing.country}</span>
        </div>
        <div className="flex gap-4 text-sm font-semibold relative">
          <button onClick={handleShare} className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded-lg transition">
             <Share size={16} /> Share
          </button>
          {showShareTooltip && <span className="absolute -top-8 left-0 bg-black text-white text-xs px-2 py-1 rounded shadow">Link copied!</span>}
          <button onClick={handleSave} className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded-lg transition">
             <Heart size={16} className={`${isSaved ? 'fill-airbnb text-airbnb' : ''}`} /> {isSaved ? 'Saved' : 'Save'}
          </button>
        </div>
      </div>

      {/* Mobile Photo Viewer */}
      <div className="md:hidden relative w-[100vw] h-[300px] -mx-4 sm:-mx-6 mb-6">
        <div className="flex overflow-x-auto snap-x snap-mandatory h-full scrollbar-hide">
          {displayImages.map((imgUrl, idx) => (
            <div key={idx} className="w-full h-full flex-shrink-0 snap-center relative">
              <SafeImage 
                 src={imgUrl} 
                 alt={`Photo ${idx + 1}`} 
                 className="w-full h-full object-cover" 
                 onClick={() => setShowPhotoTour(true)} 
              />
            </div>
          ))}
          <div 
             className="w-full h-full flex-shrink-0 snap-center flex flex-col items-center justify-center bg-gray-100 cursor-pointer" 
             onClick={() => setShowPhotoTour(true)}
          >
             <div className="border-2 border-black rounded-lg px-6 py-3 font-semibold flex items-center gap-2">
                <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation" focusable="false" style={{ display: 'block', height: '16px', width: '16px', fill: 'currentcolor' }}><path d="m8.5 7.4-4-4.1c-.2-.3-.6-.3-.8 0l-1.3 1.3c-.3.3-.3.7 0 .9l3.5 3.5c.2.2.2.5 0 .7l-3.5 3.5c-.2.2-.2.6 0 .8l1.3 1.3c.2.2.6.2.8 0l4-4c.3-.3.3-.7 0-.9zm6.2-.2-4-4.1c-.2-.3-.6-.3-.8 0l-1.3 1.3c-.3.3-.3.7 0 .9l3.5 3.5c.2.2.2.5 0 .7l-3.5 3.5c-.2.2-.2.6 0 .8l1.3 1.3c.2.2.6.2.8 0l4-4c.3-.3.3-.7 0-.9z"></path></svg>
                Show all photos
             </div>
          </div>
        </div>
        <button 
           onClick={() => setShowPhotoTour(true)} 
           className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1.5 rounded-lg text-sm font-semibold backdrop-blur-sm shadow-sm"
        >
          View all photos
        </button>
      </div>

      {/* Airbnb-style Photo Grid (Desktop) */}
      <div className="hidden md:grid grid-cols-4 grid-rows-2 gap-2 h-[50vh] min-h-[400px] max-h-[500px] mb-8 relative rounded-2xl overflow-hidden bg-gray-100">
        <div className="col-span-2 row-span-2 h-full cursor-pointer overflow-hidden group">
          <SafeImage src={displayImages[0]} fallbackIconSize={48} className="w-full h-full object-cover group-hover:scale-[1.02] transition duration-500 hover:brightness-90" />
        </div>
        <div className="col-span-1 row-span-1 h-full cursor-pointer overflow-hidden group">
          <SafeImage src={displayImages[1]} className="w-full h-full object-cover group-hover:scale-[1.02] transition duration-500 hover:brightness-90" />
        </div>
        <div className="col-span-1 row-span-1 h-full cursor-pointer overflow-hidden group">
          <SafeImage src={displayImages[2]} className="w-full h-full object-cover group-hover:scale-[1.02] transition duration-500 hover:brightness-90" />
        </div>
        <div className="col-span-1 row-span-1 h-full cursor-pointer overflow-hidden group">
          <SafeImage src={displayImages[3]} className="w-full h-full object-cover group-hover:scale-[1.02] transition duration-500 hover:brightness-90" />
        </div>
        <div className="col-span-1 row-span-1 h-full cursor-pointer overflow-hidden group">
          <SafeImage src={displayImages[4]} className="w-full h-full object-cover group-hover:scale-[1.02] transition duration-500 hover:brightness-90" />
        </div>
        <button onClick={() => setShowPhotoTour(true)} className="absolute bottom-6 right-6 bg-white px-4 py-1.5 rounded-lg font-semibold text-[15px] border border-black flex items-center gap-2 hover:bg-gray-100 shadow-md">
           <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation" focusable="false" style={{ display: 'block', height: '16px', width: '16px', fill: 'currentcolor' }}><path d="m8.5 7.4-4-4.1c-.2-.3-.6-.3-.8 0l-1.3 1.3c-.3.3-.3.7 0 .9l3.5 3.5c.2.2.2.5 0 .7l-3.5 3.5c-.2.2-.2.6 0 .8l1.3 1.3c.2.2.6.2.8 0l4-4c.3-.3.3-.7 0-.9zm6.2-.2-4-4.1c-.2-.3-.6-.3-.8 0l-1.3 1.3c-.3.3-.3.7 0 .9l3.5 3.5c.2.2.2.5 0 .7l-3.5 3.5c-.2.2-.2.6 0 .8l1.3 1.3c.2.2.6.2.8 0l4-4c.3-.3.3-.7 0-.9z"></path></svg>
           Show all photos
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-20 gap-y-10 relative">
        {/* Left Content */}
        <div className="lg:col-span-2">
          {/* Host Info */}
          <div className="flex justify-between items-center pb-6 border-b border-gray-200">
            <div>
              <h2 className="text-[22px] font-semibold mb-1">Room in a home hosted by {listing.owner?.username || 'Superhost'}</h2>
              <ol className="flex text-[15px] text-gray-900 list-none gap-2">
                <li>{listing.maxGuests || 2} guests</li>
                <li>·</li>
                <li>{listing.bedrooms || 1} bedrooms</li>
                <li>·</li>
                <li>{listing.beds || 1} beds</li>
              </ol>
            </div>
            <div className="h-14 w-14 rounded-full bg-gray-300 overflow-hidden flex-shrink-0">
               <img src={`https://ui-avatars.com/api/?name=${listing.owner?.username || 'H'}&background=random`} alt="Host" className="w-full h-full object-cover"/>
            </div>
          </div>

          {/* Highlights */}
          <div className="py-8 border-b border-gray-200 space-y-6">
            <div className="flex gap-5 items-start">
              <Award className="flex-shrink-0" size={28} strokeWidth={1.5} />
              <div>
                <h3 className="font-semibold text-lg">{listing.owner?.username || 'Host'} is a highly rated host</h3>
                <p className="text-gray-500 text-[15px] mt-1">Highly rated hosts are experienced and committed to providing great stays for guests.</p>
              </div>
            </div>
            {averageRating >= 4.8 && (
              <div className="flex gap-5 items-start">
                <Key className="flex-shrink-0" size={28} strokeWidth={1.5} />
                <div>
                  <h3 className="font-semibold text-lg">Great check-in experience</h3>
                  <p className="text-gray-500 text-[15px] mt-1">Recent guests gave the check-in process high ratings.</p>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="py-8 border-b border-gray-200">
            <div className="text-[16px] text-gray-900 leading-relaxed whitespace-pre-wrap">{listing.description}</div>
          </div>

          {/* Amenities */}
          <div className="py-8 border-b border-gray-200">
            <h2 className="text-[22px] font-semibold mb-6">What this place offers</h2>
            <div className="grid grid-cols-2 gap-y-4 gap-x-8">
               {listing.amenities?.map(amenity => (
                 <div key={amenity} className="flex items-center gap-4 text-gray-900 pb-2">
                    <CheckCircle size={24} strokeWidth={1.5} className="text-gray-500" />
                    <span className="text-[16px]">{amenity}</span>
                 </div>
               ))}
               {(!listing.amenities || listing.amenities.length === 0) && <p className="text-gray-500 italic">No amenities specified.</p>}
            </div>
            {listing.amenities?.length > 4 && (
              <button className="mt-6 font-semibold border border-black rounded-lg px-6 py-3 hover:bg-gray-50 transition text-[16px]">
                Show all {listing.amenities.length} amenities
              </button>
            )}
          </div>

          {/* Map */}
          <div className="py-8 border-b border-gray-200">
            <h2 className="text-[22px] font-semibold mb-6">Where you'll be</h2>
            <div className="h-[480px] w-full rounded-xl overflow-hidden z-0 relative mb-4">
              <MapContainer center={listing.geometry?.coordinates ? [listing.geometry.coordinates[1], listing.geometry.coordinates[0]] : [20.5937, 78.9629]} zoom={listing.geometry?.coordinates ? 13 : 4} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
                {listing.geometry?.coordinates && (
                  <Marker position={[listing.geometry.coordinates[1], listing.geometry.coordinates[0]]} icon={customMarker}>
                    <Popup className="rounded-xl border-0 shadow-lg"><div className="text-center font-semibold text-gray-900 px-2 py-1 text-sm">Exact location provided after booking.</div></Popup>
                  </Marker>
                )}
              </MapContainer>
            </div>
            <p className="font-semibold text-[16px]">{listing.location}, {listing.country}</p>
          </div>

          {/* Reviews */}
          <div className="py-8">
            <h2 className="text-[22px] font-semibold mb-8 flex items-center gap-2">
               <Star fill="currentColor" size={20} /> {averageRating} · {listing.reviews?.length || 0} reviews
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              {listing.reviews?.map(review => (
                <div key={review._id}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-200"><img src={`https://ui-avatars.com/api/?name=${review.author?.username || 'G'}&background=random`} alt="Avatar" className="w-full h-full object-cover"/></div>
                    <div>
                      <h4 className="font-semibold text-[16px]">{review.author?.username || 'Guest'}</h4>
                      <p className="text-gray-500 text-sm">{new Date(review.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                     {[...Array(5)].map((_, i) => (<Star key={i} size={10} fill={i < review.rating ? 'currentColor' : 'none'} className={i < review.rating ? 'text-gray-900' : 'text-gray-300'} />))}
                  </div>
                  <p className="text-gray-800 leading-relaxed text-[16px]">{review.comment}</p>
                  {isLoggedIn && user && review.author?._id === user._id && (<button onClick={() => handleDeleteReview(review._id)} className="text-sm font-semibold text-red-500 hover:underline mt-3">Delete</button>)}
                </div>
              ))}
            </div>

            <div className="mt-12">
              <h3 className="text-lg font-bold mb-4">Leave a Review</h3>
              <form onSubmit={handleReviewSubmit} className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2">Rating</label>
                  <div className="flex gap-2">
                     {[1, 2, 3, 4, 5].map(star => (
                       <button key={star} type="button" onClick={() => setReviewRating(star)} className={`p-2 rounded-full transition ${reviewRating >= star ? 'bg-black text-white' : 'bg-gray-200 text-gray-500'}`}><Star size={20} fill={reviewRating >= star ? 'currentColor' : 'none'} /></button>
                     ))}
                  </div>
                </div>
                <div className="mb-4">
                  <textarea value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} required placeholder="Share your experience..." className="w-full p-4 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-black" rows="3"></textarea>
                </div>
                <button type="submit" disabled={isSubmittingReview} className="bg-black text-white px-6 py-3 rounded-xl font-bold transition hover:bg-gray-800">{isSubmittingReview ? 'Submitting...' : 'Submit Review'}</button>
              </form>
            </div>
          </div>
        </div>

        {/* Right Content - Booking Widget */}
        <div className="lg:col-span-1 relative mt-8 lg:mt-0">
          <div className="sticky top-28 bg-white border border-gray-300 rounded-2xl p-6 shadow-xl w-full">
            <div className="flex items-baseline mb-6 gap-1">
              <span className="text-[22px] font-semibold">{formatPrice(listing.price)}</span>
              <span className="text-gray-800 text-[16px]"> night</span>
            </div>

            <div className="border border-gray-400 rounded-xl mb-4 overflow-hidden focus-within:border-black focus-within:border-[2px]">
              <div className="flex border-b border-gray-400">
                <div className="w-1/2 p-3 border-r border-gray-400 relative">
                  <label className="block text-[10px] font-bold uppercase text-gray-900 tracking-wider">Check-In</label>
                  <input type="date" value={checkIn} min={getToday()} onChange={e => handleCheckInChange(e.target.value)} className="w-full outline-none text-sm cursor-pointer mt-1 font-medium bg-transparent" />
                </div>
                <div className="w-1/2 p-3 relative">
                  <label className="block text-[10px] font-bold uppercase text-gray-900 tracking-wider">Check-Out</label>
                  <input type="date" value={checkOut} min={checkIn ? getNextDay(checkIn) : getToday()} onChange={e => setCheckOut(e.target.value)} className={`w-full outline-none text-sm mt-1 font-medium bg-transparent ${!checkIn ? 'opacity-40 pointer-events-none' : 'cursor-pointer'}`} disabled={!checkIn} />
                </div>
              </div>
              <div className="p-3 relative">
                <label className="block text-[10px] font-bold uppercase text-gray-900 tracking-wider">Guests</label>
                <select value={guests} onChange={e => setGuests(e.target.value)} className="w-full outline-none text-sm cursor-pointer mt-1 font-medium bg-transparent appearance-none">
                  {Array.from({ length: listing.maxGuests || 10 }, (_, i) => i + 1).map(n => <option key={n} value={n}>{n} guest{n > 1 ? 's' : ''}</option>)}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                   <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation" focusable="false" style={{ display: 'block', fill: 'none', height: '16px', width: '16px', stroke: 'currentcolor', strokeWidth: 4, overflow: 'visible' }}><g fill="none"><path d="m28 12-11.2928932 11.2928932c-.3905243.3905243-1.0236893.3905243-1.4142136 0l-11.2928932-11.2928932"></path></g></svg>
                </div>
              </div>
            </div>

            {pricingError && <p className="text-red-500 text-sm mb-3 font-medium">{pricingError}</p>}

            <button onClick={handleReserve} className={`w-full text-white font-bold py-3.5 rounded-lg transition text-[16px] mb-4 ${canReserve ? 'bg-gradient-to-r from-[#E61E4D] to-[#D70466] hover:opacity-95 cursor-pointer' : 'bg-gray-300 cursor-not-allowed'}`}>
              {!checkIn ? 'Check availability' : !pricing ? 'Check availability' : 'Reserve'}
            </button>
            <p className="text-center text-sm text-gray-600 font-medium mb-6">{canReserve ? "You won't be charged yet" : 'Enter dates and guests to check availability'}</p>

            {pricing && (
              <div className="space-y-4 text-gray-800 text-[16px]">
                <div className="flex justify-between">
                  <span className="underline">{formatPrice(listing.price)} x {pricing.nights} night{pricing.nights > 1 ? 's' : ''}</span>
                  <span>{formatPrice(pricing.basePrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="underline">WanderLodge service fee</span>
                  <span>{formatPrice(pricing.serviceFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="underline">Taxes (18%)</span>
                  <span>{formatPrice(pricing.tax)}</span>
                </div>
                <hr className="my-6 border-gray-200" />
                <div className="flex justify-between font-bold text-[16px] text-gray-900">
                  <span>Total before taxes</span>
                  <span>{formatPrice(pricing.totalPrice)}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetails;
