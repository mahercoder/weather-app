import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getSearchHistory } from '../services/searchHistoryService';
import { SearchHistoryItem } from '../types/weather';
import Card, { CardContent, CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { User, Clock, CloudSun } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Profile: React.FC = () => {
  const { user, signOut } = useAuth();
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSearchHistory = async () => {
      try {
        const history = await getSearchHistory(10);
        setSearchHistory(history);
      } catch (error) {
        console.error('Error fetching search history:', error);
        toast.error('Failed to load search history');
      } finally {
        setLoading(false);
      }
    };

    fetchSearchHistory();
  }, []);

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
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Your Profile</h1>
        <p className="text-gray-600 mt-2">View and manage your account</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <User size={20} className="text-blue-500" />
              <h2 className="text-xl font-semibold text-gray-800">Account Information</h2>
            </div>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-blue-50 rounded-lg mb-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-700">Email Address</p>
                <p className="text-gray-600">{user?.email}</p>
              </div>
              <CloudSun size={32} className="text-blue-400" />
            </div>
            
            <Button 
              onClick={handleSignOut} 
              variant="outline" 
              className="mt-4 w-full text-red-600 hover:bg-red-50 hover:border-red-300"
            >
              Sign Out
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Clock size={20} className="text-blue-500" />
              <h2 className="text-xl font-semibold text-gray-800">Recent Searches</h2>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                <p className="text-gray-600">Loading your search history...</p>
              </div>
            ) : searchHistory.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>You haven't searched for any locations yet.</p>
                <Button 
                  onClick={() => navigate('/weather')} 
                  className="mt-4"
                >
                  Start Searching
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {searchHistory.map((item) => (
                  <div key={item.id} className="p-3 bg-gray-50 rounded-lg flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-800">{item.location}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(item.created_at).toLocaleString()}
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      className="text-xs px-3 py-1"
                      onClick={() => {
                        navigate('/weather');
                        // We'll pass the location through state, but we'd need to update the Weather component to use it
                        // This is just showing how we could enhance the app in the future
                      }}
                    >
                      View
                    </Button>
                  </div>
                ))}
                
                <div className="text-center mt-4">
                  <Button 
                    onClick={() => navigate('/weather')} 
                    variant="secondary"
                    className="mt-2"
                  >
                    Go to Weather
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;