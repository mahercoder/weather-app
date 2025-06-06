import React from 'react';
import { Clock, Search } from 'lucide-react';
import { SearchHistoryItem } from '../types/weather';

interface SearchHistoryProps {
  searchHistory: SearchHistoryItem[];
  onHistoryClick: (location: string) => void;
}

const SearchHistory: React.FC<SearchHistoryProps> = ({ searchHistory, onHistoryClick }) => {
  if (searchHistory.length === 0) {
    return (
      <div className="mt-4">
        <h2 className="text-lg font-medium text-gray-800 mb-2">Recent Searches</h2>
        <div className="text-center py-4 text-gray-500">
          <Clock size={24} className="mx-auto mb-2 text-gray-400" />
          <p>No recent searches</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <h2 className="text-lg font-medium text-gray-800 mb-2">Recent Searches</h2>
      <ul className="space-y-2">
        {searchHistory.map((item) => (
          <li key={item.id}>
            <button
              onClick={() => onHistoryClick(item.location)}
              className="w-full flex items-center p-2 hover:bg-gray-50 rounded-md transition-colors group"
            >
              <Search size={16} className="text-gray-400 group-hover:text-blue-500" />
              <span className="ml-2 text-gray-700 group-hover:text-blue-700">{item.location}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchHistory;