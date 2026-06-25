import { Link } from 'react-router-dom';
import { Home, Search, Map } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="mb-8">
        <h1 className="text-9xl font-black text-gray-200">404</h1>
      </div>
      
      <h2 className="text-3xl font-bold text-gray-900 mb-4">
        We can't seem to find the page you're looking for.
      </h2>
      
      <p className="text-gray-500 mb-8 max-w-md mx-auto text-lg">
        The link you followed might be broken, or the page may have been moved or deleted.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md mx-auto">
        <Link 
          to="/" 
          className="flex-1 flex items-center justify-center gap-2 bg-airbnb text-white font-bold py-3.5 px-6 rounded-xl hover:bg-airbnb-dark transition shadow-md hover:shadow-lg active:scale-95"
        >
          <Home className="w-5 h-5" />
          Back to Home
        </Link>
        <Link 
          to="/help" 
          className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 font-bold py-3.5 px-6 rounded-xl hover:bg-gray-200 transition shadow-sm hover:shadow active:scale-95"
        >
          <Search className="w-5 h-5" />
          Help Center
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
