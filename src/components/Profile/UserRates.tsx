import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import Rate from "../Rates/Rate";
import { MoviesColection, UserDetailsRates, UserDetailsType } from "../../types/colections.type";
import MovieService from "../../services/movies.service";
import '../Rates/rates.scss'

type UserRatesType = {
  adminPanel?: boolean;
};

const UserRates = ({adminPanel}: UserRatesType) => {
  const { state, dispatch } = useContext(AuthContext);
  const [movies, setMovies] = useState<MoviesColection[] | null>(null)
  const [userDetailsRates, setUserDetailsRates] = useState<UserDetailsType["rates"] | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const ratesContainer = useRef<HTMLUListElement>(null);

  const getMoviesWithRates = async () => {
    setLoading(true)
    try {
      const res = await MovieService.getMoviesWithRates()
      
      if(!res) return;
      let movies : MoviesColection[] = []
      res.map((doc) => {
        const data = doc.data();
        movies.push(data as MoviesColection);
        return data;
      });

      setMovies(movies)
      setLoading(false)
    } catch (error) {
      console.log(error);
      setLoading(true)
    }
  }

  useEffect(() => {
    getMoviesWithRates();
  }, []);

  useEffect(() => {
    if(state.update){
      getMoviesWithRates();
      dispatch({
        type: "UPDATE",
        payload: { update: false },
      });
    }
  }, [state.update]);
  
  useEffect(() => {
    if(!state.userDetails?.rates || adminPanel) return;
    const sortedRates = state.userDetails?.rates?.sort((a: UserDetailsRates, b: UserDetailsRates) => {
      return a.movieId - b.movieId;
    })
    setUserDetailsRates(sortedRates)
  }, [state.userDetails?.rates])
  return (
    <div className="user-rates">
      {userDetailsRates && <h2>Mes notes</h2>}

      <ul 
        className="rates-list"
        ref={ratesContainer}
      >
        {userDetailsRates && userDetailsRates.length > 0 && !adminPanel ? (
          userDetailsRates.map((rate, index) => {
            const movieRate : MoviesColection["rates"][0] = {
              id: rate.id,
              userId: state.userInfos?.uid as string,
              displayName: state.userInfos?.displayName ?? undefined,
              photoURL: state.userInfos?.photoURL ?? undefined,
              rate: rate.rate,
            }
            let isFirst: boolean = false;
            if (index === 0 || rate.movieId !== userDetailsRates[index - 1].movieId) isFirst = true
            
            return (
                <Rate key={rate.id} rate={movieRate} userId={state.userInfos?.uid} movieId={rate.movieId} fromUserProfile={true} isFirst={isFirst} />
              );

            })
          ) : !adminPanel && <p>Vous n'avez pas encore de notes.</p>}

        {adminPanel && movies && movies.length > 0 && !loading ? (
          movies.map((movie) => {
            if (!Array.isArray(movie.rates)) return;

            return movie.rates.map((rate) => {
              let isFirst: boolean = false;
              if (rate === movie.rates[0]) isFirst = true

              return (
                  <Rate 
                    key={rate.id} 
                    rate={rate} 
                    userId={state.userInfos?.uid} 
                    movieId={parseInt(movie.movieId)} 
                    fromUserProfile={true} 
                    isFirst={isFirst} />
                );
  
              })
          })
        ) : !loading && adminPanel ? (<p>Aucune notes sur le site</p>)
        : adminPanel && (<p>Chargement...</p>)}
      </ul>
    </div>
  );
};

export default UserRates;