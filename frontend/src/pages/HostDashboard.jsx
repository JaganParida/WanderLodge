import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { PlusCircle, List, Settings, TrendingUp, CalendarCheck, CheckCircle, XCircle, Camera, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Avatar from '../components/Avatar';
import SafeImage from '../components/SafeImage';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const HostDashboard = () => {
  const { user, isHost, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('listings');
  const [data, setData] = useState({ myListings: [] });
  const [analyticsData, setAnalyticsData] = useState({ chartData: [], reservations: [], totalEarnings: 0, totalBookings: 0 });
  const [loading, setLoading] = useState(true);

  // Profile Settings state
  const [profileData, setProfileData] = useState({ username: user?.username || '', email: user?.email || '', avatar: user?.avatar || '' });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [profileUpdating, setProfileUpdating] = useState(false);
  const [profileMessage, setProfileMessage] = useState('');

  // Custom Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', type: 'info', onConfirm: null });

  const showAlert = (title, message, type = 'info') => {
    setConfirmModal({ isOpen: true, title, message, type, onConfirm: null });
  };

  const showConfirm = (title, message, onConfirm) => {
    setConfirmModal({ isOpen: true, title, message, type: 'confirm', onConfirm });
  };

  // Route Guard & Profile Sync
  useEffect(() => {
    if (!authLoading && !isHost) {
      navigate('/dashboard');
    }
  }, [isHost, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      setProfileData(prev => ({
        ...prev,
        username: user.username || prev.username,
        email: user.email || prev.email,
        avatar: user.avatar || prev.avatar
      }));
    }
  }, [user]);

  // Form states
  const initialListingState = { 
    title: '', description: '', location: '', country: '', price: '',
    category: 'Trending', amenities: [], maxGuests: 2, bedrooms: 1, beds: 1
  };
  const [newListing, setNewListing] = useState(initialListingState);
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Edit State
  const [editingId, setEditingId] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setNewListing({ 
      ...newListing, 
      [name]: type === 'number' ? Number(value) : value 
    });
  };

  const handleCheckboxChange = (amenity) => {
    setNewListing(prev => {
      const amenities = prev.amenities?.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...(prev.amenities || []), amenity];
      return { ...prev, amenities };
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleEditClick = (listing) => {
    setEditingId(listing._id);
    setNewListing({
      title: listing.title,
      description: listing.description,
      location: listing.location,
      country: listing.country || '',
      price: listing.price,
      category: listing.category || 'Trending',
      amenities: listing.amenities || [],
      maxGuests: listing.maxGuests || 2,
      bedrooms: listing.bedrooms || 1,
      beds: listing.beds || 1
    });
    setImageFile(null);
    setActiveTab('create');
    setError('');
    setSuccess('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteClick = (id) => {
    showConfirm(
      "Delete Property",
      "Are you sure you want to delete this property? This cannot be undone.",
      async () => {
        try {
          await axios.delete(`/api/listings/${id}`);
          setData(prev => ({
            ...prev,
            myListings: prev.myListings.filter(l => l._id !== id)
          }));
          showAlert("Success", "Listing successfully deleted.", "success");
        } catch (err) {
          showAlert("Error", "Failed to delete listing.", "error");
          console.error(err);
        }
      }
    );
  };

  const handleCreateListing = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('listing[title]', newListing.title);
      formData.append('listing[description]', newListing.description);
      formData.append('listing[location]', newListing.location);
      formData.append('listing[country]', newListing.country);
      formData.append('listing[price]', newListing.price);
      formData.append('listing[category]', newListing.category);
      formData.append('listing[maxGuests]', newListing.maxGuests);
      formData.append('listing[bedrooms]', newListing.bedrooms);
      formData.append('listing[beds]', newListing.beds);
      newListing.amenities.forEach((amenity, index) => {
        formData.append(`listing[amenities][${index}]`, amenity);
      });
      if (imageFile) {
        formData.append('listing[images]', imageFile);
      }

      let res;
      if (editingId) {
        // Update existing listing
        res = await axios.put(`/api/listings/${editingId}`, formData, {
          headers: { 
            'Content-Type': 'multipart/form-data'
          }
        });
        setSuccess('Property successfully updated!');
        setData(prev => ({
          ...prev,
          myListings: prev.myListings.map(l => l._id === editingId ? res.data.listing : l)
        }));
      } else {
        // Create new listing
        res = await axios.post('/api/listings', formData, {
          headers: { 
            'Content-Type': 'multipart/form-data'
          }
        });
        setSuccess('Property successfully published!');
        setData(prev => ({
          ...prev,
          myListings: [res.data.listing, ...prev.myListings]
        }));
      }

      setNewListing(initialListingState);
      setImageFile(null);
      setEditingId(null);
      
      setTimeout(() => setActiveTab('listings'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to process request.');
      setIsSubmitting(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileUpdating(true);
    setProfileMessage('');
    try {
      const formData = new FormData();
      if (profileData.username) formData.append('username', profileData.username);
      if (profileData.email) formData.append('email', profileData.email);
      if (avatarFile) formData.append('avatar', avatarFile);

      const res = await axios.put('http://localhost:8080/api/auth/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });
      setProfileMessage('Profile updated successfully!');
      window.location.reload(); 
    } catch (err) {
      setProfileMessage('Failed to update profile.');
    } finally {
      setProfileUpdating(false);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
      setAvatarPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  useEffect(() => {
    if (authLoading || !isHost) return;
    
    // Fetch dashboard data
    axios.get('/api/dashboard')
      .then(res => {
        setData(res.data);
      })
      .catch(console.error);

    axios.get('/api/host/analytics')
      .then(res => {
        const reservations = (res.data.reservations || []).filter(r => r.listing !== null);
        setAnalyticsData({
          chartData: res.data.chartData || [],
          reservations: reservations,
          totalEarnings: res.data.totalEarnings || 0,
          totalBookings: res.data.totalBookings || 0,
          totalListings: res.data.totalListings || 0
        });
        setLoading(false);
      })
      .catch(err => {
        console.error("Analytics fetch error:", err.message);
        setLoading(false);
      });
  }, [isHost, authLoading]);

  const handleUpdateBookingStatus = (bookingId, status) => {
    showConfirm(
      status === 'Confirmed' ? "Accept Reservation" : "Reject Reservation",
      `Are you sure you want to ${status === 'Confirmed' ? 'accept' : 'reject'} this reservation?`,
      async () => {
        try {
          await axios.patch(`/api/host/reservations/${bookingId}`, { status });
          // Update local state
          setAnalyticsData(prev => ({
            ...prev,
            reservations: prev.reservations.map(r => r._id === bookingId ? { ...r, status } : r)
          }));
          showAlert("Success", `Booking successfully ${status.toLowerCase()}.`, "success");
        } catch (err) {
          showAlert("Error", "Failed to update booking status", "error");
        }
      }
    );
  };

  if (!isHost) return null;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
        {/* Header Skeleton */}
        <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[1,2,3].map(i => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-200"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>
              <div className="h-8 bg-gray-200 rounded w-32"></div>
            </div>
          ))}
        </div>

        {/* Graph Skeleton */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm mb-8">
          <div className="h-6 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="h-64 bg-gray-200 rounded-xl w-full"></div>
        </div>

        {/* Tabs Skeleton */}
        <div className="flex gap-4 mb-6 border-b border-gray-200">
          <div className="h-6 bg-gray-200 rounded w-24 mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-24 mb-4"></div>
        </div>

        {/* List Skeleton */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between">
             <div className="h-4 bg-gray-200 rounded w-1/4"></div>
             <div className="h-4 bg-gray-200 rounded w-1/4"></div>
             <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
          {[1,2,3,4].map(i => (
            <div key={i} className="p-4 border-b border-gray-100 flex justify-between items-center">
              <div className="flex items-center gap-4 w-1/4">
                <div className="w-12 h-12 rounded-xl bg-gray-200"></div>
                <div className="h-4 bg-gray-200 rounded w-32"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
      {/* Sidebar */}
      <div className="w-full md:w-1/4">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex flex-col items-center">
            <h2 className="text-xl font-bold">Host Dashboard</h2>
            <p className="text-gray-500 text-sm mb-4">Manage your properties</p>
            <Link to="/dashboard" className="w-full text-center py-2 px-4 border border-gray-300 hover:bg-gray-50 rounded-lg font-semibold transition">
              Switch to Traveling
            </Link>
          </div>
        </div>
        
        <nav className="flex flex-col gap-2">
          <button onClick={() => { setActiveTab('listings'); setEditingId(null); setNewListing(initialListingState); }} className={`flex items-center gap-3 p-3 rounded-lg text-left font-medium transition ${activeTab === 'listings' ? 'bg-gray-100 text-black' : 'text-gray-600 hover:bg-gray-50'}`}>
            <List size={20} /> My Properties
          </button>
          <button onClick={() => { setActiveTab('create'); setEditingId(null); setNewListing(initialListingState); }} className={`flex items-center gap-3 p-3 rounded-lg text-left font-medium transition ${activeTab === 'create' && !editingId ? 'bg-gray-100 text-black' : 'text-gray-600 hover:bg-gray-50'}`}>
            <PlusCircle size={20} /> Add Property
          </button>
          <button onClick={() => setActiveTab('reservations')} className={`flex items-center gap-3 p-3 rounded-lg text-left font-medium transition ${activeTab === 'reservations' ? 'bg-gray-100 text-black' : 'text-gray-600 hover:bg-gray-50'}`}>
            <CalendarCheck size={20} /> Reservations
          </button>
          <button onClick={() => setActiveTab('analytics')} className={`flex items-center gap-3 p-3 rounded-lg text-left font-medium transition ${activeTab === 'analytics' ? 'bg-gray-100 text-black' : 'text-gray-600 hover:bg-gray-50'}`}>
            <TrendingUp size={20} /> Analytics
          </button>
          <button onClick={() => setActiveTab('settings')} className={`flex items-center gap-3 p-3 rounded-lg text-left font-medium transition ${activeTab === 'settings' ? 'bg-gray-100 text-black' : 'text-gray-600 hover:bg-gray-50'}`}>
            <Settings size={20} /> Settings
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="w-full md:w-3/4">
        {activeTab === 'listings' && (
          <div>
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold">Your Properties</h2>
                <button onClick={() => { setActiveTab('create'); setEditingId(null); setNewListing(initialListingState); }} className="bg-gradient-to-r from-black to-gray-800 text-white px-5 py-2.5 rounded-xl font-semibold hover:shadow-lg transition">Create New</button>
              </div>
            {data.myListings.length === 0 ? (
               <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-200 border-dashed">
                 <h3 className="text-xl font-bold text-gray-900 mb-2">No properties yet</h3>
                 <p className="text-gray-500 mb-4">Start earning by publishing your first property today.</p>
                 <button onClick={() => setActiveTab('create')} className="bg-airbnb text-white px-6 py-3 rounded-xl font-semibold hover:bg-airbnb-dark transition">Add your first property</button>
               </div>
            ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {data.myListings.map(listing => (
                     <div key={listing._id} className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition bg-white flex flex-col h-full">
                         <div className="h-56 bg-gray-100 relative group overflow-hidden">
                            <SafeImage src={listing.images?.[0]?.url} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" fallbackIconSize={48} />
                            <div className="absolute top-3 left-3">
                               <span className="bg-white/90 backdrop-blur text-gray-900 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">Live</span>
                            </div>
                         </div>
                         <div className="p-5 flex flex-col flex-grow">
                             <div className="flex justify-between items-start mb-1">
                                <h3 className="font-bold text-[17px] truncate pr-2 text-gray-900">{listing.title}</h3>
                                <span className="font-bold text-gray-900 whitespace-nowrap">₹{listing.price?.toLocaleString()}</span>
                             </div>
                             <p className="text-gray-500 text-sm mb-4 truncate">{listing.location}, {listing.country}</p>
                             
                             <div className="mt-auto pt-4 border-t border-gray-100 flex gap-2">
                                 <button onClick={() => handleEditClick(listing)} className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 py-2 rounded-lg text-sm font-semibold transition border border-gray-200">Edit</button>
                                 <button onClick={() => handleDeleteClick(listing._id)} className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded-lg text-sm font-semibold transition border border-red-100">Delete</button>
                             </div>
                         </div>
                     </div>
                   ))}
               </div>
            )}
          </div>
        )}

        {activeTab === 'create' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">{editingId ? 'Edit Property' : 'Add New Property'}</h2>
            <form onSubmit={handleCreateListing} className="bg-white border border-gray-200 p-8 rounded-2xl shadow-sm space-y-6">
                {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium">{error}</div>}
                {success && <div className="bg-green-50 text-green-600 p-4 rounded-xl text-sm font-medium">{success}</div>}
                
                {/* Basic Info */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold border-b pb-2">Basic Info</h3>
                  <div>
                      <label className="block text-sm font-semibold mb-1 text-gray-700">Property Title</label>
                      <input type="text" name="title" value={newListing.title} onChange={handleInputChange} required className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-black outline-none transition" placeholder="e.g. Cozy Mountain Cabin" />
                  </div>
                  <div>
                      <label className="block text-sm font-semibold mb-1 text-gray-700">Description</label>
                      <textarea name="description" value={newListing.description} onChange={handleInputChange} required rows="3" className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-black outline-none transition" placeholder="Share what makes your place special..." />
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold border-b pb-2">Location & Pricing</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-sm font-semibold mb-1 text-gray-700">Category</label>
                            <select name="category" value={newListing.category} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-black outline-none bg-white">
                                {['Trending', 'Beachfront', 'Cabins', 'OMG!', 'Castles', 'Lakefront', 'Tiny homes', 'Farms', 'City', 'Pools'].map(cat => (
                                  <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-1 text-gray-700">City/Location</label>
                            <input type="text" name="location" value={newListing.location} onChange={handleInputChange} required className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black outline-none" placeholder="e.g. Paris" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-1 text-gray-700">Country</label>
                            <input type="text" name="country" value={newListing.country} onChange={handleInputChange} required className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black outline-none" placeholder="e.g. France" />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-semibold mb-1 text-gray-700">Price per night (₹)</label>
                            <input type="number" name="price" value={newListing.price} onChange={handleInputChange} required min="0" className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black outline-none font-medium" placeholder="5000" />
                        </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-bold border-b pb-2">Capacity</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-sm font-semibold mb-1 text-gray-700">Max Guests</label>
                            <input type="number" name="maxGuests" value={newListing.maxGuests} onChange={handleInputChange} required min="1" className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-1 text-gray-700">Bedrooms</label>
                            <input type="number" name="bedrooms" value={newListing.bedrooms} onChange={handleInputChange} required min="0" className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-1 text-gray-700">Beds</label>
                            <input type="number" name="beds" value={newListing.beds} onChange={handleInputChange} required min="1" className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black outline-none" />
                        </div>
                    </div>
                  </div>
                </div>

                {/* Amenities */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold border-b pb-2">Amenities</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {['Wifi', 'TV', 'Kitchen', 'Workspace', 'Pool', 'Parking', 'Air Conditioning', 'Heating'].map(amenity => (
                      <label key={amenity} className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition select-none ${newListing.amenities?.includes(amenity) ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}>
                        <input type="checkbox" className="hidden" checked={newListing.amenities?.includes(amenity) || false} onChange={() => handleCheckboxChange(amenity)} />
                        <div className={`w-5 h-5 rounded border flex items-center justify-center ${newListing.amenities?.includes(amenity) ? 'bg-black border-black text-white' : 'border-gray-300'}`}>
                          {newListing.amenities?.includes(amenity) && <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>}
                        </div>
                        <span className={`font-medium ${newListing.amenities?.includes(amenity) ? 'text-black' : 'text-gray-600'}`}>{amenity}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Image Upload */}
                <div className="space-y-4">
                    <h3 className="text-lg font-bold border-b pb-2">Photos {editingId && <span className="text-gray-400 font-normal text-sm">(Optional to change)</span>}</h3>
                    <div className="border-2 border-dashed border-gray-300 rounded-2xl p-10 flex flex-col justify-center items-center text-gray-500 hover:bg-gray-50 hover:border-gray-400 cursor-pointer transition relative group">
                        <input type="file" accept="image/*" onChange={handleFileChange} required={!editingId} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                        
                        {imageFile ? (
                           <div className="text-center">
                             <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                               <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                             </div>
                             <span className="font-bold text-gray-900 block">{imageFile.name}</span>
                             <span className="text-sm">Click to change</span>
                           </div>
                        ) : (
                           <div className="text-center group-hover:scale-105 transition">
                             <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                               <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                             </div>
                             <span className="font-bold text-gray-900 block text-lg mb-1">{editingId ? 'Replace Cover Image' : 'Upload Cover Image'}</span>
                             <span className="text-sm">Drag and drop or click to browse</span>
                           </div>
                        )}
                    </div>
                </div>

                <div className="pt-4">
                  <button type="submit" disabled={isSubmitting} className={`w-full text-white font-bold py-4 rounded-xl text-lg transition ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-airbnb to-airbnb-dark hover:shadow-lg hover:scale-[1.01]'}`}>
                    {isSubmitting ? (editingId ? 'Updating Property...' : 'Publishing Property...') : (editingId ? 'Save Changes' : 'Publish Property')}
                  </button>
                </div>
            </form>
          </div>
        )}

        {activeTab === 'earnings' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Earnings & Reservations</h2>
            
            {/* Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-green-50 to-emerald-100 border border-green-200 rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-green-200/40 rounded-full -mr-8 -mt-8"></div>
                <p className="text-sm font-medium text-green-700 mb-1">Total Earnings</p>
                <p className="text-3xl font-bold text-green-900">₹{(data.totalEarnings || 0).toLocaleString('en-IN')}</p>
                <p className="text-xs text-green-600 mt-2">After platform fees</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-sky-100 border border-blue-200 rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-200/40 rounded-full -mr-8 -mt-8"></div>
                <p className="text-sm font-medium text-blue-700 mb-1">Total Reservations</p>
                <p className="text-3xl font-bold text-blue-900">{(data.hostReservations || []).length}</p>
                <p className="text-xs text-blue-600 mt-2">All time bookings</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-violet-100 border border-purple-200 rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-purple-200/40 rounded-full -mr-8 -mt-8"></div>
                <p className="text-sm font-medium text-purple-700 mb-1">Active Listings</p>
                <p className="text-3xl font-bold text-purple-900">{(data.myListings || []).length}</p>
                <p className="text-xs text-purple-600 mt-2">Properties live</p>
              </div>
            </div>

            {/* Reservations Table */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-100">
                <h3 className="font-bold text-lg">Recent Reservations</h3>
              </div>
              {(data.hostReservations || []).length === 0 ? (
                <div className="p-10 text-center text-gray-400">
                  <TrendingUp size={40} className="mx-auto mb-3 text-gray-300" />
                  <p className="font-semibold text-gray-500">No reservations yet</p>
                  <p className="text-sm">When travelers book your properties, their reservations will appear here.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 text-gray-600 text-left">
                        <th className="px-5 py-3 font-semibold">Guest</th>
                        <th className="px-5 py-3 font-semibold">Property</th>
                        <th className="px-5 py-3 font-semibold">Check-In</th>
                        <th className="px-5 py-3 font-semibold">Check-Out</th>
                        <th className="px-5 py-3 font-semibold">Guests</th>
                        <th className="px-5 py-3 font-semibold text-right">Revenue</th>
                        <th className="px-5 py-3 font-semibold text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {(data.hostReservations || []).map(reservation => (
                        <tr key={reservation._id} className="hover:bg-gray-50 transition">
                          <td className="px-5 py-4 font-medium text-gray-900">{reservation.user?.username || 'Guest'}</td>
                          <td className="px-5 py-4 text-gray-600 truncate max-w-[180px]">{reservation.listing?.title || 'Listing'}</td>
                          <td className="px-5 py-4 text-gray-600">{new Date(reservation.checkIn).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                          <td className="px-5 py-4 text-gray-600">{new Date(reservation.checkOut).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                          <td className="px-5 py-4 text-gray-600">{reservation.guests}</td>
                          <td className="px-5 py-4 text-right font-bold text-green-700">₹{reservation.totalPrice?.toLocaleString('en-IN')}</td>
                          <td className="px-5 py-4 text-center">
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${reservation.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                              {reservation.status || 'Confirmed'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
             </div>
           </div>
        )}

        {/* Reservations Tab */}
        {activeTab === 'reservations' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Manage Reservations</h2>
            {analyticsData.reservations.length === 0 ? (
               <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-xl border border-dashed">No reservations yet.</div>
            ) : (
               <div className="space-y-4">
                 {analyticsData.reservations.map(res => (
                   <div key={res._id} className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm">
                     <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                       <div className="flex-1">
                         <div className="flex items-center gap-3 mb-3">
                           <div className="w-10 h-10 rounded-full bg-gradient-to-br from-airbnb to-rose-400 flex items-center justify-center text-white font-bold text-sm shrink-0">
                             {(res.user?.username || 'G')[0].toUpperCase()}
                           </div>
                           <div>
                             <p className="font-bold text-gray-900">{res.user?.username || 'Guest'}</p>
                             <p className="text-xs text-gray-500">{res.user?.email || ''}</p>
                           </div>
                         </div>
                         <h3 className="font-bold text-lg mb-1">{res.listing?.title || 'Unknown Property'}</h3>
                         <p className="text-sm text-gray-500">{res.listing?.location || ''}</p>
                         <div className="flex flex-wrap gap-4 mt-3 text-sm">
                           <div className="bg-gray-50 px-3 py-1.5 rounded-lg">
                             <span className="text-gray-500">Check-in: </span>
                             <span className="font-semibold">{new Date(res.checkIn).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                           </div>
                           <div className="bg-gray-50 px-3 py-1.5 rounded-lg">
                             <span className="text-gray-500">Check-out: </span>
                             <span className="font-semibold">{new Date(res.checkOut).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                           </div>
                           <div className="bg-gray-50 px-3 py-1.5 rounded-lg">
                             <span className="text-gray-500">Guests: </span>
                             <span className="font-semibold">{res.guests}</span>
                           </div>
                           <div className="bg-green-50 px-3 py-1.5 rounded-lg">
                             <span className="text-gray-500">Revenue: </span>
                             <span className="font-bold text-green-700">₹{res.totalPrice?.toLocaleString('en-IN')}</span>
                           </div>
                         </div>
                       </div>
                       <div className="flex flex-col items-end gap-2 shrink-0">
                         <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${res.status === 'Confirmed' ? 'bg-green-100 text-green-700' : res.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                           {res.status}
                         </span>
                         {res.status === 'Pending' && (
                           <div className="flex gap-2 mt-2">
                              <button onClick={() => handleUpdateBookingStatus(res._id, 'Confirmed')} className="flex items-center gap-1 bg-green-50 hover:bg-green-100 text-green-700 px-3 py-1.5 rounded-lg text-sm font-semibold transition border border-green-200">
                                <CheckCircle size={16} /> Accept
                              </button>
                              <button onClick={() => handleUpdateBookingStatus(res._id, 'Cancelled')} className="flex items-center gap-1 bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-lg text-sm font-semibold transition border border-red-200">
                                <XCircle size={16} /> Reject
                              </button>
                           </div>
                         )}
                       </div>
                     </div>
                   </div>
                 ))}
               </div>
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Performance Analytics</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
               <div className="bg-gradient-to-br from-green-50 to-emerald-100 border border-green-200 rounded-2xl p-6 relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-24 h-24 bg-green-200/40 rounded-full -mr-8 -mt-8"></div>
                 <p className="text-sm font-bold text-green-700 uppercase tracking-widest mb-2">Total Earnings</p>
                 <h3 className="text-3xl font-black text-green-900">₹{(analyticsData.totalEarnings || 0).toLocaleString('en-IN')}</h3>
                 <p className="text-xs text-green-600 mt-2">From confirmed bookings</p>
               </div>
               <div className="bg-gradient-to-br from-blue-50 to-sky-100 border border-blue-200 rounded-2xl p-6 relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-24 h-24 bg-blue-200/40 rounded-full -mr-8 -mt-8"></div>
                 <p className="text-sm font-bold text-blue-700 uppercase tracking-widest mb-2">Total Bookings</p>
                 <h3 className="text-3xl font-black text-blue-900">{analyticsData.totalBookings || 0}</h3>
                 <p className="text-xs text-blue-600 mt-2">All time reservations</p>
               </div>
               <div className="bg-gradient-to-br from-purple-50 to-violet-100 border border-purple-200 rounded-2xl p-6 relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-24 h-24 bg-purple-200/40 rounded-full -mr-8 -mt-8"></div>
                 <p className="text-sm font-bold text-purple-700 uppercase tracking-widest mb-2">Active Listings</p>
                 <h3 className="text-3xl font-black text-purple-900">{analyticsData.totalListings || 0}</h3>
                 <p className="text-xs text-purple-600 mt-2">Properties live</p>
               </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mb-8">
               <h3 className="font-bold text-lg mb-6">Monthly Revenue</h3>
               {(analyticsData.chartData || []).length === 0 ? (
                 <div className="h-64 flex items-center justify-center text-gray-500 bg-gray-50 rounded-xl">Not enough data to display chart</div>
               ) : (
                 <div className="h-72 w-full">
                   <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={analyticsData.chartData}>
                       <XAxis dataKey="name" axisLine={false} tickLine={false} />
                       <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `₹${value}`} />
                       <Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                       <Bar dataKey="revenue" fill="#1a73e8" radius={[4, 4, 0, 0]} />
                     </BarChart>
                   </ResponsiveContainer>
                 </div>
               )}
            </div>

            {/* Recent Bookings Summary */}
            {analyticsData.reservations.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-5 border-b border-gray-100">
                  <h3 className="font-bold text-lg">Recent Bookings</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 text-gray-600 text-left">
                        <th className="px-5 py-3 font-semibold">Guest</th>
                        <th className="px-5 py-3 font-semibold">Property</th>
                        <th className="px-5 py-3 font-semibold">Check-In</th>
                        <th className="px-5 py-3 font-semibold">Check-Out</th>
                        <th className="px-5 py-3 font-semibold text-right">Revenue</th>
                        <th className="px-5 py-3 font-semibold text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {analyticsData.reservations.slice(0, 10).map(reservation => (
                        <tr key={reservation._id} className="hover:bg-gray-50 transition">
                          <td className="px-5 py-4">
                            <p className="font-medium text-gray-900">{reservation.user?.username || 'Guest'}</p>
                            <p className="text-xs text-gray-500">{reservation.user?.email || ''}</p>
                          </td>
                          <td className="px-5 py-4 text-gray-600 truncate max-w-[180px]">{reservation.listing?.title || 'Listing'}</td>
                          <td className="px-5 py-4 text-gray-600">{new Date(reservation.checkIn).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                          <td className="px-5 py-4 text-gray-600">{new Date(reservation.checkOut).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                          <td className="px-5 py-4 text-right font-bold text-green-700">₹{reservation.totalPrice?.toLocaleString('en-IN')}</td>
                          <td className="px-5 py-4 text-center">
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${reservation.status === 'Confirmed' ? 'bg-green-100 text-green-700' : reservation.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                              {reservation.status || 'Pending'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
        {activeTab === 'settings' && (
            <div>
              <div className="bg-white border border-gray-200 rounded-2xl p-6 max-w-2xl shadow-sm">
                {profileMessage && (
                  <div className={`p-4 mb-6 rounded-lg ${profileMessage?.includes('success') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                    {profileMessage}
                  </div>
                )}
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Host Profile Picture</label>
                    <div className="flex items-center gap-6">
                      {avatarPreview ? (
                         <div className="h-24 w-24 rounded-full overflow-hidden bg-gray-200">
                           <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                         </div>
                      ) : (
                         <Avatar user={{ username: profileData.username || 'Host', avatar: profileData.avatar }} className="w-24 h-24 text-3xl" />
                      )}
                      <div>
                        <input type="file" id="avatarUpload" accept="image/*" onChange={handleImageChange} className="hidden" />
                        <label htmlFor="avatarUpload" className="cursor-pointer px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition flex items-center gap-2">
                          <Camera size={16} /> Change Photo
                        </label>
                        <p className="text-xs text-gray-500 mt-2">JPG, GIF or PNG. Max size of 5MB.</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Host Name</label>
                    <input 
                      type="text" 
                      value={profileData.username} 
                      onChange={e => setProfileData({...profileData, username: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-black outline-none transition"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Host Email</label>
                    <input 
                      type="email" 
                      value={profileData.email} 
                      onChange={e => setProfileData({...profileData, email: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-black outline-none transition"
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={profileUpdating}
                    className="bg-black text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800 transition disabled:opacity-50"
                  >
                    {profileUpdating ? 'Saving...' : 'Save Settings'}
                  </button>
                </form>
              </div>
            </div>
        )}
      {/* Custom Confirmation Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })}>
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl transform scale-100 animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${confirmModal.type === 'error' ? 'bg-red-100 text-red-600' : confirmModal.type === 'success' ? 'bg-green-100 text-green-600' : 'bg-black/10 text-black'}`}>
               {confirmModal.type === 'error' ? <XCircle size={24} /> : confirmModal.type === 'success' ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{confirmModal.title}</h3>
            <p className="text-gray-600 mb-6">{confirmModal.message}</p>
            <div className="flex gap-3 justify-end">
              {confirmModal.type === 'confirm' ? (
                <>
                  <button onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })} className="px-4 py-2 font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition">Cancel</button>
                  <button onClick={() => { confirmModal.onConfirm(); setConfirmModal({ ...confirmModal, isOpen: false }); }} className="px-4 py-2 font-bold text-white bg-black hover:bg-gray-800 rounded-lg transition">Confirm</button>
                </>
              ) : (
                <button onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })} className="px-4 py-2 font-bold text-white bg-black hover:bg-gray-800 rounded-lg transition">Okay</button>
              )}
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default HostDashboard;
