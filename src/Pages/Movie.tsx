import { useParams } from "react-router-dom";
import MovieContent from "../components/Movie/MovieContent";

const Movie = () => {
  const { id } = useParams();
  if(!id) return
  const numberId: number = parseInt(id);

  return (
    <div className="movie">
      { id && (
        <MovieContent id={numberId} />
      )}
    </div>
  );
};

export default Movie;
