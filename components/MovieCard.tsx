import React, { useState } from 'react';
import { Movie } from '../types';
import { Star } from 'lucide-react';

interface MovieCardProps {
  movie: Movie;
  onClick?: () => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onClick }) => {
  const [imageError, setImageError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Fallback image if the URL fails or is empty
  const displayImage = imageError || !movie.poster_url 
    ? "https://placehold.co/300x450/1f2937/white?text=No+Poster" 
    : movie.poster_url;

  return (
    <div 
      onClick={onClick}
      className={`group relative bg-gray-900 rounded-xl overflow-hidden shadow-lg transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-900/20 ${onClick ? 'cursor-pointer' : ''}`}
    >
      {/* Image Container with Aspect Ratio */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-gray-800">
        
        {/* Placeholder / Blur Effect */}
        <div className={`absolute inset-0 bg-gray-800 transition-opacity duration-700 ${isLoaded ? 'opacity-0' : 'opacity-100'} z-10`} />
        
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <FilmIconPlaceholder />
          </div>
        )}

        <img
          src={displayImage}
          alt={movie.name}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          onError={() => {
            setImageError(true);
            setIsLoaded(true);
          }}
          className={`h-full w-full object-cover transition-all duration-700 ${
            isLoaded ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-105 blur-lg'
          } group-hover:scale-105`}
        />
        
        {/* Gradient Overlay (Visible on Hover) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 z-30">
          <p className="text-gray-300 text-sm line-clamp-3 mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
            {movie.details || "No details available."}
          </p>
          <div className="mt-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">Click to view details & reviews</div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex justify-between items-start gap-2 mb-1">
          <h3 className="font-bold text-lg leading-tight text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
            {movie.name}
          </h3>
          <div className="flex items-center gap-1 bg-gray-800 px-1.5 py-0.5 rounded text-yellow-400 shrink-0">
            <Star className="w-3 h-3 fill-current" />
            <span className="text-xs font-bold">{movie.popularity_score}</span>
          </div>
        </div>
        <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-400 font-medium px-2 py-1 bg-gray-800 rounded-md uppercase tracking-wider truncate">
              {movie.genre || "Unknown"}
            </span>
        </div>
      </div>
    </div>
  );
};

const FilmIconPlaceholder = () => (
  <svg className="w-12 h-12 text-gray-700 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
  </svg>
);

export default MovieCard;
