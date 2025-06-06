import React from 'react';
import { CloudSun } from 'lucide-react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white">
      <div className="text-blue-600 animate-pulse">
        <CloudSun size={48} />
      </div>
      <h1 className="mt-4 text-xl font-medium text-gray-700">Loading WeatherNow</h1>
      <div className="mt-4 w-16 h-1 bg-blue-200 rounded-full overflow-hidden">
        <div className="h-full bg-blue-600 animate-[loading_1.5s_ease-in-out_infinite]"></div>
      </div>
    </div>
  );
};

export default LoadingScreen;