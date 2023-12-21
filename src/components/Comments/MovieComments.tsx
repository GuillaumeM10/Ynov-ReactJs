import { Movie } from "../../types/movie.type";

export type MovieCommentsType = {
  movie: Movie
}
const MovieComments = ({movie}:MovieCommentsType) => {
  return (
    <div className="comments">
      <h3>Commentaires</h3>
    </div>
  );
};

export default MovieComments;