import { X } from 'lucide-react';
import { Link } from 'react-router-dom';

const LoginModal = ({ isOpen, onClose, message = "Log in to continue" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
            <X size={20} className="text-gray-900" />
          </button>
          <h3 className="font-bold text-gray-900 absolute left-1/2 -translate-x-1/2">Log in or sign up</h3>
          <div className="w-9"></div> {/* Spacer for centering */}
        </div>
        
        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-6">{message}</h2>
          
          <div className="space-y-4">
            <Link 
              to="/login" 
              className="w-full flex justify-center items-center py-3.5 bg-airbnb text-white font-bold rounded-lg hover:bg-airbnb-dark transition"
            >
              Log in
            </Link>
            
            <Link 
              to="/signup" 
              className="w-full flex justify-center items-center py-3.5 bg-white border-2 border-black text-black font-bold rounded-lg hover:bg-gray-50 transition"
            >
              Sign up
            </Link>
          </div>
          
          <p className="text-xs text-gray-500 mt-6 text-center">
            By proceeding, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
