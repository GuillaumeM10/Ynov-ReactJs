import { User } from "firebase/auth";
import { Movie } from "../../types/movie.type";
import { v4 as uuidv4 } from 'uuid';
import { useContext, useState } from "react";
import MovieService from "../../services/movies.service";
import UserDetailsService from "../../services/userdetails.service";
import Unknown from "../../assets/unknown.jpg";
import { AuthContext } from "../../context/AuthContext";
import "./create-comment.scss";

export type CreateCommentType = {
  movie: Movie;
  userInfos: User
}
const CreateComment = ({movie, userInfos}:CreateCommentType) => {
  const [text, setText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const { dispatch, state } = useContext(AuthContext);

  const addComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const comment = {
      id: uuidv4(),
      userId: userInfos.uid,
      text: text,
      displayName: userInfos.displayName,
      photoURL: userInfos.photoURL,
    }

    try {
      await MovieService.addComment(
        movie.id, 
        comment.userId,
        comment.displayName,
        comment.photoURL,
        comment.text,
        comment.id
      );
      await UserDetailsService.addComment(
        comment.userId,
        movie,
        comment.text,
        comment.id
      );

      dispatch({
        type: "UPDATE_USER_INFOS",
        payload: {
          userInfos: {
            ...state.userInfos,
          },
          userDetails: {
            ...state.userDetails,
            comments: [
              ...state.userDetails?.comments ?? [],
              {
                movieId: movie.id,
                id: comment.id,
                text: comment.text,
              }
            ]
          }
        },
      });

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  return (
    <div className="create-comment">
      {loading ? <p>Chargement...</p> : (

      <form 
        action="" 
        className="comment-form"
        onSubmit={(e) => {
          addComment(e)
        }}
      >

        <div className="author">
          <img src={userInfos.photoURL ?? Unknown} alt="pp" className="photoURL" width={40} height={40} />
          <p className="comment-author">{userInfos.displayName ?? "Anonyme"}</p>
        </div>

        <textarea 
          name="text" 
          id="text"
          className="comment-text" 
          cols={30} 
          rows={10}
          placeholder="Écrivez votre commentaire"
          value={text}
          onChange={(e) => {
            setText(e.target.value)
          }}
        />

        <button type="submit">Envoyer</button>

      </form>

    )}
    </div>
  );
};

export default CreateComment;