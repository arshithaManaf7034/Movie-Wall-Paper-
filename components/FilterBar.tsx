import React from 'react';
import { Search, Filter, ArrowUpDown } from 'lucide-react';
import { MovieFilters } from '../types';

interface FilterBarProps {
  filters: MovieFilters;
  onFilterChange: (newFilters: MovieFilters) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ filters, onFilterChange }) => {
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, search: e.target.value });
  };

  const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filters, genre: e.target.value });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filters, sortBy: e.target.value as any });
  };

  return (
    <div className="w-full bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-4 mb-8 flex flex-col md:flex-row gap-4 items-center shadow-lg">
      {/* Search */}
      <div className="relative flex-grow w-full md:w-auto">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-500" />
        </div>
        <input
          type="text"
          placeholder="Search movies..."
          value={filters.search}
          onChange={handleSearchChange}
          className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-lg leading-5 bg-gray-950 text-gray-300 placeholder-gray-500 focus:outline-none focus:bg-gray-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 sm:text-sm transition-all"
        />
      </div>

      {/* Filters Wrapper */}
      <div className="flex w-full md:w-auto gap-4">
        {/* Genre */}
        <div className="relative flex-1 md:flex-none md:w-48">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Filter className="h-4 w-4 text-gray-500" />
          </div>
          <select
            value={filters.genre}
            onChange={handleGenreChange}
            className="block w-full pl-10 pr-10 py-2 border border-gray-700 rounded-lg leading-5 bg-gray-950 text-gray-300 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm appearance-none transition-all cursor-pointer"
          >
            <option value="All">All Genres</option>
            <option value="Drama">Drama</option>
            <option value="Thriller">Thriller</option>
            <option value="Comedy">Comedy</option>
            <option value="Action">Action</option>
            <option value="Romance">Romance</option>
            <option value="Sci-Fi">Sci-Fi</option>
          </select>
        </div>

        {/* Sort */}
        <div className="relative flex-1 md:flex-none md:w-48">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <ArrowUpDown className="h-4 w-4 text-gray-500" />
          </div>
          <select
            value={filters.sortBy}
            onChange={handleSortChange}
            className="block w-full pl-10 pr-10 py-2 border border-gray-700 rounded-lg leading-5 bg-gray-950 text-gray-300 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm appearance-none transition-all cursor-pointer"
          >
            <option value="popularity_desc">Popularity: High to Low</option>
            <option value="popularity_asc">Popularity: Low to High</option>
            <option value="newest">Newest First</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
