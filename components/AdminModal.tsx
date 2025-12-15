import React, { useState, useEffect } from 'react';
import { X, Loader2, Save } from 'lucide-react';
import { CreateMovieDTO, Movie } from '../types';
import { addMovie, updateMovie } from '../services/api';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  movieToEdit?: Movie;
}

const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose, onSuccess, movieToEdit }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateMovieDTO>({
    name: '',
    genre: '',
    details: '',
    poster_url: '',
    popularity_score: 80
  });

  // Populate form when opening in Edit mode
  useEffect(() => {
    if (isOpen) {
      if (movieToEdit) {
        setFormData({
          name: movieToEdit.name,
          genre: movieToEdit.genre || '',
          details: movieToEdit.details || '',
          poster_url: movieToEdit.poster_url || '',
          popularity_score: movieToEdit.popularity_score
        });
      } else {
        // Reset for Add mode
        setFormData({
          name: '',
          genre: '',
          details: '',
          poster_url: '',
          popularity_score: 80
        });
      }
      setError(null);
    }
  }, [isOpen, movieToEdit]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'popularity_score' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (movieToEdit) {
        await updateMovie(movieToEdit.id, formData);
      } else {
        await addMovie(formData);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center bg-gray-950/50">
          <h2 className="text-xl font-semibold text-white">
            {movieToEdit ? 'Edit Movie' : 'Add New Movie'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-gray-800 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          {error && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-800 text-red-200 text-sm rounded-lg">
              {error}
            </div>
          )}
          
          <form id="movie-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Movie Title *</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all placeholder-gray-600"
                placeholder="e.g. Kumbalangi Nights"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Genre</label>
                <select
                  name="genre"
                  value={formData.genre}
                  onChange={handleChange}
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                >
                  <option value="">Select...</option>
                  <option value="Drama">Drama</option>
                  <option value="Thriller">Thriller</option>
                  <option value="Comedy">Comedy</option>
                  <option value="Action">Action</option>
                  <option value="Romance">Romance</option>
                  <option value="Sci-Fi">Sci-Fi</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Score (0-100)</label>
                <input
                  type="number"
                  name="popularity_score"
                  min="0"
                  max="100"
                  value={formData.popularity_score}
                  onChange={handleChange}
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Poster URL *</label>
              <input
                type="url"
                name="poster_url"
                required
                value={formData.poster_url}
                onChange={handleChange}
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all placeholder-gray-600"
                placeholder="https://..."
              />
              <p className="text-xs text-gray-500 mt-1">Must be a valid image URL.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Details/Synopsis</label>
              <textarea
                name="details"
                rows={3}
                value={formData.details}
                onChange={handleChange}
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all placeholder-gray-600"
                placeholder="Brief story about the movie..."
              />
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-800 bg-gray-950/50 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-all font-medium"
          >
            Cancel
          </button>
          <button
            form="movie-form"
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-medium transition-all shadow-lg shadow-emerald-900/20"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Movie
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminModal;
