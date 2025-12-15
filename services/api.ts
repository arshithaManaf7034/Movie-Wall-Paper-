import { Movie, PaginatedResponse, CreateMovieDTO, MovieFilters, User, Review, LeaderboardEntry } from '../types';

// --- MOCK DATA GENERATION ---
const GENRES = ['Drama', 'Thriller', 'Comedy', 'Action', 'Romance', 'Mystery', 'Sci-Fi'];
const MOVIE_TITLES = [
  "Kumbalangi Nights", "Premam", "Drishyam", "Bangalore Days", "Maheshinte Prathikaaram",
  "Angamaly Diaries", "Thondimuthalum Driksakshiyum", "Uyare", "Virus", "Joji",
  "The Great Indian Kitchen", "Minnal Murali", "Ayyappanum Koshiyum", "Trance", "Ee.Ma.Yau",
  "Churuli", "Nayattu", "Malik", "Kurup", "Bheeshma Parvam",
  "Jana Gana Mana", "Hridayam", "Thallumaala", "Nna Thaan Case Kodu", "Rorschach",
  "Mukundan Unni Associates", "Romancham", "2018", "Kaathal", "Nanpakal Nerathu Mayakkam",
  "Bramayugam", "Manjummel Boys", "Aavesham", "Premalu", "Kishkindha Kaandam",
  "Turbo", "Guruvayoor Ambalanadayil", "Varshangalkku Shesham", "Aadujeevitham", "Kannur Squad"
];

const generateMockMovies = (count: number): Movie[] => {
  return Array.from({ length: count }, (_, i) => {
    const title = MOVIE_TITLES[i % MOVIE_TITLES.length] + (i >= MOVIE_TITLES.length ? ` ${Math.floor(i / MOVIE_TITLES.length) + 1}` : '');
    const date = new Date();
    date.setDate(date.getDate() - i * 5); // Spread dates out
    
    return {
      id: i + 1,
      name: title,
      details: `A compelling ${GENRES[i % GENRES.length].toLowerCase()} that explores the depths of human emotion and storytelling. Released in ${2010 + (i % 14)}.`,
      genre: GENRES[i % GENRES.length],
      poster_url: `https://picsum.photos/300/450?random=${i + 1}`,
      popularity_score: Math.floor(Math.random() * 50) + 50, // Score between 50 and 100
      created_at: date.toISOString()
    };
  });
};

// In-memory Databases
let moviesDB: Movie[] = generateMockMovies(100);

let usersDB: User[] = [
  {
    id: 'u1', email: 'admin@example.com', name: 'Admin User', token: 'admin-token', role: 'admin', points: 0, level_title: 'Admin', reviews_count: 0, joined_at: new Date().toISOString()
  },
  {
    id: 'u2', email: 'superfan@kerala.com', name: 'Cinema Bhranthan', token: 'user-token-1', role: 'user', points: 1250, level_title: 'Critic', reviews_count: 45, joined_at: new Date().toISOString()
  },
  {
    id: 'u3', email: 'newbie@test.com', name: 'Movie Buff', token: 'user-token-2', role: 'user', points: 40, level_title: 'Newbie', reviews_count: 2, joined_at: new Date().toISOString()
  }
];

let reviewsDB: Review[] = [
  { id: 'r1', movie_id: 1, user_id: 'u2', user_name: 'Cinema Bhranthan', rating: 5, text: 'Absolute masterpiece!', likes: 12, created_at: new Date().toISOString() },
  { id: 'r2', movie_id: 1, user_id: 'u3', user_name: 'Movie Buff', rating: 4, text: 'Great cinematography.', likes: 2, created_at: new Date().toISOString() }
];

// --- HELPERS ---
const calculateLevel = (points: number): string => {
  if (points >= 5000) return 'Master Reviewer';
  if (points >= 1500) return 'Expert Critic';
  if (points >= 500) return 'Critic';
  if (points >= 100) return 'Reviewer';
  return 'Newbie';
};

const SIMULATED_DELAY_MS = 200; 

// --- API ---

export const fetchMovies = async (limit: number = 20, offset: number = 0, filters?: MovieFilters): Promise<PaginatedResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredDB = [...moviesDB];

      if (filters?.search) {
        const q = filters.search.toLowerCase();
        filteredDB = filteredDB.filter(m => m.name.toLowerCase().includes(q));
      }
      if (filters?.genre && filters.genre !== 'All') {
        filteredDB = filteredDB.filter(m => m.genre === filters.genre);
      }

      if (filters?.sortBy) {
        filteredDB.sort((a, b) => {
          if (filters.sortBy === 'newest') {
            return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
          } else if (filters.sortBy === 'popularity_asc') {
            return a.popularity_score - b.popularity_score;
          } else {
            return b.popularity_score - a.popularity_score;
          }
        });
      } else {
        filteredDB.sort((a, b) => b.popularity_score - a.popularity_score);
      }

      const slice = filteredDB.slice(offset, offset + limit);
      const nextOffset = offset + limit;
      const hasMore = nextOffset < filteredDB.length;

      resolve({
        results: slice,
        next_offset: nextOffset,
        has_more: hasMore,
        total_count: filteredDB.length
      });
    }, SIMULATED_DELAY_MS);
  });
};

export const addMovie = async (movieData: CreateMovieDTO): Promise<Movie> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!movieData.name) return reject(new Error("Name is required"));
      const newMovie: Movie = {
        id: moviesDB.length > 0 ? Math.max(...moviesDB.map(m => m.id)) + 1 : 1,
        ...movieData,
        created_at: new Date().toISOString()
      };
      moviesDB.push(newMovie);
      resolve(newMovie);
    }, SIMULATED_DELAY_MS);
  });
};

export const updateMovie = async (id: number, movieData: Partial<CreateMovieDTO>): Promise<Movie> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = moviesDB.findIndex(m => m.id === id);
      if (index === -1) return reject(new Error("Movie not found"));
      moviesDB[index] = { ...moviesDB[index], ...movieData };
      resolve(moviesDB[index]);
    }, SIMULATED_DELAY_MS);
  });
};

export const deleteMovie = async (id: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = moviesDB.findIndex(m => m.id === id);
      if (index === -1) return reject(new Error("Movie not found"));
      moviesDB.splice(index, 1);
      resolve();
    }, SIMULATED_DELAY_MS);
  });
};

// --- AUTH & USER ---

export const loginUser = async (email: string, password: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = usersDB.find(u => u.email === email);
      if (user) {
        // Simple mock password check
        if (password === 'admin' && user.role === 'admin') {
           resolve(user);
           return;
        }
        // For mock users, accept any password if user exists
        resolve(user);
      } else {
        reject(new Error("Invalid email or password."));
      }
    }, SIMULATED_DELAY_MS);
  });
};

export const registerUser = async (email: string, password: string, name: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const existing = usersDB.find(u => u.email === email);
      if (existing) {
        reject(new Error("Email already registered. Please login."));
        return;
      }
      
      const newUser: User = {
        id: `u${Date.now()}`,
        email,
        name: name || email.split('@')[0],
        token: `token-${Date.now()}`,
        role: 'user',
        points: 20, // Profile completion/Signup bonus
        level_title: 'Newbie',
        reviews_count: 0,
        joined_at: new Date().toISOString()
      };
      usersDB.push(newUser);
      resolve(newUser);
    }, SIMULATED_DELAY_MS);
  });
};

export const fetchUserProfile = async (userId: string): Promise<User | undefined> => {
    return usersDB.find(u => u.id === userId);
};

// --- REVIEWS & GAMIFICATION ---

export const fetchReviews = async (movieId: number): Promise<Review[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(reviewsDB.filter(r => r.movie_id === movieId).sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
    }, SIMULATED_DELAY_MS);
  });
};

export const submitReview = async (movieId: number, userId: string, text: string, rating: number): Promise<{review: Review, pointsEarned: number}> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = usersDB.find(u => u.id === userId);
      if (!user) throw new Error("User not found");

      const newReview: Review = {
        id: `r${Date.now()}`,
        movie_id: movieId,
        user_id: userId,
        user_name: user.name,
        rating,
        text,
        likes: 0,
        created_at: new Date().toISOString()
      };
      
      reviewsDB.push(newReview);
      
      // GAMIFICATION LOGIC
      const pointsEarned = 10; // +10 for review
      user.points += pointsEarned;
      user.reviews_count += 1;
      user.level_title = calculateLevel(user.points);

      resolve({ review: newReview, pointsEarned });
    }, SIMULATED_DELAY_MS);
  });
};

export const fetchLeaderboard = async (): Promise<LeaderboardEntry[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const sortedUsers = [...usersDB]
        .filter(u => u.role !== 'admin')
        .sort((a, b) => b.points - a.points)
        .slice(0, 10);
        
      const leaderboard = sortedUsers.map((u, index) => ({
        user_id: u.id,
        name: u.name,
        points: u.points,
        level_title: u.level_title,
        rank: index + 1
      }));
      resolve(leaderboard);
    }, SIMULATED_DELAY_MS);
  });
};

// --- AI RECOMMENDATIONS ---

export const fetchRecommendations = async (currentMovieId: number): Promise<Movie[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const currentMovie = moviesDB.find(m => m.id === currentMovieId);
      if (!currentMovie) {
        resolve([]);
        return;
      }

      // Simple AI Simulation: Same Genre + High Popularity + Not current movie
      const recommendations = moviesDB
        .filter(m => m.id !== currentMovieId && m.genre === currentMovie.genre)
        .sort((a, b) => b.popularity_score - a.popularity_score)
        .slice(0, 4);

      // If not enough same genre, fill with top popular
      if (recommendations.length < 4) {
        const others = moviesDB
            .filter(m => m.id !== currentMovieId && m.genre !== currentMovie.genre)
            .sort((a, b) => b.popularity_score - a.popularity_score)
            .slice(0, 4 - recommendations.length);
        recommendations.push(...others);
      }

      resolve(recommendations);
    }, SIMULATED_DELAY_MS);
  });
};