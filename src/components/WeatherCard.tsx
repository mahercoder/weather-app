import React from 'react';
import { Cloud, CloudRain, Sun, Wind, Droplet, Thermometer } from 'lucide-react';
import Card, { CardContent, CardHeader } from './ui/Card';
import { WeatherResponse } from '../types/weather';
import { getWeatherIcon, formatTemperature, formatDate, getWeatherConditionColor } from '../services/weatherService';

interface WeatherCardProps {
  weather: WeatherResponse;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ weather }) => {
  const weatherCondition = weather.weather[0].main;
  const conditionColor = getWeatherConditionColor(weatherCondition);

  // Select the appropriate weather icon based on condition
  const getIconComponent = () => {
    switch (weatherCondition.toLowerCase()) {
      case 'clear':
        return <Sun size={40} className="text-yellow-500" />;
      case 'clouds':
        return <Cloud size={40} className="text-gray-500" />;
      case 'rain':
      case 'drizzle':
        return <CloudRain size={40} className="text-blue-500" />;
      default:
        return <Cloud size={40} className="text-gray-500" />;
    }
  };

  return (
    <Card className="overflow-hidden transition-shadow duration-300 hover:shadow-lg">
      <CardHeader className="p-0">
        <div className={`p-6 ${weatherCondition.toLowerCase() === 'clear' ? 'bg-gradient-to-r from-yellow-400 to-orange-300' : weatherCondition.toLowerCase() === 'clouds' ? 'bg-gradient-to-r from-gray-300 to-gray-200' : 'bg-gradient-to-r from-blue-400 to-blue-300'}`}>
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white">{weather.name}, {weather.sys.country}</h2>
              <p className="text-white/90 text-sm">{formatDate(weather.dt)}</p>
            </div>
            <div className="flex items-center">
              {getIconComponent()}
              <img 
                src={getWeatherIcon(weather.weather[0].icon)} 
                alt={weather.weather[0].description}
                className="w-16 h-16" 
              />
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 mb-2">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-end">
                  <span className="text-5xl font-bold text-gray-800">
                    {formatTemperature(weather.main.temp)}
                  </span>
                  <span className="text-lg text-gray-600 ml-2 mb-1">
                    feels like {formatTemperature(weather.main.feels_like)}
                  </span>
                </div>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${conditionColor}`}>
                  {weather.weather[0].description}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
            <Thermometer size={18} className="text-red-500" />
            <div>
              <p className="text-sm text-gray-500">Min / Max</p>
              <p className="font-medium">
                {formatTemperature(weather.main.temp_min)} / {formatTemperature(weather.main.temp_max)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
            <Wind size={18} className="text-blue-500" />
            <div>
              <p className="text-sm text-gray-500">Wind</p>
              <p className="font-medium">{weather.wind.speed} m/s</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
            <Droplet size={18} className="text-blue-400" />
            <div>
              <p className="text-sm text-gray-500">Humidity</p>
              <p className="font-medium">{weather.main.humidity}%</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
            <Cloud size={18} className="text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Clouds</p>
              <p className="font-medium">{weather.clouds.all}%</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherCard;