import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Globe, Menu, X, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Avatar from './Avatar';

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isGlobeModalOpen, setIsGlobeModalOpen] = useState(false);
  const [globeTab, setGlobeTab] = useState('language'); // 'language' or 'currency'
  const { user, isLoggedIn, isHost, logout, updateUserPreferences, t, globalLanguage, globalCurrency } = useAuth();

  // Initialize modal state from global context
  const [selectedLanguage, setSelectedLanguage] = useState(globalLanguage || 'English (US)');
  const [selectedCurrency, setSelectedCurrency] = useState(globalCurrency || 'INR - ₹');

  // Search states
  const [searchLocation, setSearchLocation] = useState('');
  const [searchCheckIn, setSearchCheckIn] = useState('');
  const [searchCheckOut, setSearchCheckOut] = useState('');
  const [searchGuests, setSearchGuests] = useState(1);

  const navigate = useNavigate();

  // Sync modal state when global state changes
  useEffect(() => {
    setSelectedLanguage(globalLanguage);
    setSelectedCurrency(globalCurrency);
  }, [globalLanguage, globalCurrency]);

  const handleLanguageSelect = (lang) => {
    setSelectedLanguage(lang);
    if (isLoggedIn) updateUserPreferences(lang, selectedCurrency);
    setIsGlobeModalOpen(false);
  };

  const handleCurrencySelect = (currString) => {
    setSelectedCurrency(currString);
    if (isLoggedIn) updateUserPreferences(selectedLanguage, currString);
    setIsGlobeModalOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    setIsDropdownOpen(false);
    navigate('/');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setIsSearchExpanded(false);
    // Navigate with query params
    const params = new URLSearchParams();
    if (searchLocation) params.append('location', searchLocation);
    if (searchCheckIn) params.append('checkIn', searchCheckIn);
    if (searchCheckOut) params.append('checkOut', searchCheckOut);
    if (searchGuests > 1) params.append('guests', searchGuests);
    
    navigate(`/?${params.toString()}`);
  };

  return (
    <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-1 text-airbnb">
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-airbnb">
              <path d="M8 3l4 8 5-5 5 15H2L8 3z" />
            </svg>
            <span className="text-xl font-bold tracking-tight hidden md:block">WanderLodge</span>
          </Link>

          {/* Search Bar (Mid) */}
          {!isSearchExpanded ? (
            <div onClick={() => setIsSearchExpanded(true)} className="hidden md:flex items-center border border-gray-300 rounded-full py-2 px-4 shadow-sm hover:shadow-md transition cursor-pointer">
              <button className="text-sm font-semibold px-4 border-r border-gray-300">{t('Anywhere')}</button>
              <button className="text-sm font-semibold px-4 border-r border-gray-300">{t('Any week')}</button>
              <button className="text-sm text-gray-500 px-4">{t('Add guests')}</button>
              <div className="bg-airbnb text-white p-2 rounded-full">
                <Search size={16} strokeWidth={3} />
              </div>
            </div>
          ) : (
             <div className="hidden md:flex items-center space-x-6 text-gray-500">
               <button className="text-black font-semibold border-b-2 border-black pb-1">{t('Stays')}</button>
               <button className="hover:text-gray-900 pb-1">{t('Experiences')}</button>
               <button className="hover:text-gray-900 pb-1">{t('Online Experiences')}</button>
             </div>
          )}

          {/* Right Menu */}
          <div className="flex items-center gap-4 relative">
            {isLoggedIn && isHost ? (
              <Link to="/host-dashboard" className="hidden md:block text-sm font-semibold hover:bg-gray-100 py-2 px-4 rounded-full transition">
                {t('Become a host')}
              </Link>
            ) : (
              <Link to="/host/signup" className="hidden md:block text-sm font-semibold hover:bg-gray-100 py-2 px-4 rounded-full transition">
                {t('Become a host')}
              </Link>
            )}
            <button 
              onClick={() => setIsGlobeModalOpen(true)}
              className="hidden md:flex items-center gap-2 hover:bg-gray-100 py-2 px-3 rounded-full transition text-sm font-semibold"
            >
              <Globe size={18} />
              <span>{globalLanguage?.split(' ')[0]} ({(globalCurrency || '').split(' ')[0]})</span>
            </button>
            
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 border border-gray-300 rounded-full p-2 hover:shadow-md transition bg-white"
            >
              <Menu size={18} className="ml-1" />
              <Avatar user={user} className="w-8 h-8 text-xs" showIconFallback={!isLoggedIn} />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 top-14 w-60 bg-white rounded-xl shadow-xl border border-gray-200 py-2 text-sm z-50">
                {isLoggedIn ? (
                  <>
                    <div className="px-4 py-2 border-b border-gray-100 mb-1">
                      <p className="font-bold text-gray-900">{user?.username}</p>
                      <p className="text-xs text-gray-400 uppercase">{user?.role}</p>
                    </div>
                    <Link to="/dashboard" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-3 font-semibold hover:bg-gray-100">My Trips</Link>
                    {isHost && (
                      <Link to="/host-dashboard" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-3 font-semibold hover:bg-gray-100">Manage Listings</Link>
                    )}
                    <hr className="my-1 border-gray-200" />
                    <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-100">Log out</button>
                  </>
                ) : (
                  <>
                    <Link to="/signup" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-3 font-bold text-gray-900 hover:bg-gray-100 transition">Sign up</Link>
                    <Link to="/login" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-3 text-gray-700 hover:bg-gray-100 transition">Log in</Link>
                    <hr className="my-1 border-gray-200" />
                    <Link to="/host/signup" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-3 text-gray-700 hover:bg-gray-100 transition">Become a host</Link>
                    <Link to="/" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-3 text-gray-700 hover:bg-gray-100 transition">Help Center</Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Expanded Big Search Bar */}
        {isSearchExpanded && (
          <div className="hidden md:block absolute top-20 left-0 right-0 bg-white pb-6 z-50">
             <div className="max-w-4xl mx-auto mt-2">
                <form onSubmit={handleSearchSubmit} className="flex items-center bg-white border border-gray-300 rounded-full shadow-lg relative">
                   <div className="flex-1 px-8 py-3 hover:bg-gray-100 rounded-full cursor-pointer transition">
                      <label className="block text-xs font-bold text-gray-800">Where</label>
                      <input type="text" value={searchLocation} onChange={(e) => setSearchLocation(e.target.value)} placeholder="Search destinations" className="w-full bg-transparent outline-none text-sm placeholder-gray-500" />
                   </div>
                   <div className="w-px h-10 bg-gray-300"></div>
                   <div className="flex-1 px-8 py-3 hover:bg-gray-100 rounded-full cursor-pointer transition">
                      <label className="block text-xs font-bold text-gray-800">Check in</label>
                      <input type="date" value={searchCheckIn} onChange={(e) => setSearchCheckIn(e.target.value)} min={new Date().toISOString().split('T')[0]} className="w-full bg-transparent outline-none text-sm text-gray-600 cursor-pointer" />
                   </div>
                   <div className="w-px h-10 bg-gray-300"></div>
                   <div className="flex-1 px-8 py-3 hover:bg-gray-100 rounded-full cursor-pointer transition">
                      <label className="block text-xs font-bold text-gray-800">Check out</label>
                      <input type="date" value={searchCheckOut} onChange={(e) => setSearchCheckOut(e.target.value)} min={searchCheckIn || new Date().toISOString().split('T')[0]} className="w-full bg-transparent outline-none text-sm text-gray-600 cursor-pointer" />
                   </div>
                   <div className="w-px h-10 bg-gray-300"></div>
                   <div className="flex-[1.2] pl-8 pr-2 py-2 hover:bg-gray-100 rounded-full cursor-pointer transition flex justify-between items-center">
                      <div>
                        <label className="block text-xs font-bold text-gray-800">Who</label>
                        <select value={searchGuests} onChange={(e) => setSearchGuests(Number(e.target.value))} className="w-full bg-transparent outline-none text-sm text-gray-600 appearance-none cursor-pointer">
                           {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n === 1 ? 'Add guests' : `${n} guests`}</option>)}
                        </select>
                      </div>
                      <button type="submit" className="bg-airbnb hover:bg-airbnb-dark text-white rounded-full p-3 flex items-center gap-2 font-bold transition">
                         <Search size={20} strokeWidth={3} /> Search
                      </button>
                   </div>
                </form>
             </div>
          </div>
        )}
      </div>

      {/* Search Overlay Backdrop */}
      {isSearchExpanded && (
        <div onClick={() => setIsSearchExpanded(false)} className="fixed inset-0 top-[160px] bg-black/30 z-40"></div>
      )}
      {/* Search Bar Expanded (if implemented) */}
      {/* ... (Existing search bar code) ... */}
      
      {/* Globe Modal (Language & Currency) */}
      {isGlobeModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-sm transition-opacity">
          <div className="bg-white w-full max-w-[1000px] h-[85vh] sm:h-[600px] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center">
              <button 
                onClick={() => setIsGlobeModalOpen(false)} 
                className="p-2 hover:bg-gray-100 rounded-full transition mr-4"
              >
                <X size={20} />
              </button>
              <div className="flex gap-6 font-semibold text-sm">
                <button 
                  onClick={() => setGlobeTab('language')} 
                  className={`pb-4 -mb-4 border-b-2 transition ${globeTab === 'language' ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-black'}`}
                >
                  Language and region
                </button>
                <button 
                  onClick={() => setGlobeTab('currency')} 
                  className={`pb-4 -mb-4 border-b-2 transition ${globeTab === 'currency' ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-black'}`}
                >
                  Currency
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6">
              {globeTab === 'language' && (
                <div>
                  <h3 className="text-xl font-bold mb-6">Suggested languages and regions</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {['English (US)', 'English (UK)', 'Hindi (India)', 'French (France)'].map(lang => (
                      <button 
                        key={lang}
                        onClick={() => handleLanguageSelect(lang)}
                        className={`text-left p-3 rounded-xl border transition ${selectedLanguage === lang ? 'border-black bg-gray-50' : 'border-transparent hover:bg-gray-50'}`}
                      >
                        <div className="font-semibold text-sm">{lang.split(' ')[0]}</div>
                        <div className="text-sm text-gray-500">{lang.split(' ')[1]?.replace(/[()]/g, '') || lang}</div>
                      </button>
                    ))}
                  </div>

                  <h3 className="text-xl font-bold mb-6">Choose a language and region</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {['Spanish (Spain)', 'German (Germany)', 'Italian (Italy)', 'Portuguese (Brazil)', 'Japanese (Japan)', 'Korean (South Korea)', 'Chinese (Simplified)', 'Arabic (UAE)'].map(lang => (
                      <button 
                        key={lang}
                        onClick={() => handleLanguageSelect(lang)}
                        className={`text-left p-3 rounded-xl border transition ${selectedLanguage === lang ? 'border-black bg-gray-50' : 'border-transparent hover:bg-gray-50'}`}
                      >
                        <div className="font-semibold text-sm">{lang.split(' ')[0]}</div>
                        <div className="text-sm text-gray-500">{lang.split(' ')[1]?.replace(/[()]/g, '') || lang}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {globeTab === 'currency' && (
                <div>
                  <h3 className="text-xl font-bold mb-6">Choose a currency</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
                      { code: 'USD', symbol: '$', name: 'United States Dollar' },
                      { code: 'EUR', symbol: '€', name: 'Euro' },
                      { code: 'GBP', symbol: '£', name: 'British Pound' },
                      { code: 'AUD', symbol: '$', name: 'Australian Dollar' },
                      { code: 'CAD', symbol: '$', name: 'Canadian Dollar' },
                      { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
                      { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' }
                    ].map(curr => (
                      <button 
                        key={curr.code}
                        onClick={() => handleCurrencySelect(`${curr.code} - ${curr.symbol}`)}
                        className={`text-left p-3 rounded-xl border transition ${selectedCurrency.includes(curr.code) ? 'border-black bg-gray-50' : 'border-transparent hover:bg-gray-50'}`}
                      >
                        <div className="font-semibold text-sm">{curr.name}</div>
                        <div className="text-sm text-gray-500">{curr.code} - {curr.symbol}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
