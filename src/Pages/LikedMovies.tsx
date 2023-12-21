import { useContext, useEffect, useState } from 'react';
import './likedMovies.scss';
import { AuthContext } from '../context/AuthContext';
import { Movie } from '../types/movie.type';
import MovieService from '../services/movies.service';
import Unknown from "../assets/unknown.jpg";
import { Link } from 'react-router-dom';

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
            const year = movie.release_date?.split("-")[0];
            return (
              <li
                key={movie.id}
                id={movie.id?.toString()}
                className="movie-card"
              >
                <Link to={"/film/" + movie.id}>
                  <div className="data">
                    <p className="year">{year}</p>
                    <p className="title">{movie.title}</p>
                  </div>
                  <img
                    src={
                      movie.poster_path
                        ? "https://image.tmdb.org/t/p/w500/" + movie.poster_path
                        : Unknown
                    }
                    className="movie-img"
                    alt=""
                  />
                </Link>
              </li>
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