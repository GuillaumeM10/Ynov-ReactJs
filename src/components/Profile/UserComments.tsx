import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import Comment from "../Comments/Comment";
import { MoviesColection, UserDetailsType } from "../../types/colections.type";
import MovieService from "../../services/movies.service";


type UserCommentsType = {
  adminPanel?: boolean;
};

const UserComments = ({adminPanel}: UserCommentsType) => {
  const { state, dispatch } = useContext(AuthContext);
  const [movies, setMovies] = useState<MoviesColection[] | null>(null)
  const [userDetailsComments, setUserDetailsComments] = useState<UserDetailsType["comments"] | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const commentsContainer = useRef<HTMLUListElement>(null);

  const getMoviesWithComments = async () => {
    setLoading(true)
    try {
      const res = await MovieService.getMoviesWithComments()
      
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
    getMoviesWithComments();
  }, []);

  useEffect(() => {
    if(state.update){
      getMoviesWithComments();
      dispatch({
        type: "UPDATE",
      });
    }
  }, [state.update]);
  
  useEffect(() => {
    if(!state.userDetails?.comments || adminPanel) return;
    const sortedComments = state.userDetails?.comments?.sort((a, b) => {
      return a.movieId - b.movieId;
    })
    setUserDetailsComments(sortedComments)
  }, [state.userDetails?.comments])
  return (
    <div className="user-comments">
      {userDetailsComments && <h2>Mes commentaires</h2>}

      <ul 
        className="comments-list"
        ref={commentsContainer}
      >
        {userDetailsComments && userDetailsComments.length > 0 && !adminPanel ? (
          userDetailsComments.map((comment, index) => {
            const movieComment : MoviesColection["comments"][0] = {
              id: comment.id,
              userId: state.userInfos?.uid as string,
              displayName: state.userInfos?.displayName ?? undefined,
              photoURL: state.userInfos?.photoURL ?? undefined,
              text: comment.text,
            }
            let isFirst: boolean = false;
            if (index === 0 || comment.movieId !== userDetailsComments[index - 1].movieId) isFirst = true
            
            return (
                <Comment key={comment.id} comment={movieComment} userId={state.userInfos?.uid} movieId={comment.movieId} fromUserProfile={true} isFirst={isFirst} />
              );

            })
          ) : !adminPanel && <p>Vous n'avez pas encore de commentaires</p>}

        {adminPanel && movies && movies.length > 0 && !loading ? (
          movies.map((movie) => {
            if (!Array.isArray(movie.comments)) return;

            return movie.comments.map((comment) => {
              let isFirst: boolean = false;
              if (comment === movie.comments[0]) isFirst = true

              return (
                  <Comment 
                    key={comment.id} 
                    comment={comment} 
                    userId={state.userInfos?.uid} 
                    movieId={parseInt(movie.movieId)} 
                    fromUserProfile={true} 
                    isFirst={isFirst} />
                );
  
              })
          })
        ) : !loading && adminPanel ? (<p>Aucun commentaires sur le site</p>)
        : adminPanel && (<p>Chargement...</p>)}
      </ul>
    </div>
  );
};

export default UserComments;