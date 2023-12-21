import { useLocation, useNavigate } from "react-router-dom";
import { Fragment, useState, useEffect } from "react";
import "./breadcrum.scss";
import MoviesService from "../../../services/movies.service";
import { Movie } from "../../../types/movie.type";

const Breadcrumb = () => {
  const { pathname } = useLocation();
  const pathnames = pathname.split("/").filter((x) => x);
  const navigate = useNavigate();
  const [nameMovie, setNameMovie] = useState<Movie["title"]>("");

  const getMovie = async (id: number): Promise<void> => {
    try {
      const res = await MoviesService.getMovieById(id);
      setNameMovie(res.title);
    } catch (err: unknown) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (pathnames.length > 0) {
      const last = pathnames[pathnames.length - 1];
      if (Number(last)) {
        getMovie(last as unknown as number);
      }
    }
  }, [pathname]);

  return (
    <div className="breadcrumb-container">
      <button className="back" onClick={() => navigate(-1)}>
        <svg
          enableBackground="new 0 0 32 32"
          height="32px"
          id="Layer_1"
          version="1.1"
          viewBox="0 0 32 32"
          width="32px"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M18.221,7.206l9.585,9.585c0.879,0.879,0.879,2.317,0,3.195l-0.8,0.801c-0.877,0.878-2.316,0.878-3.194,0  l-7.315-7.315l-7.315,7.315c-0.878,0.878-2.317,0.878-3.194,0l-0.8-0.801c-0.879-0.878-0.879-2.316,0-3.195l9.587-9.585  c0.471-0.472,1.103-0.682,1.723-0.647C17.115,6.524,17.748,6.734,18.221,7.206z"
            fill="#fff"
          />
        </svg>
        Retour
      </button>
      <div className="breadcrumb">
        {pathnames.length > 0 && (
          <button className="home" onClick={() => navigate("/")}>
            Accueil
          </button>
        )}

        {pathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;
          return isLast ? (
            <Fragment key={index}>
              <svg
                enableBackground="new 0 0 32 32"
                height="32px"
                id="Layer_1"
                version="1.1"
                viewBox="0 0 32 32"
                width="32px"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18.221,7.206l9.585,9.585c0.879,0.879,0.879,2.317,0,3.195l-0.8,0.801c-0.877,0.878-2.316,0.878-3.194,0  l-7.315-7.315l-7.315,7.315c-0.878,0.878-2.317,0.878-3.194,0l-0.8-0.801c-0.879-0.878-0.879-2.316,0-3.195l9.587-9.585  c0.471-0.472,1.103-0.682,1.723-0.647C17.115,6.524,17.748,6.734,18.221,7.206z"
                  fill="#fff"
                />
              </svg>
              {Number(name) ? (
                <span key={nameMovie}>{nameMovie}</span>
              ) : (
                <span key={name}>{name}</span>
              )}
            </Fragment>
          ) : (
            <Fragment key={index}>
              <svg
                enableBackground="new 0 0 32 32"
                height="32px"
                id="Layer_1"
                version="1.1"
                viewBox="0 0 32 32"
                width="32px"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18.221,7.206l9.585,9.585c0.879,0.879,0.879,2.317,0,3.195l-0.8,0.801c-0.877,0.878-2.316,0.878-3.194,0  l-7.315-7.315l-7.315,7.315c-0.878,0.878-2.317,0.878-3.194,0l-0.8-0.801c-0.879-0.878-0.879-2.316,0-3.195l9.587-9.585  c0.471-0.472,1.103-0.682,1.723-0.647C17.115,6.524,17.748,6.734,18.221,7.206z"
                  fill="#fff"
                />
              </svg>
              <button
                className="path"
                onClick={() => navigate(routeTo)}
                key={name}
              >
                {name}
              </button>
            </Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default Breadcrumb;
