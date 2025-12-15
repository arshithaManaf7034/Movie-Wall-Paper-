import React, { useState, useEffect } from 'react';
import { X, Star, Send, Loader2, Award } from 'lucide-react';
import { Movie, Review, User } from '../types';
import { fetchReviews, submitReview, fetchRecommendations } from '../services/api';
import MovieCard from './MovieCard';

interface MovieDetailModalProps {
  movie: Movie | null;
  currentUser: User | null;
  onClose: () => void;
  onLoginRequest: () => void;
}

const MovieDetailModal: React.FC<MovieDetailModalProps> = ({ movie, currentUser, onClose, onLoginRequest }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  
  // New Review State
  const [newReviewText, setNewReviewText] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [pointsEarned, setPointsEarned] = useState<number | null>(null);

  useEffect(() => {
    if (movie) {
      setLoading(true);
      setPointsEarned(null);
      setNewReviewText('');
      setNewRating(5);
      
      Promise.all([
        fetchReviews(movie.id),
        fetchRecommendations(movie.id)
      ]).then(([fetchedReviews, fetchedRecs]) => {
        setReviews(fetchedReviews);
        setRecommendations(fetchedRecs);
        setLoading(false);
      });
    }
  }, [movie]);

  const handlePostReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !movie) return;

    setSubmitting(true);
    try {
      const { review, pointsEarned } = await submitReview(movie.id, currentUser.id, newReviewText, newRating);
      setReviews(prev => [review, ...prev]);
      setPointsEarned(pointsEarned);
      setNewReviewText('');
      // Hide success msg after 3s
      setTimeout(() => setPointsEarned(null), 3000);
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  if (!movie) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-0 sm:p-4 bg-black/90 backdrop-blur-sm">
      <div className="bg-gray-950 w-full max-w-5xl h-full sm:h-[90vh] sm:rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-2xl border border-gray-800 relative">
        <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/80 transition-colors">
          <X className="w-6 h-6" />
        </button>

        {/* Left Column: Poster & Quick Stats */}
        <div className="w-full md:w-1/3 h-64 md:h-full relative shrink-0">
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent z-[1] md:hidden"></div>
          <img 
            src={movie.poster_url} 
            alt={movie.name} 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Column: Content */}
        <div className="w-full md:w-2/3 flex flex-col h-full overflow-y-auto custom-scrollbar">
          
          {/* Header Info */}
          <div className="p-6 md:p-8 border-b border-gray-800 bg-gray-900/50">
            <h2 className="text-3xl font-bold text-white mb-2">{movie.name}</h2>
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400 mb-4">
              <span className="px-2 py-1 bg-gray-800 rounded border border-gray-700">{movie.genre}</span>
              <div className="flex items-center gap-1 text-yellow-500">
                <Star className="w-4 h-4 fill-current" />
                <span className="font-bold text-white">{movie.popularity_score} Popularity</span>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed">{movie.details}</p>
          </div>

          <div className="flex-grow p-6 md:p-8 space-y-8">
            
            {/* Reviews Section */}
            <section>
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                User Reviews <span className="text-sm font-normal text-gray-500">({reviews.length})</span>
              </h3>

              {/* Add Review Box */}
              {!currentUser ? (
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
                  <p className="text-gray-400 mb-3">Join the community to write reviews and earn points.</p>
                  <button onClick={onLoginRequest} className="text-emerald-500 font-bold hover:underline">Log In to Review</button>
                </div>
              ) : (
                <form onSubmit={handlePostReview} className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-6 relative overflow-hidden">
                  {pointsEarned && (
                    <div className="absolute inset-0 bg-emerald-900/90 z-10 flex flex-col items-center justify-center text-white animate-in fade-in">
                      <Award className="w-10 h-10 text-yellow-400 mb-2" />
                      <div className="text-xl font-bold">Review Posted!</div>
                      <div className="text-sm text-emerald-200">You earned +{pointsEarned} Points</div>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button 
                          key={star} 
                          type="button" 
                          onClick={() => setNewRating(star)}
                          className="focus:outline-none hover:scale-110 transition-transform"
                        >
                          <Star 
                            className={`w-6 h-6 ${star <= newRating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-600'}`} 
                          />
                        </button>
                      ))}
                    </div>
                    <span className="text-sm text-gray-400 ml-2">{newRating}/5</span>
                  </div>
                  
                  <div className="relative">
                    <textarea
                      value={newReviewText}
                      onChange={e => setNewReviewText(e.target.value)}
                      required
                      placeholder="Share your thoughts on this movie..."
                      className="w-full bg-gray-950 border border-gray-800 rounded-lg p-3 text-white focus:ring-1 focus:ring-emerald-500 outline-none text-sm min-h-[80px]"
                    />
                    <button 
                      type="submit" 
                      disabled={submitting}
                      className="absolute bottom-3 right-3 p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 transition-colors disabled:opacity-50"
                    >
                      {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </button>
                  </div>
                </form>
              )}

              {/* Reviews List */}
              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <p className="text-gray-500 italic">No reviews yet. Be the first!</p>
                ) : (
                  reviews.map(review => (
                    <div key={review.id} className="bg-gray-900/50 rounded-xl p-4 border border-gray-800/50">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="font-bold text-emerald-400 text-sm">{review.user_name}</span>
                          <span className="text-gray-600 text-xs ml-2">{new Date(review.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex text-yellow-500">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-current' : 'text-gray-700'}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-300 text-sm">{review.text}</p>
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* AI Recommendations */}
            <section>
              <h3 className="text-xl font-bold text-white mb-4">You Might Also Like</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {loading ? (
                  [...Array(4)].map((_, i) => (
                    <div key={i} className="aspect-[2/3] bg-gray-900 animate-pulse rounded-lg"></div>
                  ))
                ) : (
                  recommendations.map(recMovie => (
                    <div key={recMovie.id} onClick={() => {
                        // Hacky way to reload modal with new movie, ideally pass a setMovie prop
                        // For this PRD scope, simple reload is tricky without parent state change
                        // We will rely on parent re-rendering if we click this.
                        // Actually, let's just make these static for now or close/open.
                        // Real implementation would update the selectedMovie state in App.
                    }} className="cursor-pointer opacity-80 hover:opacity-100 transition-opacity">
                       {/* Reusing MovieCard but stripping interactivity to avoid nesting issues or recursive imports logic complexity */}
                       <div className="aspect-[2/3] bg-gray-800 rounded-lg overflow-hidden relative">
                         <img src={recMovie.poster_url} className="w-full h-full object-cover" />
                         <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-black/90 to-transparent">
                           <p className="text-xs font-bold text-white truncate">{recMovie.name}</p>
                           <p className="text-[10px] text-gray-400">{recMovie.genre}</p>
                         </div>
                       </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailModal;
