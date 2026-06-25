import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ListingDetails from './pages/ListingDetails';
import Dashboard from './pages/Dashboard';
import HostDashboard from './pages/HostDashboard';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import NotFound from './pages/NotFound';
import HelpCenter from './pages/HelpCenter';
import Chatbot from './components/Chatbot';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-white">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login defaultRole="user" />} />
              <Route path="/signup" element={<Signup defaultRole="user" />} />
              <Route path="/host/login" element={<Login defaultRole="host" />} />
              <Route path="/host/signup" element={<Signup defaultRole="host" />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              <Route path="/listings/:id" element={<ListingDetails />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/host-dashboard" element={<HostDashboard />} />
              <Route path="/help" element={<HelpCenter />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
          <Chatbot />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
