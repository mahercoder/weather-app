import { WeatherResponse } from '../types/weather';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY as string;
const API_BASE_URL = 'https://api.openweathermap.org';

interface GeoLocation {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

const getCoordinates = async (city: string): Promise<GeoLocation> => {
  const response = await fetch(
    `${API_BASE_URL}/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${API_KEY}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch location coordinates. Please try again.');
  }

  const data = await response.json();
  
  if (!data.length) {
    throw new Error('Location not found. Please check the city name and try again.');
  }

  return data[0];
};

export const getWeatherByCity = async (city: string): Promise<WeatherResponse> => {
  if (!API_KEY) {
    throw new Error('OpenWeatherMap API key is not set. Please add it to your .env file as VITE_OPENWEATHER_API_KEY.');
  }

  try {
    // First get coordinates for the city
    const location = await getCoordinates(city);

    // Then fetch weather data using coordinates
    const response = await fetch(
      `${API_BASE_URL}/data/3.0/onecall?lat=${location.lat}&lon=${location.lon}&exclude=minutely,hourly,daily,alerts&units=metric&appid=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch weather data. Please try again.');
    }

    const data = await response.json();

    // Transform the response to match our WeatherResponse type
    return {
      coord: {
        lon: location.lon,
        lat: location.lat
      },
      weather: [{
        id: data.current.weather[0].id,
        main: data.current.weather[0].main,
        description: data.current.weather[0].description,
        icon: data.current.weather[0].icon
      }],
      base: 'stations',
      main: {
        temp: data.current.temp,
        feels_like: data.current.feels_like,
        temp_min: data.current.temp, // OneCall API doesn't provide min/max
        temp_max: data.current.temp, // OneCall API doesn't provide min/max
        pressure: data.current.pressure,
        humidity: data.current.humidity
      },
      visibility: data.current.visibility,
      wind: {
        speed: data.current.wind_speed,
        deg: data.current.wind_deg
      },
      clouds: {
        all: data.current.clouds
      },
      dt: data.current.dt,
      sys: {
        type: 1,
        id: 1,
        country: location.country,
        sunrise: data.current.sunrise,
        sunset: data.current.sunset
      },
      timezone: data.timezone_offset,
      id: 0, // Not available in OneCall API
      name: location.name,
      cod: 200
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred. Please try again.');
  }
};

export const getWeatherIcon = (iconCode: string): string => {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
};

export const formatTemperature = (temp: number): string => {
  return `${Math.round(temp)}°C`;
};

export const formatDate = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getWeatherConditionColor = (condition: string): string => {
  switch (condition.toLowerCase()) {
    case 'clear':
      return 'bg-yellow-100 text-yellow-800';
    case 'clouds':
      return 'bg-gray-100 text-gray-800';
    case 'rain':
    case 'drizzle':
      return 'bg-blue-100 text-blue-800';
    case 'thunderstorm':
      return 'bg-purple-100 text-purple-800';
    case 'snow':
      return 'bg-indigo-100 text-indigo-800';
    case 'mist':
    case 'fog':
    case 'haze':
      return 'bg-gray-200 text-gray-800';
    default:
      return 'bg-blue-100 text-blue-800';
  }
};