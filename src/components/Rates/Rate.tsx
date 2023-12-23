import Unknown from "../../assets/unknown.jpg";
import MovieService from "../../services/movies.service";
import UserDetailsService from "../../services/userdetails.service";
import { MoviesColection, UserDetailsRates } from "../../types/colections.type";
import { Movie } from "../../types/movie.type";
import Loading from "../../assets/loading.svg"
import { Fragment, useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import StartFull from "../../assets/star-full.svg"
import StartEmpty from "../../assets/star-empty.svg"

export type RateType = {
  rate: MoviesColection["rates"][0]
  userId: string | undefined
  movieId: Movie["id"]
  fromUserProfile?: boolean
  isFirst?: boolean
}
const Rate = ({rate, userId, movieId, fromUserProfile, isFirst}: RateType) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [movieLoading, setMovieLoading] = useState<boolean>(false);
  const [movie, setMovie] = useState<Movie | null>(null);
  const { dispatch, state } = useContext(AuthContext);

  const removeRate = async () => {
    setLoading(true);
    try {
      if(!userId) return;
      await MovieService.removeRate(movieId, rate.id);

      if(rate.userId !== state.userInfos?.uid && state.userDetails?.admin){
        await UserDetailsService.removeRate(rate.userId, rate.id);

        dispatch({
          type: "UPDATE",
          payload: {
            update: true,
          }
        });

        setLoading(false);
        return;
      }else{
        await UserDetailsService.removeRate(userId, rate.id);
      }

      if(!state.userDetails?.rates) return;

      dispatch({
        type: "UPDATE_USER_INFOS",
        payload: {
          userInfos: {
            ...state.userInfos,
          },
          userDetails: {
            ...state.userDetails,
            rates: [
              ...state.userDetails?.rates?.filter((thisRate: UserDetailsRates) => rate.id !== thisRate.id)
            ]
          }
        }
      });


      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  }

  const getMovie = async () => {
    setMovieLoading(true);
    try {
      if(!movieId){ setMovieLoading(false); return};
      const res = await MovieService.getMovieById(movieId);

      if(!res) { setMovieLoading(false); return};
      setMovie(res);
      setMovieLoading(false);
    } catch (err) {
      console.log(err);
      setMovieLoading(false);
    }
  }

  useEffect(() => {
    if(fromUserProfile){
      getMovie();
    }
  }, [fromUserProfile]);

  return (
    <Fragment>

      <li 
        className={`rate-container rate-container-${movie?.id}`}
        movie-id={movie?.id}
        style={{
          order: movie?.id,
        }}
      >
        {fromUserProfile 
          && isFirst
          && !movieLoading 
          && movie ? (
          <div className="movie">
            <h3 className="movie-title">{movie.title}</h3>
            <Link to={`/film/${movie.id}`} className="secondary">Voir le film</Link>
          </div>
        ): fromUserProfile 
          && isFirst
          && movie 
          && (
          <img src={Loading} alt="loading" className="loading delete-rate" width={20} height={20} />
        )}
        <div className="rate">
          <div className="author">
            <img src={rate.photoURL ?? Unknown } alt="pp" className="photoURL" width={40} height={40}/>
            <p className="rate-author">{rate.displayName ?? "Anonyme"}</p>
          </div>
          <div className="stars-container">
              
              {[...Array(5)].map((_, index) => {
                const ratingValue = index + 1;
                
                return (
                  <label htmlFor="rate" key={index}>

                    <label 
                      htmlFor={`rate-${ratingValue}`} 
                      className="star-label"
                    >
                      <img 
                        src={ratingValue <= rate.rate ? StartFull : StartEmpty} 
                        alt="star" 
                        className="star" 
                        width={30} 
                        height={30} 
                      />
                    </label>
                    
                  </label>
                )
              })}
          </div>

          {(rate.userId === userId || state.userDetails?.admin) && !loading ? (
            <button 
              className="delete-rate"
              onClick={removeRate}
            >X</button>
          ): (rate.userId === userId || state.userDetails?.admin) &&  (
            <img src={Loading} alt="loading" className="loading delete-rate" width={20} height={20} />
          )}
        </div>
      </li>

    </Fragment>
  );
};

export default Rate;