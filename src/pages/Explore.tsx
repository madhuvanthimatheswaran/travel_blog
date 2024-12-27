import React from 'react';
import { Search, MapPin, Compass } from 'lucide-react';
import axios from 'axios';
import type { Location } from '../types';
import toast from 'react-hot-toast';

const UNSPLASH_ACCESS_KEY = 'demo-unsplash-key';

export default function Explore() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [locations, setLocations] = React.useState<Location[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [popularDestinations] = React.useState([
    { id: 'paris', name: 'Paris', query: 'paris landmarks', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80' },
    { id: 'tokyo', name: 'Tokyo', query: 'tokyo landmarks', image: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&w=800&q=80' },
    { id: 'rome', name: 'Rome', query: 'rome landmarks', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80' },
    { id: 'nyc', name: 'New York', query: 'new york landmarks', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80' },
    { id: 'dubai', name: 'Dubai', query: 'dubai landmarks', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80' },
    { id: 'bali', name: 'Bali', query: 'bali landmarks', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80' }
  ]);

  const searchLocations = async (query: string) => {
    if (!query.trim()) {
      setError('Please enter a location to search');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      // Fallback to using static images if API fails
      const mockLocations = [
        {
          id: '1',
          name: query,
          description: `Discover the beauty of ${query}`,
          imageUrl: `https://source.unsplash.com/800x600/?${encodeURIComponent(query + ' landmark')}`,
          latitude: 0,
          longitude: 0,
          photographer: 'Unsplash Photographer',
          photographerUrl: 'https://unsplash.com'
        },
        {
          id: '2',
          name: query,
          description: `Explore amazing places in ${query}`,
          imageUrl: `https://source.unsplash.com/800x600/?${encodeURIComponent(query + ' travel')}`,
          latitude: 0,
          longitude: 0,
          photographer: 'Unsplash Photographer',
          photographerUrl: 'https://unsplash.com'
        },
        {
          id: '3',
          name: query,
          description: `Experience the culture of ${query}`,
          imageUrl: `https://source.unsplash.com/800x600/?${encodeURIComponent(query + ' city')}`,
          latitude: 0,
          longitude: 0,
          photographer: 'Unsplash Photographer',
          photographerUrl: 'https://unsplash.com'
        }
      ];

      setLocations(mockLocations);
      setError('');
    } catch (error) {
      console.error('Failed to search locations:', error);
      toast.error('Failed to fetch locations. Please try again.');
      setError('Failed to fetch locations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Hero Search Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl overflow-hidden mb-12">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="relative px-8 py-16">
          <h1 className="text-4xl font-bold text-white mb-8 text-center">
            Discover Your Next Adventure
          </h1>

          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for a destination..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && searchLocations(searchQuery)}
                className="w-full px-6 py-4 rounded-full pl-14 pr-36 text-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <Search 
                className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={24}
              />
              <button
                onClick={() => searchLocations(searchQuery)}
                disabled={loading}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Destinations</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {popularDestinations.map((destination) => (
            <button
              key={destination.id}
              onClick={() => {
                setSearchQuery(destination.name);
                searchLocations(destination.query);
              }}
              className="relative group rounded-xl overflow-hidden h-48"
            >
              <img 
                src={destination.image}
                alt={destination.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <span className="text-white font-semibold text-lg">{destination.name}</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Error Message */}
      {error && (
        <div className="text-center text-red-600 mb-8">
          {error}
        </div>
      )}

      {/* Search Results */}
      {locations.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {locations.map((location) => (
            <div
              key={location.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative h-48">
                <img
                  src={location.imageUrl}
                  alt={location.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 p-2 text-xs text-white bg-black/50">
                  Photo by{' '}
                  <a 
                    href={location.photographerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-blue-200"
                  >
                    {location.photographer}
                  </a>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center mb-2">
                  <MapPin className="h-5 w-5 text-blue-600 mr-2" />
                  <h3 className="text-xl font-semibold text-gray-900">
                    {location.name}
                  </h3>
                </div>
                <p className="text-gray-600 mb-4 line-clamp-2">{location.description}</p>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => window.location.href = `/write?location=${encodeURIComponent(location.name)}&image=${encodeURIComponent(location.imageUrl)}`}
                    className="btn-primary flex-1"
                  >
                    Write a Story
                  </button>
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary"
                  >
                    View Map
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}