import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { User, Heart, Calendar, Settings, Download, Camera, X, FileText, Image as ImageIcon, Eye, XCircle, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Avatar from '../components/Avatar';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Generate stable barcode data per booking id
const generateBarcodeData = (seed) => {
  const bars = [];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = ((hash << 5) - hash) + seed.charCodeAt(i);
  for (let i = 0; i < 35; i++) {
    hash = (hash * 16807 + 7) % 2147483647;
    bars.push({
      thickness: 1 + (hash % 3), // 1px to 3px thick
      gap: 1 + ((hash >> 2) % 2) // 1px to 2px gap
    });
  }
  return bars;
};

const TicketCard = ({ booking, id }) => {
  const barcodeData = useMemo(() => generateBarcodeData(booking._id || 'default'), [booking._id]);
  const imgUrl = booking.listing?.images?.[0]?.url || 'https://images.unsplash.com/photo-1542718610-a1d656d1884c?q=80&w=800';

  return (
    <div id={id} style={{ fontFamily: 'Inter, Arial, sans-serif', width: '900px', height: '280px', display: 'flex', position: 'relative', borderRadius: '16px', overflow: 'hidden', backgroundColor: '#fff' }}>
      <div style={{ position: 'absolute', inset: 0, width: '75%', height: '100%', overflow: 'hidden' }}>
        <img crossOrigin="anonymous" src={imgUrl} alt="Hotel" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.95), rgba(0,0,0,0.7) 60%, transparent)' }}></div>
      </div>
      <div style={{ width: '50px', height: '100%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, zIndex: 10, borderRight: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ position: 'absolute', left: '-14px', top: '50%', transform: 'translateY(-50%)', width: '28px', height: '28px', backgroundColor: '#fff', borderRadius: '50%' }}></div>
        <div style={{ writingMode: 'vertical-rl', textOrientation: 'mixed', whiteSpace: 'nowrap', color: 'rgba(255,255,255,0.5)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em' }}>
          TICKET · #{(booking._id || '').substring(0, 8).toUpperCase()}
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex', padding: '32px 40px', position: 'relative', zIndex: 10 }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: '36px', fontWeight: 900, color: '#fff', textTransform: 'uppercase', lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: '4px', maxWidth: '320px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {booking.listing?.location?.split(',')[0] || 'DESTINATION'}
          </div>
          <div style={{ fontSize: '22px', fontWeight: 900, color: '#e8c99b', textTransform: 'uppercase', lineHeight: 1.3, letterSpacing: '-0.02em', marginBottom: '20px', maxWidth: '320px' }}>
            {booking.listing?.title || 'LUXURY STAY'}
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', fontWeight: 700, fontSize: '12px', padding: '6px 16px', borderRadius: '6px', textTransform: 'uppercase', letterSpacing: '0.08em', width: 'fit-content' }}>
            {new Date(booking.checkIn).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
        </div>
        <div style={{ width: '210px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '16px', paddingLeft: '28px', borderLeft: '1px solid rgba(255,255,255,0.2)' }}>
          <div>
            <div style={{ fontSize: '9px', fontWeight: 700, color: '#e8c99b', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '3px' }}>Check-In</div>
            <div style={{ color: '#fff', fontWeight: 500, fontSize: '16px' }}>{new Date(booking.checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
          </div>
          <div>
            <div style={{ fontSize: '9px', fontWeight: 700, color: '#e8c99b', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '3px' }}>Check-Out</div>
            <div style={{ color: '#fff', fontWeight: 500, fontSize: '16px' }}>{new Date(booking.checkOut).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
          </div>
          <div>
            <div style={{ fontSize: '9px', fontWeight: 700, color: '#e8c99b', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '3px' }}>Reservation</div>
            <div style={{ color: 'rgba(255,255,255,0.85)', fontWeight: 500, fontSize: '13px' }}>
              {booking.guests || 1} Guests · ₹{booking.totalPrice?.toLocaleString('en-IN')}
            </div>
          </div>
        </div>
      </div>
      <div style={{ width: 0, position: 'relative', zIndex: 20, borderLeft: '2.5px dashed rgba(232,201,155,0.5)', margin: '12px 0' }}>
        <div style={{ position: 'absolute', top: '-16px', left: '-13px', width: '24px', height: '24px', backgroundColor: '#fff', borderRadius: '50%' }}></div>
        <div style={{ position: 'absolute', bottom: '-16px', left: '-13px', width: '24px', height: '24px', backgroundColor: '#fff', borderRadius: '50%' }}></div>
      </div>
      <div style={{ width: '200px', height: '100%', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, backgroundColor: '#fbf5eb', borderRadius: '0 16px 16px 0', overflow: 'hidden', zIndex: 10, padding: '20px 16px' }}>
        <div style={{ position: 'absolute', right: '-10px', top: 0, bottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly' }}>
          {[0,1,2,3,4,5].map(i => <div key={i} style={{ width: '20px', height: '20px', backgroundColor: '#fff', borderRadius: '50%' }}></div>)}
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '8px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '2px' }}>Booking ID</div>
          <div style={{ fontSize: '10px', fontWeight: 700, color: '#000', letterSpacing: '0.1em' }}>#{(booking._id || '').substring(0, 10).toUpperCase()}</div>
          <div style={{ fontSize: '9px', fontWeight: 700, color: '#000', marginTop: '2px' }}>— LUX —</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100px', margin: '4px 0' }}>
          {barcodeData.map((b, i) => <div key={i} style={{ width: '100%', height: `${b.thickness}px`, backgroundColor: '#000', marginBottom: `${b.gap}px` }}></div>)}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '7px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Gate</span>
            <span style={{ fontWeight: 700, fontSize: '11px', letterSpacing: '0.1em', color: '#000' }}>VIP</span>
          </div>
          <div style={{ width: '1px', height: '16px', backgroundColor: '#d1d5db' }}></div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '7px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Class</span>
            <span style={{ fontWeight: 700, fontSize: '11px', letterSpacing: '0.1em', color: '#000' }}>FIRST</span>
          </div>
          <div style={{ width: '1px', height: '16px', backgroundColor: '#d1d5db' }}></div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '7px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Status</span>
            <span style={{ fontWeight: 700, fontSize: '10px', letterSpacing: '0.08em', color: booking.status === 'Cancelled' ? '#dc2626' : '#15803d' }}>
              {booking.status === 'Cancelled' ? '✕' : '✓'} {(booking.status || 'Confirmed').toUpperCase()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const InvoiceCard = ({ booking, authUser, id }) => (
  <div id={id} style={{ width: '800px', padding: '48px', backgroundColor: '#fff', color: '#111827', fontFamily: 'Inter, Arial, sans-serif', borderTop: '8px solid #FF385C', position: 'relative', overflow: 'hidden' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '48px' }}>
      <div>
        <h1 style={{ fontSize: '32px', fontWeight: 900, color: '#FF385C', marginBottom: '8px', letterSpacing: '-0.04em' }}>INVOICE</h1>
        <p style={{ color: '#6b7280', fontSize: '13px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' }}>WanderLodge Inc.</p>
      </div>
      <div style={{ textAlign: 'right' }}>
        <p style={{ fontSize: '13px', color: '#6b7280', fontWeight: 700, marginBottom: '4px' }}>INVOICE #</p>
        <p style={{ fontSize: '17px', fontWeight: 700 }}>INV-{(booking._id || '').substring(0, 8).toUpperCase()}</p>
        <p style={{ fontSize: '13px', color: '#6b7280', fontWeight: 700, marginTop: '16px', marginBottom: '4px' }}>DATE</p>
        <p style={{ fontSize: '17px', fontWeight: 700 }}>{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb', padding: '28px 0', marginBottom: '48px' }}>
      <div>
        <p style={{ fontSize: '11px', color: '#6b7280', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '6px' }}>Billed To</p>
        <p style={{ fontSize: '18px', fontWeight: 700 }}>{authUser?.username || 'Guest'}</p>
        <p style={{ color: '#4b5563' }}>{authUser?.email}</p>
      </div>
      <div style={{ textAlign: 'right' }}>
        <p style={{ fontSize: '11px', color: '#6b7280', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '6px' }}>Property</p>
        <p style={{ fontSize: '18px', fontWeight: 700 }}>{booking.listing?.title}</p>
        <p style={{ color: '#4b5563' }}>{booking.listing?.location}</p>
      </div>
    </div>
    <table style={{ width: '100%', marginBottom: '48px', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ borderBottom: '2px solid #111827', textAlign: 'left' }}>
          <th style={{ padding: '10px 0', fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6b7280' }}>Description</th>
          <th style={{ padding: '10px 0', fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6b7280', textAlign: 'center' }}>Guests</th>
          <th style={{ padding: '10px 0', fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6b7280', textAlign: 'right' }}>Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
          <td style={{ padding: '20px 0' }}>
            <p style={{ fontWeight: 700, fontSize: '16px', marginBottom: '4px' }}>Accommodation Booking</p>
            <p style={{ color: '#6b7280', fontSize: '13px' }}>Check-in: {new Date(booking.checkIn).toLocaleDateString()}</p>
            <p style={{ color: '#6b7280', fontSize: '13px' }}>Check-out: {new Date(booking.checkOut).toLocaleDateString()}</p>
          </td>
          <td style={{ padding: '20px 0', textAlign: 'center', fontWeight: 700 }}>{booking.guests || 1}</td>
          <td style={{ padding: '20px 0', textAlign: 'right', fontWeight: 700, fontSize: '16px' }}>₹{booking.totalPrice?.toLocaleString('en-IN')}</td>
        </tr>
      </tbody>
    </table>
    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '48px' }}>
      <div style={{ width: '50%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', color: '#4b5563' }}>
          <span>Subtotal</span><span style={{ fontWeight: 700 }}>₹{booking.totalPrice?.toLocaleString('en-IN')}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', color: '#4b5563', borderBottom: '1px solid #e5e7eb', marginBottom: '8px' }}>
          <span>Taxes & Fees</span><span style={{ fontWeight: 700 }}>Included</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', fontSize: '22px', fontWeight: 900, color: '#FF385C' }}>
          <span>Total</span><span>₹{booking.totalPrice?.toLocaleString('en-IN')}</span>
        </div>
      </div>
    </div>
    <div style={{ textAlign: 'center', color: '#9ca3af', fontSize: '13px', fontWeight: 500, marginTop: '40px', paddingTop: '24px', borderTop: '1px solid #f3f4f6' }}>
      <p>Thank you for booking with WanderLodge!</p>
      <p style={{ marginTop: '4px' }}>For support, contact support@wanderlodge.com</p>
    </div>
  </div>
);

const Dashboard = () => {
  const { user: authUser, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('trips');
  const [data, setData] = useState({ myBookings: [], wishlist: [] });
  const [loading, setLoading] = useState(true);

  const [profileData, setProfileData] = useState({ username: authUser?.username || '', email: authUser?.email || '' });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [profileUpdating, setProfileUpdating] = useState(false);
  const [profileMessage, setProfileMessage] = useState('');
  
  const [viewingTicket, setViewingTicket] = useState(null);
  const [viewingInvoice, setViewingInvoice] = useState(null);
  
  // Custom Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', type: 'info', onConfirm: null });

  const showAlert = (title, message, type = 'info') => {
    setConfirmModal({ isOpen: true, title, message, type, onConfirm: null });
  };

  const showConfirm = (title, message, onConfirm) => {
    setConfirmModal({ isOpen: true, title, message, type: 'confirm', onConfirm });
  };

  useEffect(() => {
    if (authLoading) return;
    if (!authUser) {
      window.location.href = '/login';
      return;
    }
    axios.get('/api/dashboard')
      .then(res => { setData(res.data); setLoading(false); })
      .catch(err => {
        console.error("Dashboard fetch error:", err.message);
        setLoading(false);
      });
  }, [authLoading, authUser]);

  const handleDownloadTicketImage = async (bookingId) => {
    const el = document.getElementById(`ticket-${bookingId}`);
    if (!el) return;
    try {
      const canvas = await html2canvas(el, { scale: 3, useCORS: true, backgroundColor: null });
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `wanderlodge-ticket-${bookingId}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Failed to generate ticket image", err);
      showAlert("Download Failed", "Failed to download ticket image.", "error");
    }
  };

  const handleDownloadInvoicePDF = async (bookingId) => {
    const el = document.getElementById(`invoice-${bookingId}`);
    if (!el) return;
    try {
      const canvas = await html2canvas(el, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`wanderlodge-invoice-${bookingId}.pdf`);
    } catch (err) {
      console.error("Failed to generate invoice PDF", err);
      showAlert("Download Failed", "Failed to download invoice PDF.", "error");
    }
  };

  const handleCancelBooking = (bookingId) => {
    showConfirm(
      "Cancel Booking",
      "Are you sure you want to cancel this booking? This action cannot be undone.",
      async () => {
        try {
          await axios.patch(`/api/bookings/${bookingId}/cancel`);
          setData(prev => ({
            ...prev,
            myBookings: prev.myBookings.map(b => b._id === bookingId ? { ...b, status: 'Cancelled' } : b)
          }));
          showAlert("Success", "Booking successfully cancelled.", "success");
        } catch (err) {
          showAlert("Error", err.response?.data?.error || 'Failed to cancel booking.', "error");
        }
      }
    );
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
      await axios.put('/api/auth/profile', formData, {
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

  if (loading || authLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-pulse">
        <div className="flex items-center gap-6 mb-10 pb-10 border-b border-gray-200">
          <div className="w-24 h-24 rounded-full bg-gray-200"></div>
          <div>
            <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>
        </div>
        <div className="space-y-6">
          {[1,2].map(i => (
            <div key={i} className="border border-gray-200 rounded-2xl p-6 flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-64 h-40 bg-gray-200 rounded-xl"></div>
              <div className="flex-1 space-y-4">
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-10 bg-gray-200 rounded w-32 mt-4"></div>
              </div>
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
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm sticky top-24">
          <div className="flex flex-col items-center mb-6">
            <Avatar user={authUser} className="w-24 h-24 text-3xl mb-3" />
            <h2 className="text-xl font-bold text-gray-900">{authUser?.username}</h2>
            <p className="text-gray-500 text-sm">{authUser?.email}</p>
            <span className="mt-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">{authUser?.role || 'USER'}</span>
          </div>
          <nav className="flex flex-col gap-1">
            <button onClick={() => setActiveTab('trips')} className={`flex items-center gap-3 p-3 rounded-lg text-left font-medium transition ${activeTab === 'trips' ? 'bg-gray-100 text-black' : 'text-gray-600 hover:bg-gray-50'}`}>
              <Calendar size={18} /> My Trips
            </button>
            <button onClick={() => setActiveTab('wishlist')} className={`flex items-center gap-3 p-3 rounded-lg text-left font-medium transition ${activeTab === 'wishlist' ? 'bg-gray-100 text-black' : 'text-gray-600 hover:bg-gray-50'}`}>
              <Heart size={18} /> Wishlist
            </button>
            <button onClick={() => setActiveTab('settings')} className={`flex items-center gap-3 p-3 rounded-lg text-left font-medium transition ${activeTab === 'settings' ? 'bg-gray-100 text-black' : 'text-gray-600 hover:bg-gray-50'}`}>
              <Settings size={18} /> Settings
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full md:w-3/4">
        {/* Trips Tab */}
        {activeTab === 'trips' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Your Bookings</h2>
            {data.myBookings.length === 0 ? (
              <div className="text-center py-16">
                <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 font-medium text-lg">No bookings yet</p>
                <p className="text-gray-400 text-sm mt-1">Start exploring amazing stays!</p>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {data.myBookings.map(booking => (
                  <div key={booking._id} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                    {/* Header */}
                    <div className="bg-gray-50 border-b border-gray-200 px-4 sm:px-6 py-4 flex flex-wrap justify-between items-center text-sm gap-4">
                      <div className="flex flex-wrap gap-6 sm:gap-8">
                        <div>
                          <span className="block text-gray-500 uppercase tracking-wider text-[10px] sm:text-xs mb-1 font-bold">Booked On</span>
                          <span className="font-medium text-gray-900">{new Date(booking.createdAt || booking.checkIn).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                        <div>
                          <span className="block text-gray-500 uppercase tracking-wider text-[10px] sm:text-xs mb-1 font-bold">Total</span>
                          <span className="font-medium text-gray-900">₹{booking.totalPrice?.toLocaleString('en-IN')}</span>
                        </div>
                        <div>
                          <span className="block text-gray-500 uppercase tracking-wider text-[10px] sm:text-xs mb-1 font-bold">Status</span>
                          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold ${booking.status === 'Confirmed' ? 'bg-green-100 text-green-700' : booking.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {booking.status || 'Confirmed'}
                          </span>
                        </div>
                      </div>
                      <div className="text-left sm:text-right w-full sm:w-auto">
                        <span className="block text-gray-500 uppercase tracking-wider text-[10px] sm:text-xs mb-1 font-bold">Booking ID: {booking._id.substring(0, 10).toUpperCase()}</span>
                        <div className="flex gap-3 text-airbnb font-semibold text-sm">
                          <button onClick={() => setViewingInvoice(booking)} className="hover:underline flex items-center gap-1"><Eye size={14}/> View Invoice</button>
                          <span className="text-gray-300">|</span>
                          <button onClick={() => setViewingTicket(booking)} className="hover:underline flex items-center gap-1"><Eye size={14}/> View Ticket</button>
                        </div>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="p-4 sm:p-6 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                      <div className="flex gap-4 sm:gap-6 items-center w-full md:w-auto">
                        <img src={booking.listing?.images?.[0]?.url || 'https://images.unsplash.com/photo-1542718610-a1d656d1884c?q=80&w=200'} alt="Listing" className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg shadow-sm shrink-0" />
                        <div>
                          <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1">{booking.listing?.title || 'Luxury Stay'}</h3>
                          <p className="text-gray-500 text-xs sm:text-sm mb-2">{booking.listing?.location}</p>
                          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-700 bg-gray-100 px-3 py-1 rounded-full w-max font-medium">
                            <Calendar size={14} className="text-airbnb" />
                            {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col w-full md:w-48 gap-3 shrink-0 mt-2 md:mt-0">
                        <button onClick={() => handleDownloadTicketImage(booking._id)} className="w-full flex items-center justify-center gap-2 bg-black text-white px-4 py-2.5 rounded-lg font-bold text-sm hover:bg-gray-800 transition shadow-md">
                          <ImageIcon size={16} /> Download Ticket
                        </button>
                        <button onClick={() => handleDownloadInvoicePDF(booking._id)} className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2.5 rounded-lg font-bold text-sm hover:bg-gray-50 transition shadow-sm">
                          <FileText size={16} /> Download Invoice
                        </button>
                        {booking.status !== 'Cancelled' && (
                          <button onClick={() => handleCancelBooking(booking._id)} className="w-full flex items-center justify-center gap-2 bg-white border border-red-300 text-red-600 px-4 py-2.5 rounded-lg font-bold text-sm hover:bg-red-50 transition">
                            <XCircle size={16} /> Cancel Booking
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Hidden Render Targets for html2canvas */}
                    <div className="absolute -left-[9999px] top-0 pointer-events-none opacity-0">
                      <TicketCard booking={booking} id={`ticket-${booking._id}`} />
                    </div>
                    <div className="absolute -left-[9999px] top-0 pointer-events-none opacity-0">
                      <InvoiceCard booking={booking} authUser={authUser} id={`invoice-${booking._id}`} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Wishlist Tab */}
        {activeTab === 'wishlist' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Your Wishlist</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.wishlist.map(listing => (
                <Link to={`/listings/${listing._id}`} key={listing._id} className="group cursor-pointer block">
                  <div className="overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                    <div className="overflow-hidden h-48">
                      <img src={listing.images?.[0]?.url || listing.image?.url || 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=400'} alt={listing.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 truncate">{listing.title}</h3>
                      <p className="text-sm text-gray-500 mb-2">{listing.location}</p>
                      <div className="flex justify-between items-center">
                        <p className="font-bold text-airbnb">₹{listing.price?.toLocaleString('en-IN')} <span className="font-normal text-gray-500 text-sm">/ night</span></p>
                        {listing.rating && <span className="text-sm font-medium">⭐ {listing.rating}</span>}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
              {data.wishlist.length === 0 && (
                <div className="col-span-3 text-center py-10">
                  <Heart size={40} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500 font-medium">Your wishlist is empty</p>
                  <p className="text-gray-400 text-sm mt-1">Save your favorite places for later</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div>
            <div className="bg-white border border-gray-200 rounded-2xl p-6 max-w-2xl shadow-sm">
              {profileMessage && (
                <div className={`p-4 mb-6 rounded-lg ${profileMessage.includes('success') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                  {profileMessage}
                </div>
              )}
              <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div className="flex flex-col items-center mb-6">
                  <div className="relative group">
                    {avatarPreview ? (
                      <div className="h-24 w-24 rounded-full overflow-hidden bg-gray-200">
                        <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <Avatar user={authUser} className="w-24 h-24 text-3xl" />
                    )}
                    <label htmlFor="avatar-upload" className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition cursor-pointer">
                      <Camera size={20} className="text-white" />
                    </label>
                    <input id="avatar-upload" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </div>
                  <p className="text-sm text-gray-500 mt-2">Click to change avatar</p>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Username</label>
                  <input type="text" value={profileData.username} onChange={e => setProfileData({...profileData, username: e.target.value})} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-airbnb outline-none transition" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                  <input type="email" value={profileData.email} onChange={e => setProfileData({...profileData, email: e.target.value})} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-airbnb outline-none transition" />
                </div>
                <button type="submit" disabled={profileUpdating} className="bg-airbnb text-white px-6 py-3 rounded-lg font-bold hover:bg-red-600 transition disabled:opacity-50">
                  {profileUpdating ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Ticket Modal */}
      {viewingTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={() => setViewingTicket(null)}>
          <button onClick={() => setViewingTicket(null)} className="fixed top-4 right-4 text-white hover:bg-white/20 p-2 rounded-full transition z-[60]">
            <X size={28} />
          </button>
          <div className="w-full h-full flex items-center justify-center overflow-hidden" onClick={e => e.stopPropagation()}>
             <div className="transform scale-[0.35] xs:scale-[0.45] sm:scale-[0.65] md:scale-[0.8] lg:scale-100 origin-center shadow-2xl rounded-2xl overflow-hidden shrink-0">
               <TicketCard booking={viewingTicket} />
             </div>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      {viewingInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={() => setViewingInvoice(null)}>
          <button onClick={() => setViewingInvoice(null)} className="fixed top-4 right-4 text-white hover:bg-white/20 p-2 rounded-full transition z-[60]">
            <X size={28} />
          </button>
          <div className="w-full h-full flex justify-center overflow-hidden" onClick={e => e.stopPropagation()}>
             <div className="transform scale-[0.40] xs:scale-[0.5] sm:scale-75 md:scale-90 lg:scale-100 origin-center shadow-2xl rounded-xl overflow-hidden bg-white shrink-0 mt-[10vh] lg:mt-[5vh]">
               <InvoiceCard booking={viewingInvoice} authUser={authUser} />
             </div>
          </div>
        </div>
      )}

      {/* Custom Confirmation Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })}>
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl transform scale-100 animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${confirmModal.type === 'error' ? 'bg-red-100 text-red-600' : confirmModal.type === 'success' ? 'bg-green-100 text-green-600' : 'bg-airbnb/10 text-airbnb'}`}>
               {confirmModal.type === 'error' ? <XCircle size={24} /> : confirmModal.type === 'success' ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{confirmModal.title}</h3>
            <p className="text-gray-600 mb-6">{confirmModal.message}</p>
            <div className="flex gap-3 justify-end">
              {confirmModal.type === 'confirm' ? (
                <>
                  <button onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })} className="px-4 py-2 font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition">Cancel</button>
                  <button onClick={() => { confirmModal.onConfirm(); setConfirmModal({ ...confirmModal, isOpen: false }); }} className="px-4 py-2 font-bold text-white bg-airbnb hover:bg-red-600 rounded-lg transition">Confirm</button>
                </>
              ) : (
                <button onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })} className="px-4 py-2 font-bold text-white bg-black hover:bg-gray-800 rounded-lg transition">Okay</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
