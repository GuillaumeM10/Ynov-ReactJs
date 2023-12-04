import api from "./api.service";

export type CrudServiceType = {
  popularMovies: (page?: number) => Promise<any>;
  getMovieById: (id: string) => Promise<any>;
  searchMovies: (query: string) => Promise<any>;
  getCredits: (id: string) => Promise<any>;
};

const popularMovies = async (page?: number) => {
  let endPoint: string = "/movie/popular";
  if (page) {
    endPoint = `/movie/popular?page=${page}`;
  }

  try{
    return (await api.get(endPoint)).data;
  }catch(err){
    console.log(err)
  }
};

const getMovieById = async (id: string) => {
  try{
    return (await api.get(`/movie/${id}`)).data;
  }catch(err){
    console.log(err)
  }
};

const searchMovies = async (query: string) => {
  try{
    return (await api.get(`/search/movie?query=${query}`)).data;
  }catch(err){
    console.log(err)
  }
}

const getCredits = async (id: string) => {
  try{
    return (await api.get(`/movie/${id}/credits`)).data;
  }catch(err){
    console.log(err)
  }
}

const CrudService: CrudServiceType = {
  popularMovies,
  getMovieById,
  searchMovies,
  getCredits
};

export default CrudService;
