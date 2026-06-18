import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = ({ defaultRole = 'user' }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(username, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center py-20 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6">
          {defaultRole === 'host' ? 'Log in to Host Dashboard' : 'Log in to WanderLodge'}
        </h2>
        
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">{error}</div>}
        
        <form onSubmit={handleLogin} className="space-y-4">
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
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-semibold text-gray-700">Password</label>
              <Link to="/forgot-password" className="text-xs font-semibold text-airbnb hover:underline">Forgot password?</Link>
            </div>
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
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full flex justify-center items-center gap-2 bg-airbnb text-white font-bold py-3 rounded-lg hover:bg-airbnb-dark transition disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading && <Loader2 size={18} className="animate-spin" />}
            {isLoading ? 'Logging in...' : 'Continue'}
          </button>
        </form>
        
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600 font-medium">Don't have an account? <Link to={defaultRole === 'host' ? '/host/signup' : '/signup'} className="text-airbnb font-bold hover:underline">Sign up</Link></p>
        </div>
        

      </div>
    </div>
  );
};

export default Login;
