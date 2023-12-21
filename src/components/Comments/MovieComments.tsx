import MovieService from "../../services/movies.service";
import { MoviesColection } from "../../types/colections.type";
import { Movie } from "../../types/movie.type";
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from "../../context/AuthContext";
import Comment from "./Comment";
import "./comments.scss";

export type MovieCommentsType = {
  movie: Movie
}
const MovieComments = ({movie}:MovieCommentsType) => {
  const [movieCollection, setMovieCollection] = useState<MoviesColection | null>(null);

  const { dispatch, state } = useContext(AuthContext);

  const getMovieCollection = async () : Promise<void> => {
    try {
      const res = await MovieService.getMovieData(movie);

      if(!res) return;
      const resDate = res.data()

      setMovieCollection(resDate as MoviesColection);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if(movie.id){
      getMovieCollection();
    }
  }, [movie, state.userDetails?.comments]);

  useEffect(() => {
    if(state.update){
      getMovieCollection();
      dispatch({
        type: "UPDATE",
      });
    }
  }, [state.update]);


  return (
    <div className="comments">
      <h3>Commentaire{movieCollection?.comments?.length && movieCollection?.comments?.length > 1 ? "s" : ""} <span>({movieCollection?.comments?.length})</span>
      </h3>

      <ul className="comments-list">

        {movieCollection && movieCollection.comments && movieCollection.comments.length > 0 ? (
          movieCollection.comments.map((comment) => {

            return (
              <Comment key={comment.id} comment={comment} userId={state.userInfos?.uid} movie={movie} />
            );

          })
        ) : <p>Aucun commentaire pour le moment. Soit le premier à écrire un commentaire !</p>}
      </ul>
    
    </div>
  );
};

export default MovieComments;