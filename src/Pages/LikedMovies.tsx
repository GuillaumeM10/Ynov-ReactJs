import { useContext, useEffect, useState } from 'react';
import './likedMovies.scss';
import { AuthContext } from '../context/AuthContext';
import { Movie } from '../types/movie.type';
import MovieService from '../services/movies.service';
import MovieCard from '../components/Movie/MovieCard';
import UserDetailsService from '../services/userdetails.service';

const LikedMovies = () => {
  const { dispatch, state } = useContext(AuthContext);
  const [movies, setMovies] = useState<Movie[]>([]);

  const updateUserDetails = async () => {
    try {
      if(!state.userInfos?.uid) return;
      const userDetails = await UserDetailsService.getUserDetails(state.userInfos?.uid);
      
      if(!userDetails) return;
      const userDetailsData = userDetails.data();

      dispatch({
        type: "UPDATE_USER_INFOS",
        payload: {
          userInfos: {
            ...state.userInfos,
          },
          userDetails: {
            ...userDetailsData
          }
        }
      });

    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    updateUserDetails();
  }, [])

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