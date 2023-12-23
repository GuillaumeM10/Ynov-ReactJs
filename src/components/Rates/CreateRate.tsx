import { User } from "firebase/auth";
import { Movie } from "../../types/movie.type";
import { v4 as uuidv4 } from 'uuid';
import { useContext, useState, useEffect } from "react";
import MovieService from "../../services/movies.service";
import UserDetailsService from "../../services/userdetails.service";
import Unknown from "../../assets/unknown.jpg";
import { AuthContext } from "../../context/AuthContext";
import "./create-rate.scss";
import StartFull from "../../assets/star-full.svg"
import StartEmpty from "../../assets/star-empty.svg"
import { UserDetailsRates } from "../../types/colections.type";

export type CreateRateType = {
  movie: Movie;
  userInfos: User
}
const CreateRate = ({movie, userInfos}:CreateRateType) => {
  const [rateValue, setRateValue] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const { dispatch, state } = useContext(AuthContext);

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

    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    updateUserDetails();
  }, [])

  const addRate = async (ratingValue: number) => {
    // e.preventDefault();
    setLoading(true);

    const rate = {
      id: uuidv4(),
      userId: userInfos.uid,
      rate: ratingValue,
      displayName: userInfos.displayName,
      photoURL: userInfos.photoURL,
    }

    try {
      await MovieService.addRate(
        movie.id, 
        rate.userId,
        rate.displayName,
        rate.photoURL,
        rate.rate,
        rate.id
      );
      await UserDetailsService.addRate(
        rate.userId,
        movie,
        rate.rate,
        rate.id
      );

      if(
        state.userDetails?.rates?.find((thisRate: UserDetailsRates) => thisRate.movieId === movie.id)
      ){
        dispatch({
          type: "UPDATE_USER_INFOS",
          payload: {
            userInfos: {
              ...state.userInfos,
            },
            userDetails: {
              ...state.userDetails,
              rates: state.userDetails?.rates?.map((thisRate: UserDetailsRates) => {
                  if(thisRate.movieId === movie.id){
                    return {
                      ...thisRate,
                      rate: rate.rate,
                    }
                  }
                  return thisRate;
                })
            }
          },
        });
      }else{
        dispatch({
          type: "UPDATE_USER_INFOS",
          payload: {
            userInfos: {
              ...state.userInfos,
            },
            userDetails: {
              ...state.userDetails,
              rates: [
                ...state.userDetails?.rates ?? [],
                {
                  id: rate.id,
                  movieId: movie.id,
                  rate: rate.rate,
                }
              ]
            }
          },
        });
      }

      dispatch({ 
        type: "UPDATE",
        payload: {update: true},
      });

      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  }

  useEffect(() => {
    if(!state.userDetails?.rates) return;
    const movieRate = state.userDetails?.rates.find((rate: UserDetailsRates) => rate.movieId === movie.id);
    
    if(!movieRate) {setRateValue(0); return;};
    setRateValue(movieRate.rate)
  }, [state.userDetails?.rates])

  return (
    <div className="create-rate">

      <form 
        action="" 
        className="rate-form"
      >

        <div className="author">
          <img src={userInfos.photoURL ?? Unknown} alt="pp" className="photoURL" width={40} height={40} />
          <p className="rate-author">{userInfos.displayName ?? "Anonyme"}</p>
        </div>

        <div className="stars">
          <h3 className="rate-label">Notez le film</h3>
          {loading ? <p>Chargement...</p> : (
            <ul className="stars-container">
              
              {[...Array(5)].map((_, index) => {
                const ratingValue = index + 1;
                
                return (
                  <li key={index}>

                    <button
                      type="button"
                      className="star-label"
                    >
                      <img 
                        src={ratingValue <= rateValue ? StartFull : StartEmpty} 
                        alt="star" 
                        className="star" 
                        width={30} 
                        height={30} 
                        onClick={() => {
                          setRateValue(ratingValue)
                          addRate(ratingValue);
                        }}
                      />
                    </button>
                    
                  </li>
                )
              })}

            </ul>
          )}

        </div>

      </form>

    </div>
  );
};

export default CreateRate;