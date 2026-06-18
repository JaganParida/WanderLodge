import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signup } = useAuth();

  // Password Validation Logic
  const getPasswordStrength = (pass) => {
    let strength = 0;
    if (pass.length >= 8) strength++;
    if (/[a-z]/.test(pass)) strength++;
    if (/[A-Z]/.test(pass)) strength++;
    if (/[0-9]/.test(pass)) strength++;
    if (/[^A-Za-z0-9]/.test(pass)) strength++;
    return strength; // 0 to 5
  };

  const strength = getPasswordStrength(password);
  
  const getStrengthLabel = () => {
    if (password.length === 0) return '';
    if (strength <= 2) return <span className="text-red-500">Weak</span>;
    if (strength <= 4) return <span className="text-yellow-500">Fair</span>;
    return <span className="text-green-500">Strong</span>;
  };

  const getStrengthBarColor = () => {
    if (password.length === 0) return 'bg-gray-200';
    if (strength <= 2) return 'bg-red-500';
    if (strength <= 4) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const data = await signup(username, email, password, role);
      
      // Redirect based on role
      if (data.user.role === 'host') {
        navigate('/host-dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center py-20 px-4">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Sign up for WanderLodge</h2>
        
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">{error}</div>}
        
        <form onSubmit={handleSignup} className="space-y-4">
          
          {/* Role Selector */}
          <div className="flex gap-4 mb-6">
            <label className={`flex-1 flex flex-col items-center justify-center p-4 border rounded-xl cursor-pointer transition ${role === 'user' ? 'border-airbnb bg-red-50 text-airbnb' : 'border-gray-200 hover:border-gray-300'}`}>
              <input type="radio" name="role" value="user" className="hidden" checked={role === 'user'} onChange={(e) => setRole(e.target.value)} />
              <span className="font-semibold">Traveler</span>
              <span className="text-xs text-gray-500 mt-1">I want to book stays</span>
            </label>
            <label className={`flex-1 flex flex-col items-center justify-center p-4 border rounded-xl cursor-pointer transition ${role === 'host' ? 'border-airbnb bg-red-50 text-airbnb' : 'border-gray-200 hover:border-gray-300'}`}>
              <input type="radio" name="role" value="host" className="hidden" checked={role === 'host'} onChange={(e) => setRole(e.target.value)} />
              <span className="font-semibold">Host</span>
              <span className="text-xs text-gray-500 mt-1">I want to rent my space</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-airbnb focus:ring-1 focus:ring-airbnb"
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-airbnb focus:ring-1 focus:ring-airbnb"
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:border-airbnb focus:ring-1 focus:ring-airbnb transition"
                required 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            
            {/* Password Strength Meter */}
            {password.length > 0 && (
              <div className="mt-3">
                <div className="flex justify-between items-center mb-1 text-xs font-semibold">
                  <span>Password strength:</span>
                  {getStrengthLabel()}
                </div>
                <div className="flex gap-1 h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                   <div className={`h-full transition-all duration-300 ${getStrengthBarColor()}`} style={{ width: `${(strength / 5) * 100}%` }}></div>
                </div>
                <div className="text-xs text-gray-500 mt-2 space-y-1">
                  <div className="flex items-center gap-1">
                    {password.length >= 8 ? <CheckCircle2 size={12} className="text-green-500" /> : <XCircle size={12} className="text-gray-300" />} <span>At least 8 characters</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {/[A-Z]/.test(password) ? <CheckCircle2 size={12} className="text-green-500" /> : <XCircle size={12} className="text-gray-300" />} <span>One uppercase letter</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {/[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password) ? <CheckCircle2 size={12} className="text-green-500" /> : <XCircle size={12} className="text-gray-300" />} <span>One number & symbol</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <button 
            type="submit" 
            disabled={(password.length > 0 && strength < 3) || isLoading}
            className="w-full flex justify-center items-center gap-2 bg-airbnb text-white font-bold py-3 rounded-lg hover:bg-airbnb-dark transition mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading && <Loader2 size={18} className="animate-spin" />}
            {isLoading ? 'Creating account...' : 'Agree and continue'}
          </button>
        </form>
        


        <div className="mt-6 text-center text-sm text-gray-600">
          Already have an account? <Link to="/login" className="font-semibold text-black hover:underline">Log in</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
