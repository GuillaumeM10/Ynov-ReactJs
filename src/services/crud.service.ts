import api from "./api.service";

export type CrudServiceType = {
  popularMovies: (page?: number) => Promise<any>;
  getMovieById: (id: string) => Promise<any>;
};

const popularMovies = async (page?: number) => {
  let endPoint: string = "/movie/popular";
  if (page) {
    endPoint = `/movie/popular?page=${page}`;
  }
  return (await api.get(endPoint)).data;
};

const getMovieById = async (id: string) => {
  return await api.get(`/movie/${id}`);
};

const CrudService: CrudServiceType = {
  popularMovies,
  getMovieById,
};

export default CrudService;
