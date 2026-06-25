import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Eye, EyeOff, Lock, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);
    setMessage('');
    setError('');
    
    try {
      const res = await axios.post(`http://localhost:8080/api/auth/reset-password/${token}`, { password });
      setMessage(res.data.message);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reset password. Link may be expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex justify-center items-center py-12 px-4 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-airbnb/10 rounded-full flex items-center justify-center">
            <Lock className="w-8 h-8 text-airbnb" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Create New Password</h2>
        
        {message && (
          <div className="bg-green-50 text-green-700 p-4 rounded-xl mb-6 flex items-start gap-3 border border-green-100">
            <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0" />
            <p className="text-sm font-medium">{message} Redirecting...</p>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 flex items-start gap-3 border border-red-100">
            <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3.5 pr-10 border border-gray-200 rounded-xl focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition bg-gray-50/50"
                placeholder="Enter new password"
                required 
                minLength={8}
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-700 transition"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">Must be at least 8 characters long</p>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm New Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3.5 border border-gray-200 rounded-xl focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition bg-gray-50/50"
                placeholder="Confirm new password"
                required 
              />
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-airbnb text-white font-bold py-3.5 rounded-xl hover:bg-airbnb-dark transition flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:scale-[0.98]"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Resetting...
              </span>
            ) : 'Reset Password'}
          </button>
        </form>
        
        <div className="text-center mt-8">
          <Link to="/login" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-black transition">
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
