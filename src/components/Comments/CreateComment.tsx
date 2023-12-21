import { Movie } from "../../types/movie.type";

export type CreateCommentType = {
  movie: Movie
}
const CreateComment = ({movie}:CreateCommentType) => {
  return (
    <div className="create-comment">
      
    </div>
  );
};

export default CreateComment;