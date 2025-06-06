import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import toast from 'react-hot-toast';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import WeatherCard from '../components/WeatherCard';
import SearchHistory from '../components/SearchHistory';
import { getWeatherByCity, getWeatherByCoordinates } from '../services/weatherService';
import { addToSearchHistory, getSearchHistory } from '../services/searchHistoryService';
import { WeatherResponse, SearchHistoryItem } from '../types/weather';

const Weather: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [location, setLocation] = useState('');
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSearchHistory();
    
    // Check for URL query parameters
    const lat = searchParams.get('lat');
    const lon = searchParams.get('long') || searchParams.get('lon');
    
    if (lat && lon) {
      const latitude = parseFloat(lat);
      const longitude = parseFloat(lon);
      
      if (!isNaN(latitude) && !isNaN(longitude)) {
        fetchWeatherByCoordinates(latitude, longitude);
      } else {
        toast.error('Invalid coordinates provided in URL');
      }
    }
  }, [searchParams]);

  const fetchSearchHistory = async () => {
    try {
      const history = await getSearchHistory(5);
      setSearchHistory(history);
    } catch (error) {
      console.error('Error fetching search history:', error);
    }
  };

  const fetchWeatherByCoordinates = async (lat: number, lon: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const weatherData = await getWeatherByCoordinates(lat, lon);
      setWeather(weatherData);
      
      // Add to search history in Supabase
      await addToSearchHistory(weatherData.name);
      await fetchSearchHistory();
      
      toast.success(`Weather data for ${weatherData.name} loaded!`);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch weather data');
      toast.error(error instanceof Error ? error.message : 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!location.trim()) {
      toast.error('Please enter a location');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const weatherData = await getWeatherByCity(location.trim());
      setWeather(weatherData);
      
      // Add to search history in Supabase
      await addToSearchHistory(weatherData.name);
      await fetchSearchHistory();
      
      toast.success(`Weather data for ${weatherData.name} loaded!`);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch weather data');
      toast.error(error instanceof Error ? error.message : 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  const handleHistoryClick = async (location: string) => {
    setLocation(location);
    try {
      setLoading(true);
      setError(null);
      
      const weatherData = await getWeatherByCity(location);
      setWeather(weatherData);
      
      // Update search history in Supabase
      await addToSearchHistory(weatherData.name);
      await fetchSearchHistory();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch weather data');
      toast.error(error instanceof Error ? error.message : 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Weather Dashboard</h1>
        <p className="text-gray-600 mt-2">Check the current weather conditions in any location</p>
      </div>
      
      <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
        <div className="md:col-span-4">
          <Card className="h-full">
            <div className="p-4">
              <form onSubmit={handleSearch} className="mb-6">
                <h2 className="text-lg font-medium text-gray-800 mb-3">Search Location</h2>
                <div className="flex h-10">
                  <Input
                    placeholder="Enter city name..."
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="rounded-r-none h-11"
                  />
                  <Button 
                    type="submit" 
                    className="rounded-l-none h-11" 
                    isLoading={loading}
                    disabled={loading}
                  >
                    {!loading && <Search size={18} />}
                  </Button>
                </div>
              </form>
              
              <SearchHistory 
                searchHistory={searchHistory}
                onHistoryClick={handleHistoryClick}
              />
            </div>
          </Card>
        </div>
        
        <div className="md:col-span-8">
          {error ? (
            <Card className="p-6 text-center">
              <div className="text-red-600 mb-4">
                <Search size={48} className="mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Error</h3>
              <p className="text-gray-600">{error}</p>
            </Card>
          ) : weather ? (
            <WeatherCard weather={weather} />
          ) : (
            <Card className="p-8 text-center">
              <div className="text-blue-500 mb-4">
                <Search size={48} className="mx-auto" />
              </div>
              <h3 className="text-xl font-medium text-gray-800 mb-2">No Weather Data</h3>
              <p className="text-gray-600">
                Search for a location to see current weather conditions
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Weather;