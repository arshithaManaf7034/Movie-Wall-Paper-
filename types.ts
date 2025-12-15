export interface Movie {
  id: number;
  name: string;
  details?: string;
  genre?: string;
  poster_url?: string;
  popularity_score: number;
  created_at?: string;
}

export interface PaginatedResponse {
  results: Movie[];
  next_offset: number;
  has_more: boolean;
  total_count?: number;
}

export interface CreateMovieDTO {
  name: string;
  details: string;
  genre: string;
  poster_url: string;
  popularity_score: number;
}

export interface MovieFilters {
  search: string;
  genre: string;
  sortBy: 'popularity_desc' | 'popularity_asc' | 'newest';
}

export interface User {
  id: string;
  email: string;
  name: string;
  token: string;
  role: 'admin' | 'user';
  points: number;
  level_title: string; // Newbie, Reviewer, Critic, etc.
  reviews_count: number;
  joined_at: string;
}

export interface Review {
  id: string;
  movie_id: number;
  user_id: string;
  user_name: string;
  rating: number;
  text: string;
  likes: number;
  created_at: string;
}

export interface LeaderboardEntry {
  user_id: string;
  name: string;
  points: number;
  level_title: string;
  rank: number;
}
