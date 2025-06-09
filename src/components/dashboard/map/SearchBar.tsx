import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, History, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { junctions } from '@/data/trafficData';
import { Badge } from '@/components/ui/badge';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onLocationSelect: (lat: number, lng: number, name: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onLocationSelect }) => {
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<Array<{ id: number; name: string; lat: number; lng: number; congestion: string }>>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Filter junctions based on search query with improved matching
  const filterLocations = (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }
    
    // Split query into words for better matching
    const queryWords = searchQuery.toLowerCase().split(/\s+/);
    
    // Score-based filtering to prioritize better matches
    const scoredResults = junctions.map(junction => {
      const name = junction.name.toLowerCase();
      let score = 0;
      
      // Exact match gets highest score
      if (name === searchQuery.toLowerCase()) {
        score = 100;
      } else if (name.startsWith(searchQuery.toLowerCase())) {
        score = 75; // Starting with query gets high score
      } else {
        // Calculate how many of the query words match
        queryWords.forEach(word => {
          if (name.includes(word)) {
            score += 15; // Each matching word increases score
            if (name.startsWith(word)) score += 5; // Bonus for starting with word
          }
        });
        
        // Specific areas of Hyderabad get a small boost
        if (name.includes('hyderabad')) {
          score += 10;
        }
      }
      
      return { ...junction, score };
    })
    .filter(item => item.score > 0) // Only include items with a match
    .sort((a, b) => b.score - a.score) // Sort by score descending
    .slice(0, 8); // Limit to top 8 results for better UI
    
    setResults(scoredResults);
  };

  // Handle search submission
  const handleSearch = () => {
    // Only perform search if query has content
    if (query.trim()) {
      onSearch(query);
      // Keep showing results after search to allow selection
      setShowResults(true);
      
      // Update search history (avoid duplicates and limit to last 5)
      setSearchHistory(prev => {
        const newHistory = [query, ...prev.filter(h => h !== query)].slice(0, 5);
        localStorage.setItem('trafficMapSearchHistory', JSON.stringify(newHistory));
        return newHistory;
      });
      
      // If there's exactly one result, automatically select it
      if (results.length === 1) {
        const result = results[0];
        handleLocationSelect(result.lat, result.lng, result.name);
      }
    }
  };

  // Handle location selection from results
  const handleLocationSelect = (lat: number, lng: number, name: string) => {
    onLocationSelect(lat, lng, name);
    setQuery(name);
    setShowResults(false);
    setShowHistory(false);
    
    // Update search history
    setSearchHistory(prev => {
      const newHistory = [name, ...prev.filter(h => h !== name)].slice(0, 5);
      localStorage.setItem('trafficMapSearchHistory', JSON.stringify(newHistory));
      return newHistory;
    });
  };
  
  // Handle selecting from history
  const handleHistorySelect = (historyItem: string) => {
    setQuery(historyItem);
    setShowHistory(false);
    onSearch(historyItem);
    
    // Find matching junction
    const matchingJunction = junctions.find(
      junction => junction.name.toLowerCase() === historyItem.toLowerCase()
    );
    
    if (matchingJunction) {
      handleLocationSelect(
        matchingJunction.lat, 
        matchingJunction.lng, 
        matchingJunction.name
      );
    }
  };

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
        setShowHistory(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Load search history on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('trafficMapSearchHistory');
    if (savedHistory) {
      try {
        setSearchHistory(JSON.parse(savedHistory));
      } catch (e) {
        // If parsing fails, reset history
        setSearchHistory([]);
      }
    }
  }, []);

  // Update results when query changes
  useEffect(() => {
    filterLocations(query);
    setShowResults(query.length > 0);
  }, [query]);

  return (
    <div className="relative w-full" ref={searchRef}>
      <div className="flex items-center w-full bg-white border rounded-md shadow-sm">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search for locations in Hyderabad..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-4 py-2 rounded-l-md focus:outline-none pr-10"
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            onFocus={() => searchHistory.length > 0 && setShowHistory(true)}
          />
          {query && (
            <button 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={() => setQuery('')}
            >
              ×
            </button>
          )}
        </div>
        {searchHistory.length > 0 && (
          <button
            className="px-2 text-gray-500 hover:text-gray-700"
            onClick={() => setShowHistory(!showHistory)}
            title="Search History"
          >
            <History size={16} />
          </button>
        )}
        <Button 
          onClick={handleSearch} 
          className="rounded-l-none h-full px-4"
          variant="default"
        >
          <Search size={18} />
        </Button>
      </div>

      {/* Search History Dropdown */}
      {showHistory && searchHistory.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
          <div className="px-3 py-2 border-b text-xs font-medium text-gray-500">Recent searches</div>
          {searchHistory.map((item, index) => (
            <div
              key={index}
              className="px-4 py-2 hover:bg-slate-100 cursor-pointer flex items-center"
              onClick={() => handleHistorySelect(item)}
            >
              <History size={14} className="mr-2 text-slate-400" />
              <div className="flex-grow text-sm">{item}</div>
              <ArrowRight size={14} className="text-slate-400" />
            </div>
          ))}
        </div>
      )}
      
      {/* Search Results Dropdown with enhanced UI */}
      {showResults && results.length > 0 && !showHistory && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
          {results.map((result) => (
            <div
              key={result.id}
              className="px-4 py-2 hover:bg-slate-100 cursor-pointer flex items-center"
              onClick={() => handleLocationSelect(result.lat, result.lng, result.name)}
            >
              <MapPin size={16} className="mr-2 text-slate-500" />
              <div className="flex-grow">
                <div className="font-medium">{result.name}</div>
                <div className="text-xs text-slate-500">
                  Hyderabad, India
                </div>
              </div>
              <Badge className={
                result.congestion === 'high' ? 'bg-red-500' : 
                result.congestion === 'medium' ? 'bg-orange-500' : 
                'bg-green-500'
              }>
                {result.congestion.charAt(0).toUpperCase() + result.congestion.slice(1)}
              </Badge>
            </div>
          ))}
        </div>
      )}
      
      {/* No Results Message */}
      {showResults && query.trim() && results.length === 0 && !showHistory && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg py-3 px-4 text-center">
          <p className="text-slate-500">No locations found matching '{query}'</p>
          <p className="text-xs text-slate-400 mt-1">Try searching for an area or locality in Hyderabad</p>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
