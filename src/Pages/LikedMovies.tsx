import { useContext, useEffect, useState } from 'react';
import './likedMovies.scss';
import { AuthContext } from '../context/AuthContext';
import { Movie } from '../types/movie.type';
import MovieService from '../services/movies.service';
import MovieCard from '../components/Movie/MovieCard';

const LikedMovies = () => {
  const { state } = useContext(AuthContext);
  const [movies, setMovies] = useState<Movie[]>([]);

  const getMovies = async () => {
    if (state.userDetails?.likes) {
      try {
        const moviePromises = state.userDetails.likes.map(async (movieId: number) => {
          return MovieService.getMovieById(movieId);
        });
        const movieData = await Promise.all(moviePromises);
        setMovies(movieData);
      } catch (error) {
        console.log(error);
      }
    }
  };
  
  useEffect(() => {
    getMovies();
  }, [state.userDetails?.likes]);

  return (
    <div className='liked-movies'>
      <h1>Mes favoris</h1>

      <ul className="movies">
        {movies && movies.length > 0 ? (
          movies.map((movie: Movie) => {
            return (
              <MovieCard movie={movie} key={movie.id} />
            );
          })
        ) : (
          <p>Aucun films favoris pour le moment</p>
        )}
      </ul>

    </div>
  );
};

export default LikedMovies;