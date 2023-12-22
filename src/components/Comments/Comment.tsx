import Unknown from "../../assets/unknown.jpg";
import MovieService from "../../services/movies.service";
import UserDetailsService from "../../services/userdetails.service";
import { MoviesColection } from "../../types/colections.type";
import { Movie } from "../../types/movie.type";
import Loading from "../../assets/loading.svg"
import { Fragment, useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";

export type CommentType = {
  comment: MoviesColection["comments"][0]
  userId: string | undefined
  movieId: Movie["id"]
  fromUserProfile?: boolean
  isFirst?: boolean
}
const Comment = ({comment, userId, movieId, fromUserProfile, isFirst}: CommentType) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [movieLoading, setMovieLoading] = useState<boolean>(false);
  const [movie, setMovie] = useState<Movie | null>(null);
  const { dispatch, state } = useContext(AuthContext);

  const removeComment = async () => {
    setLoading(true);
    try {
      if(!userId) return;
      await MovieService.removeComment(movieId, comment.id);

      if(comment.userId !== state.userInfos?.uid && state.userDetails?.admin){
        console.log(comment);
        
        await UserDetailsService.removeComment(comment.userId, comment.id);

        dispatch({
          type: "UPDATE",
        });

        setLoading(false);
        return;
      }else{
        await UserDetailsService.removeComment(userId, comment.id);
      }

      if(!state.userDetails?.comments) return;

      dispatch({
        type: "UPDATE_USER_INFOS",
        payload: {
          userInfos: {
            ...state.userInfos,
          },
          userDetails: {
            ...state.userDetails,
            comments: [
              ...state.userDetails?.comments?.filter((thisComment) => comment.id !== thisComment.id)
            ]
          }
        }
      });


      setLoading(false);
    } catch (error) {
      console.log(error);
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
    } catch (error) {
      console.log(error);
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
        className={`comment-container comment-container-${movie?.id}`}
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
          <img src={Loading} alt="loading" className="loading delete-comment" width={20} height={20} />
        )}
        <div className="comment">
          <div className="author">
            <img src={comment.photoURL ?? Unknown } alt="pp" className="photoURL" width={40} height={40}/>
            <p className="comment-author">{comment.displayName ?? "Anonyme"}</p>
          </div>
          <p className="comment-content">{comment.text}</p>

          {(comment.userId === userId || state.userDetails?.admin) && !loading ? (
            <button 
              className="delete-comment"
              onClick={removeComment}
            >X</button>
          ): (comment.userId === userId || state.userDetails?.admin) &&  (
            <img src={Loading} alt="loading" className="loading delete-comment" width={20} height={20} />
          )}
        </div>
      </li>

    </Fragment>
  );
};

export default Comment;