import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { translate } from '../utils/i18n';
import { formatCurrency as formatCcy } from '../utils/currency';

const AuthContext = createContext(null);

// Configure axios to always send cookies
axios.defaults.withCredentials = true;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [globalLanguage, setGlobalLanguage] = useState(localStorage.getItem('wanderLodgeLang') || 'English (US)');
  const [globalCurrency, setGlobalCurrency] = useState(localStorage.getItem('wanderLodgeCurr') || 'INR - ₹');

  // On app mount, check if we have a valid session via httpOnly cookie
  useEffect(() => {
    checkAuth();
  }, []);

  const triggerGoogleTranslate = (language) => {
    const langMap = {
      'English (US)': 'en',
      'English (UK)': 'en',
      'Hindi (India)': 'hi',
      'French (France)': 'fr',
      'Spanish (Spain)': 'es',
      'German (Germany)': 'de',
      'Italian (Italy)': 'it',
      'Portuguese (Brazil)': 'pt',
      'Japanese (Japan)': 'ja',
      'Korean (South Korea)': 'ko',
      'Chinese (Simplified)': 'zh-CN',
      'Arabic (UAE)': 'ar'
    };
    const targetCode = langMap[language] || 'en';
    
    // Check current translation state
    const match = document.cookie.match(/googtrans=\/en\/([^;]+)/);
    const currentCode = match ? match[1] : 'en';

    if (currentCode !== targetCode) {
      // First, systematically CLEAR all possible variations of the old cookie
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}`;
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname}`;

      // Then, set the new cookie (only if not English, since English is default)
      if (targetCode !== 'en') {
         document.cookie = `googtrans=/en/${targetCode}; path=/;`;
      }
      
      // Auto-refresh to ensure pristine translation application without glitching
      window.location.reload();
    }
  };

  useEffect(() => {
    localStorage.setItem('wanderLodgeLang', globalLanguage);
    localStorage.setItem('wanderLodgeCurr', globalCurrency);
    
    // Trigger full page translation
    triggerGoogleTranslate(globalLanguage);
  }, [globalLanguage, globalCurrency]);

  const checkAuth = async () => {
    try {
      const res = await axios.get('/api/auth/me');
      setUser(res.data.user);
      if (res.data.user.language) setGlobalLanguage(res.data.user.language);
      if (res.data.user.currency) setGlobalCurrency(res.data.user.currency);
    } catch (err) {
      // No valid cookie / not logged in
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    const res = await axios.post('/api/auth/login', { username, password });
    setUser(res.data.user);
    return res.data;
  };

  const signup = async (username, email, password, role) => {
    const res = await axios.post('/api/auth/signup', { username, email, password, role });
    setUser(res.data.user);
    return res.data;
  };

  const logout = async () => {
    try {
      await axios.get('/api/auth/logout');
    } catch (e) {}
    setUser(null);
  };

  const updateUserPreferences = async (language, currency) => {
    setGlobalLanguage(language);
    setGlobalCurrency(currency);
    if (user) {
      try {
        const res = await axios.put('/api/auth/preferences', { language, currency });
        setUser(prev => ({ ...prev, language: res.data.language, currency: res.data.currency }));
      } catch (err) {
        console.error("Failed to update preferences", err);
      }
    }
  };

  const t = useCallback((key) => translate(key, globalLanguage), [globalLanguage]);
  const formatPrice = useCallback((price) => formatCcy(price, globalCurrency), [globalCurrency]);

  const isLoggedIn = !!user;
  const isHost = user?.role === 'host' || user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ 
      user, isLoggedIn, isHost, loading, login, signup, logout, checkAuth, 
      updateUserPreferences, globalLanguage, globalCurrency, setGlobalLanguage, setGlobalCurrency, t, formatPrice 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export default AuthContext;
