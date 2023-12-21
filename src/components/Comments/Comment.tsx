import Unknown from "../../assets/unknown.jpg";
import MovieService from "../../services/movies.service";
import UserDetailsService from "../../services/userdetails.service";
import { MoviesColection } from "../../types/colections.type";
import { Movie } from "../../types/movie.type";
import Loading from "../../assets/loading.svg"
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

export type CommentType = {
  comment: MoviesColection["comments"][0]
  userId: string | undefined
  movie: Movie
}
const Comment = ({comment, userId, movie}: CommentType) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { dispatch, state } = useContext(AuthContext);

  const removeComment = async () => {
    setLoading(true);
    try {
      if(!userId) return;
      await MovieService.removeComment(movie, comment.id);

      if(comment.userId !== state.userInfos?.uid && state.userDetails?.admin){
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

  return (
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
  );
};

export default Comment;