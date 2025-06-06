import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { CloudSun, User, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Failed to log out');
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="fixed w-full top-0 bg-white shadow-md z-10">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to={user ? '/weather' : '/login'} className="flex items-center space-x-2 text-blue-600">
          <CloudSun size={24} />
          <span className="font-semibold text-lg">WeatherNow</span>
        </Link>
        
        {user ? (
          <div className="flex items-center space-x-4">
            <Link 
              to="/profile" 
              className="text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-1"
            >
              <User size={18} />
              <span className="hidden sm:inline">Profile</span>
            </Link>
            <button
              onClick={handleSignOut}
              className="text-gray-600 hover:text-red-500 transition-colors flex items-center gap-1"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <Link 
              to="/login" 
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;